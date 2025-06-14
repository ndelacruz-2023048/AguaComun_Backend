import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymethod: {
      type: String,
      enum: ['Efectivo', 'Cheque'],
      required: true
    },
    bankcheck: {
      type: Number,
      required: function () {
        return this.paymethod === 'Cheque';
      }
    },
    address: {
      type: String,
      required: true
    },
    manualDate: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      enum: ['Pendiente', 'Confirmado'],
      default: 'Pendiente'
    }
  },
  {
    timestamps: true
  }
);

export default model('Payment', paymentSchema);
