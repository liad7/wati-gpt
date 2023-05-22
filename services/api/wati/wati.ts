import axios from "axios"

const BASE_URL = 'https://live-server-105712.wati.io/api/v1/'

const getAllContacts = (): Promise<[]> => {
    const options = {
        method: 'GET',
        url: BASE_URL + 'getContacts',
        headers: {
            Authorization: process.env.WATI_ACCESS_TOKEN!
        }
    }
    
    return axios
    .request(options)
    .then(res => {
        console.log(res.data)
        return res.data
    })
    .catch(console.error)
}

const getChatHistoryByNumber = (phoneNum: string): Promise<string> => {
    console.log('process.env:', process.env);
    const options = {
        method: 'GET',
        url: `${BASE_URL}getMessages/${phoneNum}`,
        headers: {
            Authorization: process.env.WATI_ACCESS_TOKEN!
        }
    }

    return axios
        .request(options)
        .then(res => {
            console.log(res.data)
            return res.data
        })
        .catch(console.error)
}


export const watiService = {
    getAllContacts,
    getChatHistoryByNumber,
}