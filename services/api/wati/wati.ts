import axios from 'axios'

const BASE_URL = 'https://live-server-105712.wati.io/api/v1/'

export const watiService = {
    getContacts,
    getChatHistory,
    sendWatiMessage,
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

async function getChatHistory(phoneNum:string) {
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

async function sendWatiMessage(phoneNumber: string, message: string) {
  const apiUrl = 'https://api.wati.io/v1/sendMessage';

  const options = {
    method: 'POST',
    url: BASE_URL + 'getContacts',
    headers: {
        Authorization: `${process.env.WATI_ACCESS_TOKEN!}`
    }
}

  const payload = {
    phoneNumber,
    message,
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: 'Bearer YOUR_WATI_API_TOKEN',
      },
    });

    if (response.data.success) {
      console.log('Message sent successfully');
    } else {
      console.log('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Usage
// sendWatiMessage('+1234567890', 'Hello, this is a test message');


// async function getParamsByChatHistory() {
//     const contacts = await getContacts()
//     const contactPhones = contacts.contact_list.reduce((acc: any[], curr: { wAid: any; }) => {
//         acc.push(curr.wAid)
//         return acc
//       }, [])
// }
