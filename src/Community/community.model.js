import { Schema, model } from "mongoose";

const communitySchema = new Schema(
    {
        department: {
            type: String
        },
        municipality: {
            type: String
        },
        zone: {
            type: String
        },
        name: {
            type: String
        },
        description: {
            type: String
        },
        image: {
            type: String
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

communitySchema.methods.toJSON = function() {
    const { __v, ...community } = this.toObject();
    return community;
}

export default model('Community', communitySchema);