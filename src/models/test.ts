import mongoose from "mongoose"

const testSchema = new mongoose.Schema({
    msg: String
})

export default mongoose.models.Test || mongoose.model('Test', testSchema)
