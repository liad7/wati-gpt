import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { googleTranslateAPIService } from '../../services/api/googleTranslateAPI/googleTranslateAPI'
import { usersService } from '../../services/users/users.service'
import { openAiService } from '../../services/api/openAi/openAi'
import { useTransition } from 'react'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        let body = req.body;

        console.log(JSON.stringify(body, null, 2));

        if (body.object) {
            // if (
            //     body.entry &&
            //     body.entry[0].changes &&
            //     body.entry[0].changes[0] &&
            //     body.entry[0].changes[0].value.messages &&
            //     body.entry[0].changes[0].value.messages[0]
            // ) {
            //     let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            //     let _id = body.entry[0].changes[0].value.messages[0].from;
            //     let sentAt = Date.now()
            //     let userName = body.entry[0].changes[0].value.contacts[0].profile.name;
            //     let msg_body = body.entry[0].changes[0].value.messages[0].text.body;

            //     // fetch the user _id mongo

            //     let user = await usersService.getUserById(_id)
            //     if (user.inProgress) {
            //         await sendInSessionMsg(phone_number_id, _id, 'אני עוד מטפל בבקשה הקודמת')

            //     } else {

            //         await sendInSessionMsg(phone_number_id, _id)

            //         if (!user) {
            //             const currSessionMsgHistory = usersService.getEmptyMsg(msg_body, _id, userName)
            //             user = usersService.getEmptyUser(_id, userName, sentAt, currSessionMsgHistory)

            //             // save user msg on session back to mongo
            //             usersService.saveUser(user)
            //         }
            //         user.currSessionMsgHistory.push(usersService.getEmptyMsg(msg_body, _id, userName, sentAt))
            //         user.inProgress = true
            //         usersService.update(user)

            //         // Translate the received message to Hebrew
            //         const translatedReceivedMsg = await googleTranslateAPIService.translateText(msg_body);
            //         // Get answer from GPT
            //         let answer = await openAiService.getAnswerFromGpt(translatedReceivedMsg);
            //         // Translate answer back to English
            //         const translatedAnswerMsg = await googleTranslateAPIService.translateText(answer, 'he');

            //         // Send the response message
            //         if (translatedAnswerMsg == '') return
            //         await sendInSessionMsg(phone_number_id, _id, translatedAnswerMsg)
            //         // save user to mongo and update inProgress to false

            //         user.currSessionMsgHistory.push(usersService.getEmptyMsg(translatedAnswerMsg, '972557044192', 'assistant', Date.now()))
            //         user.inProgress = false

            //         usersService.update(user)

            //     }

            // } else {
            //     console.log('wrong:')
            // }
            // res.status(200).end();
        } else {
            res.status(404).end();
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
}

async function sendInSessionMsg(phone_number_id: string, _id: string, msg = "קיבלתי את ההודעה שלך אני על זה") {
    try {
        await axios.post(
            `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${process.env.WHATSAPP_TOKEN}`,
            {
                messaging_product: 'whatsapp',
                to: _id,
                text: { body: msg },
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return true
    } catch (err) {
        console.log('err from sendInSessionMsg ', err)
        return false
    }
}