// models/historyModel.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    medicineName: {
      type: String,
      required: true
    },
    medicineData: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per user
historySchema.index({ userId: 1, medicineName: 1 }, { unique: true });

module.exports = mongoose.model('med', historySchema);