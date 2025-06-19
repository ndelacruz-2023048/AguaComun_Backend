import { Schema, model } from "mongoose"

const reportSchema = new Schema(
    {
        issueTitle: {
            type: String
        },
        issueCategory: {
            type: String
        },
        description: {
            type: String
        },
        reportPhoto: [{
            type: String
        }],
        dateRepoted: {
            type: Date,
            default: Date.now,
            immutable: true
        },
        reportedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            immutable: true,
            required: true
        },
        urgencyLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Low'
        },
        solutions: {
            type: String
        },
        community: {
            type: Schema.Types.ObjectId,
            ref: 'Community',
            immutable: true,
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

reportSchema.methods.toJSON = function() {
    const { __v, ...report } = this.toObject();
    return report;
}  

export default model('Report', reportSchema);