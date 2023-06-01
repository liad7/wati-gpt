import { MongoClient } from 'mongodb'

const { MONGODB_URI } = process.env
const options = {}

if (!MONGODB_URI) throw new Error('Please add Mongo URI to .env.local')
let client = new MongoClient(MONGODB_URI, options)
let clientPromise

if (process.env.NODE_ENV !== 'production') {
    if (global._mongoClientPromise) {
        global._mongoClientPromise = client.connect()
    }

    clientPromise = global._mongoClientPromise
} else {
    clientPromise = client.connect()
}

export default clientPromise

export async function getCollection(collectionName) {
    try {
        const client = await clientPromise
        const db = await client.db()
        const collection = await db.collection(collectionName)
        return collection

    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}


