

export interface TranslatedTextResult {
    translatedText: string;
    detectedSourceLanguage: string;
}

export interface TranslationResponse {
    data: {
        translations: Array<{
            translatedText: string;
            detectedSourceLanguage: string;
        }>
    }
}

export { }
