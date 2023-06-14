import mongoose from "mongoose";

// Define the feedback schema
const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  media: {
    type: Object,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create the feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;