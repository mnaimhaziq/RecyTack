import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import {
  createRecyclingLocation,
  deleteRecyclingLocation,
  getAllRecyclingLocations,
  updateRecyclingLocation,
  getRecyclingLocationById,
  createWasteType,
  getAllWasteTypes,
} from "../controllers/recycleController.js";
const router = express.Router();

router.route("/location").get(protect, getAllRecyclingLocations); // get all Recycling Locations
router.post("/location/create", protect, admin, createRecyclingLocation); // Create Recycling Location
router.delete("/location/:id", protect, admin, deleteRecyclingLocation); // Delete Recycling Location
router.put("/location/:id", protect, admin, updateRecyclingLocation); // Update Recycling Location
router.route("/location/:id").get(protect, getRecyclingLocationById); // get all Recycling Locations

router.post("/wasteType/create", protect, admin, createWasteType); // Create Waste Types
router.route("/wasteType").get(protect, getAllWasteTypes); // get all Waste Types

export default router;
