const mongoose = require("mongoose")

export default function connectDB () {
    const mongodb_uri = process.env.MONGODB_URI
    if (mongodb_uri === null) {
        console.error('go set mongodb uri in .env')
    }
    mongoose.connect(mongodb_uri)
}