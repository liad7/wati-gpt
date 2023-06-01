import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Process the webhook payload here
        const { body, headers } = req

        // Handle the webhook data
        // ...

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