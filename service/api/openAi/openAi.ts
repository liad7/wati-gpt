
import openai from "./config-open";

export const openAiService = {
    getAnswerFromGpt
}

async function getAnswerFromGpt(prompt: string) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `make me a trello board with for a ${prompt} project with detailed tasks for each column, each column headline should be presented with only one dollar sign  infront of it, and each task should be presented with only one infinity symbol infront of it`,
            temperature: 0.7,
            max_tokens: 160,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        });
        return response.data.choices[0].text
    } catch (err) {
    }
}