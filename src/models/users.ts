import mongoose from "mongoose"

export type userType = {
    _id: string, 
    username: string,

    // internal data
    worldId: string,
    walletID: string,
    walletAddress: string,
    
    // additional datas
    firstName: string,
    middleName: string,
    lastName: string,
    dateOfBirth: Date,
    gender: string,
    ethnicity: string,
    religion: string,
    residencyStatus: string,
    employmentStatus: string,
    maritialStatus: string,
    educationLevel: string,
    phoneNumber: string,
    address: string,
    postcode: string,
    city: string,
    state: string
}

const userSchema = new mongoose.Schema({
    username: String,

    // internal data
    worldId: String,
    walletID: String,
    walletAddress: String,

    // additional datas
    firstName: String,
    middleName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    ethnicity: String,
    religion: String,
    residencyStatus: String,
    employmentStatus: String,
    maritialStatus: String,
    educationLevel: String,
    phoneNumber: String,
    address: String,
    postcode: String,
    city: String,
    state: String
})

export default mongoose.models.User || mongoose.model('User', userSchema)
