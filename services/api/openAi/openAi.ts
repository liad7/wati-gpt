
import { ChatCompletionResponseMessage } from "openai/dist/api";
import openai from "./config-open";

export const openAiService = {
    getAnswerFromGpt,
    getAnswerFromGpt2
}
type GPTMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

type Sender = {
    _id: string;
    name: string;
}

type UserMsg = {
    text: string;
    sender: Sender;
    sentAt: number;
}

type CurrSessionMsgHistory = UserMsg[];

async function getAnswerFromGpt2(prompt: string): Promise<string> {
    console.log('prompt: ', prompt);
    // async function getAnswerFromGpt(prompt: string): Promise<ChatCompletionResponseMessage> {

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        })

        return completion.data.choices[0].message?.content!
    } catch (err) {
        console.log('err from getAnswerFromGpt:', err)
        console.error('err from getAnswerFromGpt:', err)
        throw (err)
    }
}

// Function to send the prompt, user ID, and message history to the ChatGPT API and get the answer
async function getAnswerFromGpt(userId: string, currSessionMsgHistory: CurrSessionMsgHistory): Promise<string> {
    try {

        const msgToSpread: GPTMessage[] = currSessionMsgHistory.reduce((acc: GPTMessage[], curr: UserMsg) => {
            if (curr.sender._id === "972557044192") acc.push({ role: 'assistant', content: curr.text })
            else acc.push({ role: 'user', content: curr.text })
            return acc
        }, [])

        const messages: GPTMessage[] = [
            { role: 'system', content: 'You are a helpful assistant. Your name is Edgar' },
            ...msgToSpread
        ];

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            user: userId,
        });

        return completion.data.choices[0].message?.content!;
    } catch (err) {
        const error = err as Error;
        console.error(`Error while getting answer from GPT for user with ID: ${userId}. Message history: ${JSON.stringify(currSessionMsgHistory)}. Error: ${error}`);
        return "I'm sorry, I'm currently facing some issues. Please try again later.";
    }
}

// async function getAnswerFromGpt(prompt: string): Promise<string> {
//     console.log('prompt: ', prompt);
//     // async function getAnswerFromGpt(prompt: string): Promise<ChatCompletionResponseMessage> {

//     try {
//         const completion = await openai.createChatCompletion({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "user", content: prompt }],
//         })

//         return completion.data.choices[0].message?.content!
//     } catch (err) {
//         console.log('error from getAnswerFromGpt:', err)
//         console.error('error from getAnswerFromGpt:', err)
//         throw (err)
//     }
// }