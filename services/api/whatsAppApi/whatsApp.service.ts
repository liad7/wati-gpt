import axios from 'axios'
import { googleTranslateAPIService } from '../googleTranslateAPI/googleTranslateAPI';

const whatsappToken = process.env.WHATSAPP_TOKEN
if (!whatsappToken) {
    throw new Error('WHATSAPP_ACCESS_TOKEN is not defined');
}

const url = process.env.WHATSAPP_URL!

export const whatsAppService = {
    downloadAudio,
    sendInSessionMsg,
    sendButtonMessage
}

// Define a type for the response from the `/MEDIA_ID` endpoint.
type MediaResponse = {
    messaging_product: string;
    url: string;
    mime_type: string;
    sha256: string;
    file_size: string;
    id: string;
};

// Define a type for the binary data of the media.
type MediaData = Buffer;

// Define a async function to download audio from WhatsApp.
async function downloadAudio(mediaId: string): Promise<MediaData> {
    try {
        // Retrieve the URL for the media.
        const response = await axios.get<MediaResponse>(`https://graph.facebook.com/v17.0/${mediaId}`, {
            headers: {
                'Authorization': `Bearer ${whatsappToken}`,
            },
        });

        const mediaUrl = response.data.url;

        // Download the media.
        const mediaResponse = await axios.get<MediaData>(mediaUrl, {
            headers: {
                'Authorization': `Bearer ${whatsappToken}`,
            },
            responseType: 'arraybuffer', // This is important as it indicates that the response data should be returned as a Buffer.
        });

        return mediaResponse.data;
    } catch (error) {
        console.error(error);
        throw error;  // Re-throw the error to be handled by the caller of this function.
    }
}

async function sendInSessionMsg(phone_number_id: string, _id: string, lang: string, msg = "קיבלתי את ההודעה שלך אני על זה") {
    const translatedMsg = await googleTranslateAPIService.translateMsg(msg, lang)

    try {
        await axios.post(
            `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${whatsappToken}`,
            {
                messaging_product: 'whatsapp',
                to: _id,
                text: { body: translatedMsg?.translatedText },
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return true
    } catch (err) {
        console.log(`Error sending message for user ${_id}:`, err);
        return false
    }
}

async function sendButtonMessage(phone_number_id: string, _id: string, buttonText1: string, buttonId1: string, lang: string, msgText: string) {
    const translatedMsg = await googleTranslateAPIService.translateMsg(msgText, lang)
    const buttonMsg = await googleTranslateAPIService.translateMsg(buttonText1, lang)

    try {
        await axios.post(
            `https://graph.facebook.com/v17.0/${phone_number_id}/messages?access_token=${whatsappToken}`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: _id,
                type: 'interactive',
                interactive: {
                    type: 'button',
                    body: {
                        text: translatedMsg?.translatedText
                    },
                    action: {
                        buttons: [
                            {
                                type: 'reply',
                                reply: {
                                    id: buttonId1,
                                    title: buttonMsg?.translatedText
                                }
                            }
                        ]
                    }
                }
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return true;
    } catch (err) {
        console.log(`Error sending button message for user ${_id}:`, err);
        return false;
    }
}

// async function sendWhatsappMsg() {
//     const data = {
//         messaging_product: 'whatsapp',
//         to: '972545434384',
//         type: 'template',
//         template: {
//             name: 'hello_world',
//             language: {
//                 code: 'en_US',
//             },
//         },
//     };

//     const headers = {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//     };

//     try {
//         const response = await axios.post(url, data, { headers });
//         console.log('Message sent successfully:', response.data);

//     } catch (error) {
//         console.log('error: ', error);
//         console.error('Error sending message:', error);
//     }
// };