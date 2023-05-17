import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { authUser, getUsers, registerUser, updateUserProfile, updateDarkMode } from "../controllers/userController.js";
const router = express.Router();

// Users 
router.route("/getAllUsers").get(protect, admin, getUsers)                 // Admin Get All Users
router.post("/login", authUser);                                // Login
router.post("/register", registerUser);                         // Register
router.route("/profile").put(protect,updateUserProfile)         // Update User Profile
router.patch('/users/:userId/dark-mode', updateDarkMode);          // Update Dark Mode
export default router;