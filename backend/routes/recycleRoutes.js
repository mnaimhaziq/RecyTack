import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import {
  createRecyclingLocation,
  deleteRecyclingLocation,
  getAllRecyclingLocations,
  getRecyclingLocationsByPage,
  updateRecyclingLocation,
  getRecyclingLocationById,
  createRecycle,
  deleteRecyclingHistory,
  getRecyclingHistoryByUserIdAndPage,
  updateRecyclingHistory,
  getRecyclingHistoryById,
  getMostRecycledWasteType,
  getTotalRecyclingHistoryByUserId,
  getRecyclingPercentagesByUser
} from "../controllers/recycleController.js";
const router = express.Router();


// Recycling Location
router.post("/location/create", protect, admin, createRecyclingLocation);     // Create Recycling Location
router.route("/location/all").get(protect, getAllRecyclingLocations);       // Get All Recycling Locations 
router.route("/location").get(protect, getRecyclingLocationsByPage);       // Get Recycling Locations By Page
router.delete("/location/:id", protect, admin, deleteRecyclingLocation);      // Delete Recycling Location
router.put("/location/:id", protect, admin, updateRecyclingLocation);         // Update Recycling Location
router.route("/location/:id").get(protect, getRecyclingLocationById);         // Get Recycling Location By ID


// Recycling History 
router.post("/create", protect, createRecycle);                                                       // Create New Recycling History
router.delete("/delete/:id", protect, deleteRecyclingHistory)                                         // Delete Recycling History
router.put("/update/:id", protect,  updateRecyclingHistory);                                          // Update Recycling History
router.get("/getRecyclingHistoryByPage/:id", protect, getRecyclingHistoryByUserIdAndPage);            // Get Recycling Histories By User ID and Page
router.route("/getRecyclingHistoryById/:id").get(protect, getRecyclingHistoryById);                   // Get Recycling History By ID
router.route("/getTotalRecyclingHistoryByUserId/:id").get(protect, getTotalRecyclingHistoryByUserId); // Get Total Recycling History By User ID
router.route("/getMostRecycledWasteType/:id").get(protect, getMostRecycledWasteType);                 // Get Most Recycled Waste Type
router.route("/percentages/:id").get(protect, getRecyclingPercentagesByUser);                         // Get Recycling Percentages By User
export default router;
