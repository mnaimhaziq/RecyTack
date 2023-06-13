import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.171.68.153:5000/api/users/";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  if (response.data) {
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  }
  return response.data;
};

// Update user
const updateProfile = async (userUpdateData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userUpdateData.token}`,
    },
  };

  const response = await axios.put(API_URL + "profile", userUpdateData, config);

  if (response.data) {
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  }
  return response.data;
};

// Get all users
const getAllUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`/api/users`, config);
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("userInfo");
};

const authService = {
  register,
  login,
  updateProfile,
  getAllUsers,
  logout,
};

export default authService;
