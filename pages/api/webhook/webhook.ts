import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash';
import sanitize from 'mongo-sanitize';

import { googleTranslateAPIService } from '../../../services/api/googleTranslateAPI/googleTranslateAPI'
import { usersService } from '../../../services/users/users.service'
import { openAiService } from '../../../services/api/openAi/openAi'
import { utilService } from '../../../services/utils';
import { TranslatedTextResult } from '../../../interfaces/interfaces';
import { whatsAppService } from '../../../services/api/whatsAppApi/whatsApp.service';

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
                    let userName
                    userName = sanitize(body.entry[0].changes[0].value.contacts[0].profile.name);
                    let answer
                    let user
                    let answerFromTranslate
                    let lang = 'en'
                    let msg_body
                    if (messageType != 'interactive') {
                        msg_body = sanitize(body.entry[0].changes[0].value.messages[0].text.body);
                    }

                    try {
                        answerFromTranslate = await googleTranslateAPIService.translateMsg(msg_body) as TranslatedTextResult
                        lang = answerFromTranslate?.detectedSourceLanguage

                    } catch (err) {
                        console.log(`err from fetching mongo user with ${_id}`, err)
                    }

                    if (!(messageType === 'text' || messageType === 'interactive')) {
                        // if (!(messageType === 'text' || messageType === 'audio' || messageType === 'interactive')) {
                        console.log(`Unsupported message type: ${messageType}`);
                        await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, `I can't understand any message except text messages`);
                        // await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, `I can't understand any message except recording and text messages`);
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
                    }

                    if (messageType === 'interactive') {
                        const buttonId = message.interactive.button_reply.id;
                        if (buttonId === 'approvedSubscribed') {
                            try {
                                user = await usersService.getUserById(_id);
                            } catch (err) {
                                console.log(`err fetching user from mongo with the id :${_id}`, err)
                            }
                            user['isSubscribed'] = true
                            try {
                                await usersService.update(user);
                            } catch (err) {
                                console.log('err from update after subscribed', err)
                            }
                        }
                        res.status(200).json({ message: "Got inter" });
                        return;
                    }

                    try {
                        user = await usersService.getUserById(_id);

                    } catch (err) {
                        console.log(`err fetching user from mongo with the id :${_id}`, err)
                    }

                    if (!user.isSubscribed) {
                        const terms = 'https://bit.ly/3XeWCUp'
                        //! change this to website url
                        const privacy = 'https://bit.ly/3oVDH4a'
                        //! change this to website url
                        const preButtonMsg = `היי אני אדגר ואני עוזר אישי עם בינה מלאכותית, אני פועל דרך - ChatGPT | OPEN.AI . חשוב לשים לב כדי שאוכל לעזור לך, חובה עלייך לעבור על התקנון ועל מדיניות הפרטיות שיש כאן ומיד אחרי ללחוץ על הכפתור ״יש אישור״. הנה לינק לתקנון: ${terms} לינק למדיניות פרטיות: ${privacy}`
                        // await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, preButtonMsg);
                        await whatsAppService.sendButtonMessage(phone_number_id, _id, 'יש אישור', 'approvedSubscribed', lang, preButtonMsg)
                        res.status(200).json({ message: "Did not approved terms and conditions." });
                        return;
                    }

                    if (user?.inProgress) {
                        await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, 'אני עוד מטפל בבקשה הקודמת');
                        return
                    }
                    await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang);

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
                    answerFromTranslate = await googleTranslateAPIService.translateMsg(answer as string, lang)

                    // Send the response message
                    if (answerFromTranslate?.translatedText == '') {
                        throw new Error('Translation resulted in empty message, not sending.');
                    }
                    await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, answerFromTranslate?.translatedText);

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
