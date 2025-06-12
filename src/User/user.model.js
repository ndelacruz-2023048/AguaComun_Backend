import { Schema, model } from "mongoose"

const userSchema = new Schema(
    {
        name: {
            type: String
        },
        surname: {
            type: String
        },
        username: {
            type: String,
            unique: true
        },
        accountNumber: {
            type: Number,
            unique: true
        },
        DPI: {
            type: Number,
            unique: true
        },
        address: {
            type: String
        },
        mobilePhone: {
            type: String
        },
        country: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        profilePicture: {
            type: String
        },
        workName: {
            type: String
        },
        monthlyIncome: {
            type: Number
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

userSchema.methods.toJSON = function(){
    const { __v, password, ...user } = this.toObject() 
    return user
}

export default model('User', userSchema)