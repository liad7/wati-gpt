import axios from 'axios'

const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
if (!accessToken) {
    throw new Error('WHATSAPP_ACCESS_TOKEN is not defined');
}

const url = process.env.WHATSAPP_URL!

export const whatsAppService = {
    downloadAudio
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
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const mediaUrl = response.data.url;

        // Download the media.
        const mediaResponse = await axios.get<MediaData>(mediaUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            responseType: 'arraybuffer', // This is important as it indicates that the response data should be returned as a Buffer.
        });

        return mediaResponse.data;
    } catch (error) {
        console.error(error);
        throw error;  // Re-throw the error to be handled by the caller of this function.
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