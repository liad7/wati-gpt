// Import necessary modules and types

import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash';
import sanitize from 'mongo-sanitize';

// Import service dependencies
import { googleTranslateAPIService } from '../../../services/api/googleTranslateAPI/googleTranslateAPI'
import { usersService } from '../../../services/users/users.service'
import { openAiService } from '../../../services/api/openAi/openAi'
import { utilService } from '../../../services/utils';
import { TranslatedTextResult, User } from '../../../interfaces/interfaces';
import { whatsAppService } from '../../../services/api/whatsAppApi/whatsApp.service';

// Main function to handle the API requests
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        // Process POST requests
        if (req.method === 'POST') {

            // Get the request body
            let body = req.body;

            console.log(JSON.stringify(body, null, 2));

            if (body.object) {
                const message = _.get(body, 'entry[0].changes[0].value.messages[0]');

                if (message) {
                    const messageType = message.type;
                    const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
                    const _id = body.entry[0].changes[0].value.messages[0].from;
                    const sentAt = Date.now();
                    let userName
                    userName = sanitize(body.entry[0].changes[0].value.contacts[0].profile.name);
                    let answer

                    let answerFromTranslate
                    let lang = 'en'
                    let msg_body
                    let user: User = {
                        _id: '',
                        userName: '',
                        signUpDate: 0,
                        admin: false,
                        lang: '',
                        inProgress: false,
                        isSubscribed: false,
                        currSessionMsgHistory: [],
                        msgsHistory: []
                    }

                    if (messageType === 'text') {
                        msg_body = sanitize(body.entry[0].changes[0].value.messages[0].text.body);
                        try {
                            answerFromTranslate = await googleTranslateAPIService.translateMsg(msg_body) as TranslatedTextResult
                            lang = answerFromTranslate?.detectedSourceLanguage
                        } catch (err) {
                            // todo change error message
                            console.log(`err from fetching mongo user with ${_id}`, err)
                        }
                    }

                    if (!(messageType === 'text' || messageType === 'interactive')) {
                        // if (!(messageType === 'text' || messageType === 'audio' || messageType === 'interactive')) {
                        await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, `I can't understand any message except text messages`);
                        // await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, `I can't understand any message except recording and text messages`);
                        res.status(200).json({ message: "Message type not supported." });
                        return;
                    }

                    if (messageType === 'audio') {
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
                                console.log('_id: ', _id);
                                user = await usersService.getUserById(_id)
                                console.log('user: from inter ', user);
                                lang = user.lang
                            } catch (err) {
                                console.log(`err fetching user from mongo with the id :${_id}`, err)
                            }
                            user['isSubscribed'] = true
                        }
                        try {
                            await updateInProgress(user, false)
                            console.log('user after update: ', user);
                        } catch (err) {
                            console.log('err from update interactive', err)
                        }
                        try {

                            await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, 'מעולה! איך אוכל לעזור?');
                        } catch (err) {
                            console.log('err', err)

                        }

                        res.status(200).json({ message: "Got inter" });
                        return;
                    }

                    try {
                        user = await usersService.getUserById(_id);
                        lang = user.lang
                    } catch (err) {
                        console.log(`err fetching user from mongo with the id :${_id}`, err)
                    }

                    if (user) {
                        if (user.inProgress) {
                            await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, 'אני עוד מטפל בבקשה הקודמת');
                            res.status(200).json({ message: "User in progress" });
                            return;
                        } else {
                            try {
                                updateInProgress(user, true)
                            } catch (err) {
                                console.log('err could not update user in the End', err)
                            }
                        }

                        //!did not finish here
                        console.log(' utilService.checkTextForSearchSuggestion(translatedReceivedMsg):', utilService.checkTextForSearchSuggestion(answerFromTranslate?.translatedText))

                    } else {
                        const currSessionMsgHistory = usersService.getEmptyMsg(msg_body, _id, userName);
                        user = usersService.getEmptyUser(_id, userName, sentAt, currSessionMsgHistory);

                        // Save user msg on session back to mongo
                        usersService.saveUser(user);
                    }

                    if (!user.isSubscribed) {
                        const terms = 'https://edgarbot.io/terms'
                        const privacy = 'https://edgarbot.io/privacy'
                        const preButtonMsg = `היי אני אדגר ואני עוזר אישי עם בינה מלאכותית, אני פועל דרך - ChatGPT | OPEN.AI . חשוב לשים לב כדי שאוכל לעזור לך, חובה עלייך לעבור על התקנון ועל מדיניות הפרטיות שיש כאן ומיד אחרי ללחוץ על הכפתור ״יש אישור״. הנה לינק לתקנון: ${terms} לינק למדיניות פרטיות: ${privacy}`
                        // await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang, preButtonMsg);
                        try {
                            await updateInProgress(user, false)
                            console.log('user after update: ', user);
                        } catch (err) {
                            console.log('err from update interactive', err)
                        }
                        await whatsAppService.sendButtonMessage(phone_number_id, _id, 'יש אישור', 'approvedSubscribed', lang, preButtonMsg)
                        res.status(200).json({ message: "Did not approved terms and conditions." });
                        return;
                    }

                    await whatsAppService.sendInSessionMsg(phone_number_id, _id, lang);

                    if (answerFromTranslate?.translatedText) {
                        user.currSessionMsgHistory.push(usersService.getEmptyMsg(answerFromTranslate?.translatedText, _id, userName, sentAt));
                    } else if (answerFromTranslate?.translatedText === null) {
                        try {
                            await updateInProgress(user, false)
                            console.log('user after update: ', user);
                        } catch (err) {
                            console.log('err from update interactive', err)
                        }
                        res.status(200).json({ message: "there is no text back from translation" });
                        return;
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
                    try {
                        updateInProgress(user, false)
                    } catch (err) {
                        console.log('err could not update user in the End', err)
                    }
                } else {
                    console.log('Invalid body data: The expected entry or message data is missing.');
                }

                res.status(200).json({ message: "Request processed successfully." });

            } else {
                res.status(400).json({ error: "Request body does not contain the expected 'object' property." });
            }
        } else if (req.method === 'GET') {
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

async function updateInProgress(user: User, inProgress: boolean) {
    user.inProgress = inProgress;
    try {
        await usersService.update(user);
    } catch (err) {
        console.log('err could not update user', err)
    }
    return user
}