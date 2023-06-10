import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(JSON.stringify(req.body, null, 2));

    if (req.body.object) {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const messages = changes?.value?.messages?.[0];
        const phone_number_id = changes?.value?.metadata?.phone_number_id;

        if (entry && changes && messages) {
            const from = messages.from;
            const msg_body = messages.text?.body;

            const token = process.env.WHATSAPP_TOKEN;

            await axios.post(
                `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${token}`,
                {
                    messaging_product: "whatsapp",
                    to: from,
                    text: { body: "Ack: " + msg_body },
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        res.status(200).end();
    } else {
        res.status(404).end();
    }
}
