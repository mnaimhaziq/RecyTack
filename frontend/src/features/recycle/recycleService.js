import axios from "axios";

const API_URL = "/api/recycle/";

// Get all recycle locations
const getAllRecycleLocationByPageAndKeyword = async (token, page, search) => {
 
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL + `location?page=${page}&search=${search}` ,config);
    return response.data;
  }

  // Get all recycle locations
const getAllRecycleLocation = async (token) => {
 
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + `location/all` ,config);
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



  // Create Recycling History
  const createRecyclingHistory = async (newFormData, token) => {

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.post(API_URL + "create", newFormData, config);
  
    return response.data;
  };
  

  const deleteRecycleCollection = async (id, token) => {
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(API_URL + `location/${id}`, config);
        return id; 
     
    }

    const deleteRecycleHistory = async (id, token) => {
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(API_URL + `delete/${id}`, config);
      return id; 
   
  }

    const getAllRecyclingHistories = async ( token) => {
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(API_URL + `getAllRecyclingHistories`, config);
      return response.data; // return the deleted user id to update the Redux store
   
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

  const getRecycleHistoryById = async (id, token) => {
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL + `getRecyclingHistoryById/${id}`, config);
    return response.data; // return the deleted user id to update the Redux store
 
}

const getTotalRecyclingHistoryByUserId = async (id, token) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + `getTotalRecyclingHistoryByUserId/${id}`, config);
  return response.data; // return the deleted user id to update the Redux store

}

const getMostRecycledWasteType = async (id, token) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + `getMostRecycledWasteType/${id}`, config);
  return response.data; // return the deleted user id to update the Redux store

}
  const getRecycleHistoryByUserIdAndPage = async (id, page, token) => {
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL + `getRecyclingHistoryByPage/${id}?page=${page}`, config);
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

const updateRecycleHistoryById = async (id, newFormData, token) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + `update/${id}`, newFormData, config);
  return response.data; // return the deleted user id to update the Redux store

}

const getRecyclingPercentagesByUser = async (id, token) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + `percentages/${id}`, config);
  return response.data; // return the deleted user id to update the Redux store

}


  const recycleService = {
   getAllRecycleLocation,
   getAllRecycleLocationByPageAndKeyword,
   createRecycleCollection,
   createRecyclingHistory,
   deleteRecycleCollection,
   deleteRecycleHistory,
   getAllRecyclingHistories,
   getRecycleLocationById,
   getRecycleHistoryById,
   getTotalRecyclingHistoryByUserId,
   getRecycleHistoryByUserIdAndPage,
   updateRecycleLocationById,
   updateRecycleHistoryById,
   getMostRecycledWasteType,
   getRecyclingPercentagesByUser,
  };
  
  export default recycleService;