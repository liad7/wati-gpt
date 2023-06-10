import { NextApiRequest, NextApiResponse } from 'next'

import { whatsAppService } from '../../services/api/whatsAppApi/whatsApp.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        // // console.log('req.body: ', req.body);
        // console.log('inside:')
        // try {
        //     whatsAppService.sendWhatsappMsg()

        // } catch (err) {
        //     console.log('err from front', err)
        //     throw Error
        // }

        res.status(200).json({ message: 'Webhook received successfully' })
    } else {
        res.status(405).json({ message: 'Method Not Allowed' })
    }
}
