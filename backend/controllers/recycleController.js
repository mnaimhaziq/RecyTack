import RecyclingCollection from "../models/recyclingCollectionModel.js";
import WasteType from "../models/wasteTypeModel.js";
import asyncHandler from "express-async-handler";

// @desc     Create new recycling location
// @route    POST /api/recycling-locations
// @access   Private/Admin
const createRecyclingLocation = asyncHandler(async (req, res) => {
  const {
    locationName,
    address,
    contactNumber,
    latitude,
    longitude,
    acceptedWasteTypes,
  } = req.body;

  // Check if a recycling location with the same name and address already exists
  const existingLocation = await RecyclingCollection.findOne({
    locationName,
    address,
  });
  if (existingLocation) {
    res.status(400).json({
      error:
        "A recycling location with the same name and address already exists",
    });
    return;
  }

  const recyclingLocation = await RecyclingCollection.create({
    locationName,
    address,
    contactNumber,
    latitude,
    longitude,
    acceptedWasteTypes,
  });

  if (recyclingLocation) {
    res.status(201).json(recyclingLocation);
  } else {
    res.status(400).json({ error: "Invalid recycling location data" });
  }
});

// @desc     Get all recycling locations
// @route    GET /api/recycling-locations
// @access   Private
const getAllRecyclingLocations = asyncHandler(async (req, res) => {
  const recyclingLocations = await RecyclingCollection.find({});
  res.json(recyclingLocations);
});

// @desc     Delete a recycling location
// @route    DELETE /api/recycling-locations/:id
// @access   Private/Admin
const deleteRecyclingLocation = asyncHandler(async (req, res) => {
  const recyclingLocation = await RecyclingCollection.findByIdAndDelete(
    req.params.id
  );

  if (recyclingLocation) {
    res.json({ message: "Recycling location removed" });
  } else {
    res.status(404).json({ error: "Recycling location not found" });
  }
});

// @desc     Update a recycling location
// @route    PUT /api/recycling-locations/:id
// @access   Private/Admin
const updateRecyclingLocation = asyncHandler(async (req, res) => {
  const {
    locationName,
    address,
    contactNumber,
    latitude,
    longitude,
    acceptedWasteTypes,
  } = req.body;

  const recyclingLocation = await RecyclingCollection.findById(req.params.id);

  if (recyclingLocation) {
    recyclingLocation.locationName =
      locationName || recyclingLocation.locationName;
    recyclingLocation.address = address || recyclingLocation.address;
    recyclingLocation.contactNumber =
      contactNumber || recyclingLocation.contactNumber;
    recyclingLocation.latitude = latitude || recyclingLocation.latitude;
    recyclingLocation.longitude = longitude || recyclingLocation.longitude;
    recyclingLocation.acceptedWasteTypes =
      acceptedWasteTypes || recyclingLocation.acceptedWasteTypes;

    const updatedRecyclingLocation = await recyclingLocation.save();
    res.json(updatedRecyclingLocation);
  } else {
    res.status(404).json({ error: "Recycling location not found" });
  }
});

// @desc     Create a new waste type
// @route    POST /api/waste-types
// @access   Private/Admin
const createWasteType = asyncHandler(async (req, res) => {
  const {
    type,
    description,
    image,
    recyclingInstructions,
    environmentalImpact,
  } = req.body;

  const wasteType = new WasteType({
    wasteType: type,
    description,
    image: image || "default-image-url",
    recyclingInstructions,
    environmentalImpact,
  });

  const createdWasteType = await wasteType.save();

  if (createdWasteType) {
    res.status(201).json(createdWasteType);
  } else {
    res.status(400).json({ error: "Invalid waste type data" });
  }
});

// @desc     Get all waste types
// @route    GET /api/waste-types
// @access   Private
const getAllWasteTypes = asyncHandler(async (req, res) => {
  const wasteTypes = await WasteType.find({});
  res.json(wasteTypes);
});

export {
  createRecyclingLocation,
  getAllRecyclingLocations,
  deleteRecyclingLocation,
  updateRecyclingLocation,
  createWasteType,
  getAllWasteTypes
};
