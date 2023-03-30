import axios from "axios";

const API_URL = "/api/recycle/";

// Get all recycle locations
const getAllRecycleLocation = async (token) => {
  

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`/api/recycle/location` ,config);
    return response.data;
  }

  const deleteRecycleCollection = async (id, token) => {
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`/api/recycle/location/${id}`, config);
        return id; // return the deleted user id to update the Redux store
     
    }



  // Get all Waste Types 
const getAllWasteTypes = async (token) => {
  

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`/api/recycle/wasteType` ,config);
    return response.data;
  }

  const recycleService = {
   getAllRecycleLocation,
   getAllWasteTypes,
   deleteRecycleCollection,
  };
  
  export default recycleService;