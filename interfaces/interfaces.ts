export interface User {
    _id: string;
    userName: string;
    signUpDate: number;
    admin: boolean;
    lang: string;
    inProgress: boolean;
    isSubscribed: boolean;
    currSessionMsgHistory: Message[];
    msgsHistory: Message[];
}

export interface Message {
    text: string;
    sender: any; // You can replace 'any' with the appropriate type for the sender object
    sentAt: Date | null;
}

export interface Sender {
    _id: string;
    name: string;
}

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
