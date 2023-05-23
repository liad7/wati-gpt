import { MongoClient } from 'mongodb';

const { MONGODB_URI } = process.env;
const options = {}

if(!MONGODB_URI) throw new Error('Please add Mongo URI to .env.local')
let client = new MongoClient(MONGODB_URI,options)
let clientPromise

if(process.env.NODE_ENV !== 'production'){
    if(global._mongoClientPromise){
        global._mongoClientPromise = client.connect()  
    }

    clientPromise = global._mongoClientPromise
}else{
    clientPromise=client.connect()
}

export default clientPromise

