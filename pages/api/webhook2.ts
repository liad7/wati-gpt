import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { googleTranslateAPIService } from '../../services/api/googleTranslateAPI/googleTranslateAPI'
// import { getContactById, update } from '../../lib/mongo/users'
import { openAiService } from '../../services/api/openAi/openAi'

// Create a cache object to remember recent messages
const messageCache = new Map<string, number>();
const responseCache = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        let body = req.body;
        console.log(JSON.stringify(body, null, 2));

        //     if (body.object) {
        //         if (
        //             body.entry &&
        //             body.entry[0].changes &&
        //             body.entry[0].changes[0] &&
        //             body.entry[0].changes[0].value.messages &&
        //             body.entry[0].changes[0].value.messages[0]
        //         ) {
        //             let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
        //             let from = body.entry[0].changes[0].value.messages[0].from;
        //             let msg_body = body.entry[0].changes[0].value.messages[0].text.body;
        //             let userId = from; // Assuming 'from' contains the user ID

        //             const now = Date.now();
        //             const twoMinutesAgo = now - 2 * 60 * 1000;
        //             const lastReceivedTime = messageCache.get(userId) || 0;
        //             const lastSentResponseTime = responseCache.get(userId) || 0;

        //             // Check if the user sent a message within the last 2 minutes
        //             if (lastReceivedTime > twoMinutesAgo) {
        //                 // Check if a response was sent within the last 2 minutes
        //                 if (lastSentResponseTime > twoMinutesAgo) {
        //                     // Send immediate response message
        //                     fastResponse(phone_number_id, from)

        //                     // Update the timestamp for the current message in the cache
        //                     messageCache.set(userId, now);

        //                     // Translate the received message to Hebrew
        //                     const translatedReceivedMsg = await googleTranslateAPIService.translateText(msg_body);

        //                     // Get answer from GPT
        //                     let answer = await openAiService.getAnswerFromGpt(translatedReceivedMsg);

        //                     // Translate answer back to English
        //                     const translatedAnswerMsg = await googleTranslateAPIService.translateText(answer, 'he');

        //                     // Update the timestamp for this response in the cache
        //                     responseCache.set(userId, now);

        //                     // Send the response message
        //                     await axios.post(
        //                         `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${process.env.WHATSAPP_TOKEN}`,
        //                         {
        //                             messaging_product: 'whatsapp',
        //                             to: from,
        //                             text: { body: translatedAnswerMsg },
        //                         },
        //                         {
        //                             headers: { 'Content-Type': 'application/json' },
        //                         }
        //                     );

        //                 } else {
        //                     fastResponse(phone_number_id, from, 'אני עוד עובד על זה כמה דקות')
        //                 }
        //             } else {
        //                 fastResponse(phone_number_id, from, 'אני עוד עובד על זה כמה דקות')
        //             }
        //         }
        //         res.status(200).end();
        //     } else {
        //         res.status(404).end();
        //     }
        // } else if (req.method === 'GET') {
        //     const verify_token = process.env.VERIFY_TOKEN;
        //     let mode = req.query['hub.mode'];
        //     let token = req.query['hub.verify_token'];
        //     let challenge = req.query['hub.challenge'];

        //     if (mode && token) {
        //         if (mode === 'subscribe' && token === verify_token) {
        //             console.log('WEBHOOK_VERIFIED');
        //             res.status(200).send(challenge);
        //         } else {
        //             res.status(403).end();
        //         }
        //     }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}

async function fastResponse(phone_number_id: string, from: string, msg = "קיבלתי את ההודעה שלך אני על זה") {
    await axios.post(
        `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${process.env.WHATSAPP_TOKEN}`,
        {
            messaging_product: 'whatsapp',
            to: from,
            text: { body: msg },
        },
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
}