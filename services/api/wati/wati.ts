import axios from 'axios';

export const watiService = {
    getContacts
}

async function getContacts() {
    const options = {
        method: 'GET',
        url: 'https://live-server-105712.wati.io/api/v1/getContacts',
        headers: {
            Authorization: `${process.env.WATI_ACCESS_TOKEN!}`
        }
    };

    return axios
        .request(options)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.error(error);
        });

}
