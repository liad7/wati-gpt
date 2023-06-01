import { getCollection } from "."

export async function getContacts(collectionName) {
    try {
        const collection = await getCollection(collectionName)
        const contacts = await collection.find().toArray()
        return contacts
    } catch (err) {
        console.log(err)
    }
}

export async function getContactById(collectionName, contactId) {
    try {
        const collection = await getCollection(collectionName)
        const contact = await collection.findOne({ _id: contactId })

        return contact
    } catch (err) {
        console.log(err)
        throw new Error('Error fetching contact by ID')
    }
}


export async function update(collectionName, contact) {
    try {
        const collection = await dbService.getCollection(collectionName)
        await collection.update(contact)
        return contact
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

// module.exports = {
//     getContacts,
//     getContactById,
//     update,
// }