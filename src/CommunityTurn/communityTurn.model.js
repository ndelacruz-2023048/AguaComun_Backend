import { model, Schema } from 'mongoose'

const communityTurnSchema = new Schema({
    dateAssigned: {
        type: Date,
        required: [true, 'Date assigned is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'occupied'],
        default: 'pending',
        required: true
    },
    activityId: {
        type: Schema.Types.ObjectId,
        ref: 'CommunityCollaboration',
        required: [true, 'Activity ID is required']
    },
}, {
    timestamps: true
});

// Validación para asegurar que la hora de fin sea posterior a la hora de inicio
communityTurnSchema.pre('save', function(next) {
    if (this.endTime <= this.startTime) {
        next(new Error('End time must be after start time'));
    }
    next();
});

export default model('CommunityTurn', communityTurnSchema);
