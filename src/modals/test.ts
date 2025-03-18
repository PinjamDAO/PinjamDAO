import mongoose from "mongoose"

const Test = mongoose.model('Test', new mongoose.Schema({
    msg: String
}))

export default Test