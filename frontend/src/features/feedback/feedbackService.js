import axios from "axios";

const API_URL = "/api/feedback/";

// Create Feedback
 const createFeedback = async (feedback, token) => {
    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
    const response = await axios.post(API_URL + "create", feedback, config);
  
    return response.data;
  };

    // Get all recycle locations
const getAllFeedback = async (token) => {
 
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL + `getAllFeedback` ,config);
    return response.data;
  }

  const feedbackService = {
  createFeedback,
  getAllFeedback
   };
   
   export default feedbackService;
