// import { getCollection } from "."

// export async function getContacts(collectionName) {
//     try {
//         const collection = await getCollection(collectionName)
//         const contacts = await collection.find().toArray()
//         return contacts
//     }catch(err){
//         console.log(err);
//     }
// }

// async function update(collectionName,contacts) {
//     try {
//         const collection = await dbService.getCollection(collectionName)
//         await collection.update(contacts)
//         return contacts
//     } catch (err) {
//         logger.error(`cannot update board ${board._id}`, err)
//         throw err
//     }
// }