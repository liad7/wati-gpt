import axios from 'axios'

const BASE_URL = process.env.WATI_URL!

export const watiService = {
    getContacts,
    getChatHistory,
    sendWatiSessionMessage,
    getContactByWaId
}

async function getContacts() {
    const options = {
        method: 'GET',
        url: BASE_URL + 'getContacts',
        headers: {
            Authorization: `${process.env.WATI_ACCESS_TOKEN!}`
        }
    }

    try {
        const res = await axios.request(options)
        return res.data
    } catch (err) {
        console.error(err)
    }
}

async function getChatHistory(phoneNum: string) {
    const options = {
        method: 'GET',
        url: `${BASE_URL}getMessages/${phoneNum}`,
        headers: {
            Authorization: `${process.env.WATI_ACCESS_TOKEN!}`
        }
    }

    try {
        const res = await axios.request(options)
        return res.data
    } catch (err) {
        console.error(err)
    }
}

async function sendWatiSessionMessage(phoneNumber: string, message: string) {
    console.log('phoneNumber: ', phoneNumber);
    console.log('message to send to wati: ', message);
    const options = {
        method: 'POST',
        url: `${BASE_URL}sendSessionMessage/${phoneNumber}`,
        params: { messageText: message },
        headers: {
            Authorization: `${process.env.WATI_ACCESS_TOKEN!}`
        }
    }

    try {
        const res = await axios.request(options)
        console.log('res.data: ', res.data);
        return res.data
    } catch (err) {
        console.error('Error from sendWatiSessionMessage :', err)
        console.log('err: ', err);
        throw err
    }
}

async function getContactByWaId(waId: string) {

    const options = {
        method: 'GET',
        url: `${BASE_URL}getContacts`,
        params: {
            attribute: `[{ name: "phone", operator: "contain", value: ${waId} }]`
        },
        headers: {
            Authorization: `${process.env.WATI_ACCESS_TOKEN!}`
        }
    };

    try {
        const res = await axios.request(options)
        return res.data.contact_list[0]
    } catch (err) {
        console.error(err)
    }
}

// Usage
// sendWatiSessionMessage('+1234567890', 'Hello, this is a test message');

// async function getParamsByChatHistory() {
//     const contacts = await getContacts()
//     const contactPhones = contacts.contact_list.reduce((acc: any[], curr: { wAid: any; }) => {
//         acc.push(curr.wAid)
//         return acc
//       }, [])
// }
