import mongoose from "mongoose"

export default async function connectDB () {
    const mongodb_uri = process.env.MONGODB_URI!
    if (mongodb_uri === null) {
        console.error('go set mongodb uri in .env')
    }
    await mongoose.connect(mongodb_uri)
}