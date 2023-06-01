
import { ChatCompletionResponseMessage } from "openai/dist/api";
import openai from "./config-open";

export const openAiService = {
    getAnswerFromGpt
}

async function getAnswerFromGpt(prompt: string): Promise<string> {
// async function getAnswerFromGpt(prompt: string): Promise<ChatCompletionResponseMessage> {

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        })

        return completion.data.choices[0].message!
    } catch (err) {
        console.log('heerrrr:')
        throw (err)
    }
}