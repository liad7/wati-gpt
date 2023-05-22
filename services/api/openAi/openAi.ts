
import openai from "./config-open";

export const openAiService = {
    getAnswerFromGpt
}

async function getAnswerFromGpt(prompt: string) {
    try {
        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: `${prompt}`,
            temperature: 0.7,
            max_tokens: 160,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        });
        return response.data.choices[0].text
    } catch (err) {
        throw (err)
    }
}