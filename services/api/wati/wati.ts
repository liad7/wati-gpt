import axios from "axios"

const BASE_URL = 'https://live-server-105712.wati.io/api/v1/'
const { WATI_AUTH } = process.env

const getAllContacts = (): Promise<[]> => {
    const options = {
        method: 'GET',
        url: BASE_URL + 'getContacts',
        headers: {
            Authorization: WATI_AUTH
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
    const options = {
        method: 'GET',
        url: `${BASE_URL}getMessages/${phoneNum}`,
        headers: {
            Authorization: WATI_AUTH
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