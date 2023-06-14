import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { createFeedback, getAllFeedback } from "../controllers/FeedbackController.js";
const router = express.Router();

router.post("/create", protect, createFeedback);
router.get("/getAllFeedback", protect,admin, getAllFeedback);
export default router;