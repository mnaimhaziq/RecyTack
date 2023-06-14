import Feedback from "../models/FeedbacksModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../utils/cloudinary.js";


// Create a new feedback
export const createFeedback = async (req, res) => {
    const {  comment } = req.body;
    const user_id = req.user._id;
  
   
  
    // Create a new feedback document
    const newFeedback = new Feedback({
      user: user_id,
      comment,
    });
  
    try {
      // Save the feedback to the database
      const savedFeedback = await newFeedback.save();
      res.status(201).json(savedFeedback);
    } catch (error) {
      console.error('Error saving feedback:', error);
      res.status(500).json({ error: 'Error saving feedback' });
    }
  };

  // Get all feedback with user names
export const getAllFeedback = async (req, res) => {
    try {
      // Retrieve all feedback and populate the "user" field with the user information
      const feedback = await Feedback.find().populate('user', 'name');
      res.status(200).json(feedback);
    } catch (error) {
      console.error('Error retrieving feedback:', error);
      res.status(500).json({ error: 'Error retrieving feedback' });
    }
  };