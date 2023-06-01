import { NextApiRequest, NextApiResponse } from 'next'
import { googleTranslateAPIService } from '../../services/api/googleTranslateAPI/googleTranslateAPI'
import { getContactById, update } from '../../lib/mongo/contact'
import { openAiService } from '../../services/api/openAi/openAi'
import { watiService } from '@/services/api/wati/wati'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        //get from req the waId
        const { text, waId } = req.body

        //get from mongo the user attr by waId
        const user = await getContactById('contact', waId)
        let { lang } = user
        //check user for lang attr
        if (!lang) {
            //if no detectLanguage(req.body.text)
            lang = await googleTranslateAPIService.detectLanguage(text)
            update('contact', { ...user, lang })
        }
        //else const = user.lang
        // google translate function translateText(req.body.text,"what the answer from before")
        const translatedText = await googleTranslateAPIService.translateText(text, lang)
        //do getAnswerFromGpt function with the translation
        let answer = await openAiService.getAnswerFromGpt(translatedText as string)
        //google translate function from the ans from gpt
        if (lang !== 'en') {
            answer = await googleTranslateAPIService.translateText(answer, 'en', lang)
        }
        //post to wati the response of it all
        watiService.sendWatiMessage(waId, answer)

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