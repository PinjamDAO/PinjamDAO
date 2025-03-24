import mongoose from "mongoose"

export type userType = {
    _id: string, 
    username: string,
    worldId: string,
    creditScore: Number,
    walletID: string,
    walletAddress: string,
}

const userSchema = new mongoose.Schema({
    username: String,
    worldId: String,
    creditScore: {
        type: Number,
        default: 0
    },
    walletID: String,
    walletAddress: String,
})

export default mongoose.models.User || mongoose.model('User', userSchema)
