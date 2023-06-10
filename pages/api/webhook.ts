import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash';
import sanitize from 'mongo-sanitize';

import { googleTranslateAPIService } from '../../services/api/googleTranslateAPI/googleTranslateAPI'
import { usersService } from '../../services/users/users.service'
import { openAiService } from '../../services/api/openAi/openAi'
import { utilService } from '../../services/utils';
import { TranslatedTextResult } from '../../interfaces/interfaces';
import { whatsAppService } from '../../services/api/whatsAppApi/whatsApp.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method === 'POST') {
            let body = req.body;

            console.log(JSON.stringify(body, null, 2));

            if (body.object) {
                const message = _.get(body, 'entry[0].changes[0].value.messages[0]');

                if (message) {
                    const messageType = message.type;
                    // check if messageType is 'text' or 'audio', else return
                    const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
                    const _id = body.entry[0].changes[0].value.messages[0].from;
                    const sentAt = Date.now();
                    const userName = sanitize(body.entry[0].changes[0].value.contacts[0].profile.name);
                    let lang = 'en'
                    let msg_body

                    if (!(messageType === 'text' || messageType === 'audio')) {
                        console.log(`Unsupported message type: ${messageType}`);
                        await sendInSessionMsg(phone_number_id, _id, lang, `Sorry i can't understand any message except recording and text messages`);
                        res.status(200).json({ message: "Message type not supported." });
                        return;
                    }

                    if (message.type === 'audio') {
                        // Extract the audio file ID
                        const audioFileId = message.audio.id;

                        whatsAppService.downloadAudio(audioFileId)

                        // Handle the audio message. For now, let's log the ID
                        console.log(`Received an audio message with ID: ${audioFileId}`);
                        return
                    } else {
                        msg_body = sanitize(body.entry[0].changes[0].value.messages[0].text.body);
                    }

                    let answer
                    let user
                    let answerFromTranslate

                    try {
                        user = await usersService.getUserById(_id);

                    } catch (err) {
                        console.log(`err fetching user from mongo with the id :${_id}`, err)
                    }

                    try {
                        answerFromTranslate = await translateMsg(msg_body) as TranslatedTextResult
                        lang = answerFromTranslate?.detectedSourceLanguage

                    } catch (err) {
                        console.log(`err from fetching mongo user with ${_id}`, err)
                    }

                    if (user && user.inProgress) {

                        await sendInSessionMsg(phone_number_id, _id, lang, 'אני עוד מטפל בבקשה הקודמת');
                        return
                    }
                    await sendInSessionMsg(phone_number_id, _id, lang);

                    if (user) {
                        user.inProgress = true;
                        await usersService.update(user);

                        //!did not finish here
                        console.log(' utilService.checkTextForSearchSuggestion(translatedReceivedMsg):', utilService.checkTextForSearchSuggestion(answerFromTranslate?.translatedText))

                    } else {
                        const currSessionMsgHistory = usersService.getEmptyMsg(msg_body, _id, userName);
                        user = usersService.getEmptyUser(_id, userName, sentAt, currSessionMsgHistory);

                        // Save user msg on session back to mongo
                        usersService.saveUser(user);
                    }

                    if (answerFromTranslate?.translatedText) {
                        user.currSessionMsgHistory.push(usersService.getEmptyMsg(answerFromTranslate?.translatedText, _id, userName, sentAt));
                    } else if (answerFromTranslate?.translatedText === null) {
                        //! put a handle for fail
                    }

                    try {
                        answer = await openAiService.getAnswerFromGpt(user._id, user.currSessionMsgHistory).catch(err => {
                            console.error("Error in getting answer from GPT: ", err);
                            throw err; // rethrow the error
                        });
                    } catch (err) {
                        // Handle the error here if needed
                    }

                    // Use translatedReceivedMsg and answer here
                    user.currSessionMsgHistory.push(usersService.getEmptyMsg(answer, '972557044192', 'assistant', Date.now()));

                    // Translate answer back to Hebrew
                    answerFromTranslate = await translateMsg(answer as string, lang)

                    // Send the response message
                    if (answerFromTranslate?.translatedText == '') {
                        throw new Error('Translation resulted in empty message, not sending.');
                    }
                    await sendInSessionMsg(phone_number_id, _id, lang, answerFromTranslate?.translatedText);

                    // Save user to mongo and update inProgress to false
                    user.inProgress = false;
                    await usersService.update(user);
                } else {
                    console.log('Invalid body data: The expected entry or message data is missing.');
                }

                res.status(200).json({ message: "Request processed successfully." });

            } else {
                res.status(400).json({ error: "Request body does not contain the expected 'object' property." });
            }
        } else if (req.method === 'GET') {
            //! secure the body _id script and ??? and shit like that

            const verify_token = process.env.VERIFY_TOKEN;
            let mode = req.query['hub.mode'];
            let token = req.query['hub.verify_token'];
            let challenge = req.query['hub.challenge'];

            if (mode && token) {
                if (mode === 'subscribe' && token === verify_token) {
                    console.log('WEBHOOK_VERIFIED');
                    res.status(200).send(challenge);
                } else {
                    res.status(403).end();
                }
            }
        } else {
            res.status(405).end(); // Method Not Allowed
        }
    } catch (error) {
        console.error('An error occurred while processing the webhook:', error);
        res.status(200).json({ message: 'Webhook received but an error occurred while processing.' });
    }

}

async function sendInSessionMsg(phone_number_id: string, _id: string, lang: string, msg = "קיבלתי את ההודעה שלך אני על זה") {
    const autoReplay = await translateMsg(msg, lang)

    try {
        await axios.post(
            `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${process.env.WHATSAPP_TOKEN}`,
            {
                messaging_product: 'whatsapp',
                to: _id,
                text: { body: autoReplay?.translatedText },
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return true
    } catch (err) {
        console.log(`Error sending message for user ${_id}:`, err);
        return false
    }
}

async function translateMsg(msg_body: string, target: string = 'en'): Promise<TranslatedTextResult | null> {
    try {
        return await googleTranslateAPIService.translateText(msg_body, target);
    } catch (err) {
        console.error("Error in translating received message: ", err);
        return null; // assign null to translatedReceivedMsg
    }
}
