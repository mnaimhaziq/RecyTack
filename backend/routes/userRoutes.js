import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { authUser, getUsers, registerUser, updateUserProfile,  } from "../controllers/userController.js";
const router = express.Router();

router.route("/").get(protect, getUsers) // get all users
router.post("/login", authUser); // login
router.post("/register", registerUser); // register
router.route("/profile").put(protect,updateUserProfile) // update user profile
export default router;