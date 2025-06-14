import { Schema, model } from "mongoose";

const campaignSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        status: {
        type: String,
            enum: ['Activa', 'Pausada', 'Finalizada'],
            default: 'Activa'
        },
        goalAmount: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        amountRaised: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

export default model("Campaign", campaignSchema);
