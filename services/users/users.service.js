import clientPromise from "./db.service"

export const usersService = {
  getUsers,
  getUserById,
  saveUser,
  getEmptyUser,
  getEmptyMsg,
  update
}

let client
let db
let usersFromDb
const DB_NAME = process.env.MONGODB_DB_NAME
const COLLECTION_NAME = process.env.MONGODB_DB_COLLECTION_NAME

async function init() {
  if (db) return
  try {
    client = await clientPromise
    db = await client.db(DB_NAME)
    usersFromDb = await db.collection(COLLECTION_NAME)
  } catch (err) {
    console.log('err', err)
    throw new Error('failed to get connection to db')

  }

}

; (async () => {
  await init()
})()

async function getUsers() {
  try {
    if (!usersFromDb) await init()
    const res = await usersFromDb.find().toArray()

    return res
  } catch (err) {
    console.log('err', err)
  }
}

async function getUserById(userId) {

  try {
    if (!usersFromDb) await init()
    const user = await usersFromDb.findOne({ _id: userId })

    return user
  } catch (err) {
    console.log('no such user by ID', err)
    return null
  }
}
async function saveUser(userToSave) {

  try {
    if (!usersFromDb) await init()
    const user = await usersFromDb.insertOne(userToSave)

    return user
  } catch (err) {
    console.log(err)
    throw new Error('Error fetching user by ID')
  }
}

async function update(userToUpdate) {

  try {
    if (!usersFromDb) await init()
    const user = await usersFromDb.updateOne({ _id: userToUpdate._id }, { $set: userToUpdate })

    return user
  } catch (err) {
    console.log(err)
    throw new Error('Error fetching user by ID')
  }
}

function getEmptyUser(_id, userName, signUpDate, currSessionMsgHistory) {
  return {
    _id,
    userName,
    signUpDate,
    "admin": false,
    "lang": "he",
    "inProgress": true,
    currSessionMsgHistory: [currSessionMsgHistory],
    "msgsHistory": []
  }
}

function getEmptyMsg(text, _id, name, sentAt) {
  return {
    text,
    "sender": {
      _id,
      name
    },
    sentAt

  }
}

// export async function getUserById(userId) {

//   try {
//     const collection = await getCollection(COLLECTION_NAME)
//     const user = await collection.findOne({ _id: userId })

//     return user
//   } catch (err) {
//     console.log(err)
//     throw new Error('Error fetching user by ID')
//   }
// }

// export async function update(collectionName, user) {
//   try {
//     const collection = await getCollection(collectionName);
//     await collection.updateOne({ _id: user._id }, { $set: user });
//     return user;
//   } catch (err) {
//     console.log(err);
//     throw new Error('Error updating user');
//   }
// }

// export async function getCollection(collectionName) {
//   try {
//     const client = await clientPromise
//     const db = await client.db()
//     const collection = await db.collection(collectionName)
//     return collection

//   } catch (err) {
//     throw err
//   }
// }

// module.exports = {
//     getUsers,
//     getUserById,
//     update,
// }