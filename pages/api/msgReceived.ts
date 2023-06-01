import { NextApiRequest, NextApiResponse } from 'next'
import {googleTranslateAPIService } from '../../services/api/googleTranslateAPI/googleTranslateAPI'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Process the webhook payload here
        const { body, headers } = req
        const { text } = body
        // Handle the webhook data
        // ...
        googleTranslateAPIService.detectLanguage(text).then(res => googleTranslateAPIService.translateText(text, res).then(console.log))


        // Send a response (if required)
        res.status(200).json({ message: 'Webhook received successfully' })
    } else {
        res.status(405).json({ message: 'Method Not Allowed' })
    }
}