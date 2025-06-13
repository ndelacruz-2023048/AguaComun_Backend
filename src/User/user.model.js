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
        /* DPI: {
            type: Number,
            unique: true
        }, */
        address: {
            type: {
                zone: { type: String },  // Ejemplo: "Zona 2"
                municipality: { type: String }, // Ejemplo: "San Lucas"
                department: { type: String },  // Ejemplo: "Sacatepéquez"
            },
        },//depa muni zona
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
        rol: {
            type: String,
            uppercase: true,
            enum: ['ADMIN', 'CLIENT', 'COORDINADOR'],
            default: 'ADMIN'
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