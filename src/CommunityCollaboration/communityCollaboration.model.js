import { model, Schema } from 'mongoose'

const communityCollaborationSchema = new Schema({
    activityName: {
        type: String,
        required: [true, 'Activity name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        // Format: "HH:mm"
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        // Format: "HH:mm"
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    shiftDuration: {
        type: String,
        required: [true, 'Shift duration is required'],
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: [true, 'Community is required']
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

communityCollaborationSchema.virtual('turns', {
    ref: 'CommunityTurn',         // Nombre del modelo relacionado
    localField: '_id',          // Campo local (Room._id)
    foreignField: 'activityId',       // Campo en roomDetails que referencia a Room
    justOne: false              // true si es 1 a 1, false si es 1 a muchos
  });

export default model("CommunityCollaboration", communityCollaborationSchema)
