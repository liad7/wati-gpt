import axios, { AxiosResponse } from 'axios';
import { TranslatedTextResult, TranslationResponse } from "../../../interfaces/interfaces"

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

export const googleTranslateAPIService = {
    detectLanguage,
    translateText,
}

async function detectLanguage(input: string): Promise<string> {
    try {
        const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}&q=${encodeURI(input)}`

        const res = await axios.post(url)
        // console.log(`Detected language: ${detectedLanguage}`)
        if (!res.data || !res.data.data || !res.data.data.detections) {
            throw new Error("Invalid response from API");
        }
        const detectedLanguage: string = res.data.data.detections[0][0].language

        return detectedLanguage === 'iw' ? 'he' : detectedLanguage
    } catch (err) {
        console.error('Error from detectLanguage:', err);
        throw err;
    }
}

async function translateText(input: string, target: string): Promise<TranslatedTextResult> {
    try {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&target=${target}&format=text`;

        // Prepare the request body
        const requestBody = {
            q: input,
            target: target
        };

        // Send the request
        const res: AxiosResponse<TranslationResponse> = await axios.post<TranslationResponse>(url, requestBody);
        const translatedText: string = res.data.data.translations[0].translatedText;
        const detectedSourceLanguage = res.data.data.translations[0].detectedSourceLanguage === 'iw' ? 'he' : res.data.data.translations[0].detectedSourceLanguage

        return { translatedText, detectedSourceLanguage };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error from translateText :', err.message);
        } else {
            console.error('An unknown error occurred in translateText.');
        }
        throw err;
    }
}
