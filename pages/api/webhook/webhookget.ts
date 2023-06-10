import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const verify_token = process.env.VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode && token && mode === "subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge as string);
    } else {
        res.status(403).end();
    }
}
