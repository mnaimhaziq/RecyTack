import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import {
  createRecyclingLocation,
  deleteRecyclingLocation,
  getAllRecyclingLocations,
  updateRecyclingLocation,
  getRecyclingLocationById,
  createRecycle,
  deleteRecyclingHistory,
  getRecyclingHistoryByUserId,
  getRecyclingHistoryById,
  updateRecyclingHistory,
} from "../controllers/recycleController.js";
const router = express.Router();

router.route("/location").get(protect, getAllRecyclingLocations); // get all Recycling Locations
router.post("/location/create", protect, admin, createRecyclingLocation); // Create Recycling Location
router.delete("/location/:id", protect, admin, deleteRecyclingLocation); // Delete Recycling Location
router.put("/location/:id", protect, admin, updateRecyclingLocation); // Update Recycling Location
router.route("/location/:id").get(protect, getRecyclingLocationById); 

router.post("/create", protect, createRecycle); //create new Recycling History
router.delete("/delete/:id", protect, deleteRecyclingHistory)
router.get("/getRecyclingHistory/:id", protect, getRecyclingHistoryByUserId);
router.put("/recycling-history/:id", protect,  updateRecyclingHistory); // Update Recycling History
router.route("/getRecyclingHistoryById/:id").get(protect, getRecyclingHistoryById); 
export default router;
