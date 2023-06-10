import { NextApiRequest, NextApiResponse } from 'next'
import { googleTranslateAPIService } from '../../services/api/googleTranslateAPI/googleTranslateAPI'

import { openAiService } from '../../services/api/openAi/openAi'
import { watiService } from '../../services/api/wati/wati'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        //get from req the waId
        ////////from here
        // const { text, waId, senderName } = req.body
        // console.log('req.body: ', req.body);
        // watiService.sendWatiSessionMessage(waId, 'קבלתי את ההודעה שלך יקח לי קצת זמן לענות')
        ////////so far

        //check if its first time msg
        //if yes need to do get contact from wati and then save it to mongo

        // //get from mongo the user attr by waId
        // const user = await getContactById('contact', waId)

        // let { lang } = user
        // //check user for lang attr
        // if (!lang) {
        //     //if no detectLanguage(req.body.text)
        //     lang = await googleTranslateAPIService.detectLanguage(text)
        //     update('contact', { ...user, lang })
        // 
        ////////from here

        // let lang = await googleTranslateAPIService.detectLanguage(text)
        // let lang = 'he'
        // const translatedReceivedMsg = await googleTranslateAPIService.translateText(text, lang)
        // let answer = await openAiService.getAnswerFromGpt(translatedReceivedMsg)
        // const translatedAnswerMsg = await googleTranslateAPIService.translateText(answer, 'en', lang)

        // // const user = await watiService.getContactByWaId(waId)
        // watiService.sendWatiSessionMessage(waId, translatedAnswerMsg)
        ////////so far
        // const user = await watiService.getContactByWaId(waId)
        // //else const = user.lang
        // // google translate function translateText(req.body.text,"what the answer from before")
        // const translatedReceivedMsg = await googleTranslateAPIService.translateText(text, lang)
        // //do getAnswerFromGpt function with the translation
        // let answer = await openAiService.getAnswerFromGpt(translatedText as string)
        // //google translate function from the ans from gpt
        // if (lang !== 'en') {
        //     answer = await googleTranslateAPIService.translateText(answer, 'en', lang)
        // }
        // //post to wati the response of it all
        // watiService.sendWatiSessionMessage(waId, answer)

        // // Send a response (if required)

        res.status(200).json({ message: 'Webhook received successfully' })
    } else {
        res.status(405).json({ message: 'Method Not Allowed' })
    }
}
