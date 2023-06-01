const axios = require('axios')

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
export const googleTranslateAPIService = {
    detectLanguage,
    translateText,
}

async function detectLanguage(input: string): Promise<string> {
    try {
        const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}&q=${encodeURI(input)}`

        const res = await axios.post(url)
        const detectedLanguage: string = res.data.data.detections[0][0].language
        // console.log(`Detected language: ${detectedLanguage}`)

        return detectedLanguage === 'iw' ? 'he' : detectedLanguage
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

async function translateText(input: string, sourceLanguage: string): Promise<string | undefined> {
    try {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURI(input)}&source=${sourceLanguage}&target=en`

        const res = await axios.post(url)
        const translatedText: string = res.data.data.translations[0].translatedText
        // console.log(`Translated text: ${translatedText}`)

        return translatedText
    } catch (error) {
        console.error('Error:', error)
        return undefined
    }
}
