import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { authUser, registerUser, updateUserProfile, updateDarkMode, getUsersByPage, getAllUsers } from "../controllers/userController.js";
const router = express.Router();

// Users 
router.route("/getUsersByPage").get(protect, admin, getUsersByPage);                // Admin Get All Users
router.route("/getAllUsers").get(protect, admin, getAllUsers);
router.post("/login", authUser);                                // Login
router.post("/register", registerUser);                         // Register
router.route("/profile").put(protect,updateUserProfile)         // Update User Profile
router.patch('/users/:userId/dark-mode', updateDarkMode);          // Update Dark Mode
export default router;