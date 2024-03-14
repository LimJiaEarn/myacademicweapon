import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  }
}

export const connectToDatabase = async () => {

  console.log("Connecting to MongoDB....");

  if(cached.conn){
    console.log("Returning cached MongoDB connection");
    return cached.conn;
  }
  if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  cached.promise = 
    cached.promise || 
    mongoose.connect(MONGODB_URL, { 
      dbName: 'myacademicweapon', bufferCommands: false 
    })

  cached.conn = await cached.promise;
    console.log("Connected to MongoDB");
  return cached.conn;
}