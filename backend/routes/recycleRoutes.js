import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import {
  createRecyclingLocation,
  deleteRecyclingLocation,
  getAllRecyclingLocationsByPage,
  updateRecyclingLocation,
  getRecyclingLocationById,
  createRecycle,
  deleteRecyclingHistory,
  getRecyclingHistoryByUserIdAndPage,
  getRecyclingHistoryByUserId,
  updateRecyclingHistory,
  getRecyclingHistoryById,
  getMostRecycledWasteType
} from "../controllers/recycleController.js";
const router = express.Router();

router.route("/location").get(protect, getAllRecyclingLocationsByPage); // get all Recycling Locations
router.post("/location/create", protect, admin, createRecyclingLocation); // Create Recycling Location
router.delete("/location/:id", protect, admin, deleteRecyclingLocation); // Delete Recycling Location
router.put("/location/:id", protect, admin, updateRecyclingLocation); // Update Recycling Location
router.route("/location/:id").get(protect, getRecyclingLocationById); 

router.post("/create", protect, createRecycle); //create new Recycling History
router.delete("/delete/:id", protect, deleteRecyclingHistory)
router.get("/getRecyclingHistoryByPage/:id", protect, getRecyclingHistoryByUserIdAndPage);
router.put("/recycling-history/:id", protect,  updateRecyclingHistory); // Update Recycling History
router.route("/getRecyclingHistoryByUserId/:id").get(protect, getRecyclingHistoryByUserId); 
router.route("/getRecyclingHistoryById/:id").get(protect, getRecyclingHistoryById); 
router.route("/getMostRecycledWasteType/:id").get(protect, getMostRecycledWasteType); 

export default router;
