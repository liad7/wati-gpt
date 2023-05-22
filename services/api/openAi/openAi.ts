
import openai from "./config-open";

export const openAiService = {
    getAnswerFromGpt
}

async function getAnswerFromGpt(prompt: string) {
    console.log('prompt: ', prompt);
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        })
        const { role, content } = completion.data.choices[0].message!

        console.log('content: ', content);
        console.log('role: ', role);

    } catch (err) {

        console.log('heerrrr:')
        throw (err)
    }
}