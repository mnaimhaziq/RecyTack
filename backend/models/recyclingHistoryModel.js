import mongoose from "mongoose";

const recyclingHistorySchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recyclingLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecyclingCollection',
      required: true
    },
    recyclingMethod: {
      type: String,
      required: true
    },
   wasteType: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      min: 0,
      required: true
    }
  }, {
    timestamps: true 
  });
  

const RecyclingHistory = mongoose.model('RecyclingHistory', recyclingHistorySchema);

export default RecyclingHistory;