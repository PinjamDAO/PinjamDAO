import mongoose from "mongoose"

export type userType = {
    _id: String, 
    username: String,
    worldId: String,
    creditScore: Number,
}

const userSchema = new mongoose.Schema({
    username: String,
    worldId: String,
    creditScore: {
        type: Number,
        default: 0
    },
})

export default mongoose.models.User || mongoose.model('User', userSchema)
