import mongoose from "mongoose"

const depositSchema = new mongoose.Schema({
    userID: String,
    amount: String,
}, { timestamps: true } )

export default mongoose.models.Deposit || mongoose.model('Deposit', depositSchema)