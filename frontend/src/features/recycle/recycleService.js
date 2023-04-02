import axios from "axios";

const API_URL = "/api/recycle/";

// Get all recycle locations
const getAllRecycleLocation = async (token, page) => {
    console.log(page);
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL + `location?page=${page}` ,config);
    return response.data;
  }

  // Create Recycle Collection
const createRecycleCollection = async (newFormData, token) => {

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "location/create", newFormData, config);

  return response.data;
};

  const deleteRecycleCollection = async (id, token) => {
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(API_URL + `location/${id}`, config);
        return id; // return the deleted user id to update the Redux store
     
    }

    const getRecycleLocationById = async (id, token) => {
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(API_URL + `location/${id}`, config);
      return response.data; // return the deleted user id to update the Redux store
   
  }

  const updateRecycleLocationById = async (id, newFormData, token) => {
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(API_URL + `location/${id}`, newFormData, config);
    return response.data; // return the deleted user id to update the Redux store
 
}


  // Get all Waste Types 
const getAllWasteTypes = async (token) => {
  

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL + `wasteType` ,config);
    return response.data;
  }

  const recycleService = {
   getAllRecycleLocation,
   getAllWasteTypes,
   createRecycleCollection,
   deleteRecycleCollection,
   getRecycleLocationById,
   updateRecycleLocationById,
  };
  
  export default recycleService;