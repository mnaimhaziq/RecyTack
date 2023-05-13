import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { authUser, getUsers, registerUser, updateUserProfile,  } from "../controllers/userController.js";
const router = express.Router();

// Users 
router.route("/getAllUsers").get(protect, admin, getUsers)                 // Admin Get All Users
router.post("/login", authUser);                                // Login
router.post("/register", registerUser);                         // Register
router.route("/profile").put(protect,updateUserProfile)         // update User Profile

export default router;