import axios from "axios"


const getAllContacts = ():Promise<> => {
    const options = {
        method: 'GET',
        url: 'https://live-server-105712.wati.io/api/v1/getContacts',
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0M2QwNGMyMy1jYTY4LTRjMDMtYjZmMC1lZTJjMWVmNjYwZDQiLCJ1bmlxdWVfbmFtZSI6Im9yQGdyYXBoaWNhbC5jby5pbCIsIm5hbWVpZCI6Im9yQGdyYXBoaWNhbC5jby5pbCIsImVtYWlsIjoib3JAZ3JhcGhpY2FsLmNvLmlsIiwiYXV0aF90aW1lIjoiMDQvMjcvMjAyMyAxNjo0NjowNyIsImRiX25hbWUiOiIxMDU3MTIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.HVTQTpEApV0bU49UweTFwWHEnXhWmfYpJ_QdWhMLncI'
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
        url: `https://live-server-105712.wati.io/api/v1/getMessages/${phoneNum}`,
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0M2QwNGMyMy1jYTY4LTRjMDMtYjZmMC1lZTJjMWVmNjYwZDQiLCJ1bmlxdWVfbmFtZSI6Im9yQGdyYXBoaWNhbC5jby5pbCIsIm5hbWVpZCI6Im9yQGdyYXBoaWNhbC5jby5pbCIsImVtYWlsIjoib3JAZ3JhcGhpY2FsLmNvLmlsIiwiYXV0aF90aW1lIjoiMDQvMjcvMjAyMyAxNjo0NjowNyIsImRiX25hbWUiOiIxMDU3MTIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.HVTQTpEApV0bU49UweTFwWHEnXhWmfYpJ_QdWhMLncI'
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