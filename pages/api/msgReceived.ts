import { NextApiRequest, NextApiResponse } from 'next'
import { googleTranslateAPIService } from '../../services/api/googleTranslateAPI/googleTranslateAPI'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Process the webhook payload here
        const { body, headers } = req

        //get from req the waId
        //get from mongo the user attr by waId
        //check user for lang attr
        //if no detectLanguage(req.body.text)
        //else const = user.lang
        // google translate function translateText(req.body.text,"what the answer from before")
        //do getAnswerFromGpt function with the translation
        //google translate function from the ans from gpt
        //post to wati the response of it all

        // Send a response (if required)
        res.status(200).json({ message: 'Webhook received successfully' })
    } else {
        res.status(405).json({ message: 'Method Not Allowed' })
    }
}

const demoData = {
    "id": "1a2b3b4d5e6f7g8h9i10j",
    "created": "2022-10-14T05:53:01.3833674Z",
    "whatsappMessageId": "abcdefghi_jklmnop",
    "conversationId": "a1b2c3d4e5f6g7h8i9j10",
    "ticketId": "m1n2o3p4q5r6s7t8u9v10",
    "text": "Hello there",
    "type": "text",
    "data": null,
    "timestamp": "1665726781",
    "owner": false,
    "eventType": "message",
    "statusString": "SENT",
    "avatarUrl": null,
    "assignedId": "6343c17682538bf08459f5ed",
    "operatorName": "Wati User",
    "operatorEmail": "hello@wati.io",
    "waId": "911234567890",
    "messageContact": null,
    "senderName": "wati user",
    "listReply": null,
    "replyContextId": null
}