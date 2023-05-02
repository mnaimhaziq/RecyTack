import RecyclingCollection from "../models/recyclingCollectionModel.js";
import WasteType from "../models/wasteTypeModel.js";
import RecyclingHistory from "../models/recyclingHistoryModel.js";
import asyncHandler from "express-async-handler";

// @desc     Create new recycling location
// @route    POST /api/recycling-locations
// @access   Private/Admin
const createRecyclingLocation = asyncHandler(async (req, res) => {
  const { locationName, address, contactNumber, latitude, longitude } =
    req.body;

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
  });

  if (recyclingLocation) {
    res.status(201).json(recyclingLocation);
  } else {
    res.status(400).json({ error: "Invalid recycling location data" });
  }
});

// @desc     Get all recycling locations in reverse order or search by keyword
// @route    GET /api/recycling-locations/reverse?page=1&search=keyword
// @access   Private
const getAllRecyclingLocations = asyncHandler(async (req, res, next) => {
  const pageSize = 10;
  let page = Number(req.query.page) || 1;
  const searchKeyword = req.query.search || "";

  try {
    const query = searchKeyword
      ? {
          locationName: { $regex: new RegExp(searchKeyword, "i") },
        }
      : {};

    const count = await RecyclingCollection.countDocuments(query);

    // If page is not selected, set page to 1
    if (!req.query.page && !req.query.search) {
      const recyclingLocations = await RecyclingCollection.find().sort({
        _id: -1,
      });

      res.json({
        data: recyclingLocations,
        page: 1,
        pages: 1,
      });
    } else {
      const recyclingLocations = await RecyclingCollection.find(query)
        .sort({ _id: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      res.json({
        data: recyclingLocations,
        page,
        pages: Math.ceil(count / pageSize),
      });
    }
  } catch (error) {
    next(error);
  }
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
  const { locationName, address, contactNumber, latitude, longitude } =
    req.body;

  const recyclingLocation = await RecyclingCollection.findById(req.params.id);

  if (recyclingLocation) {
    recyclingLocation.locationName =
      locationName || recyclingLocation.locationName;
    recyclingLocation.address = address || recyclingLocation.address;
    recyclingLocation.contactNumber =
      contactNumber || recyclingLocation.contactNumber;
    recyclingLocation.latitude = latitude || recyclingLocation.latitude;
    recyclingLocation.longitude = longitude || recyclingLocation.longitude;

    const updatedRecyclingLocation = await recyclingLocation.save();
    res.json(updatedRecyclingLocation);
  } else {
    res.status(404).json({ error: "Recycling location not found" });
  }
});

const getRecyclingLocationById = asyncHandler(async (req, res) => {
  const recyclingLocation = await RecyclingCollection.findById(req.params.id);

  if (!recyclingLocation) {
    res.status(404);
    throw new Error("Recycling location not found");
  }

  res.json(recyclingLocation);
});

const createRecycle = async (req, res) => {
  try {
    const { recyclingLocationId, recyclingMethod, quantity, wasteType } =
      req.body;
    const userId = req.user._id; // assume you have implemented authentication middleware to get the user id

    // Create a new recycling history record
    const recyclingHistory = new RecyclingHistory({
      user: userId,
      recyclingLocation: recyclingLocationId,
      recyclingMethod: recyclingMethod,
      quantity: quantity,
      wasteType: wasteType,
    });

    // Save the record to the database
    await recyclingHistory.save();

    res
      .status(201)
      .json({ message: "Recycling history record created successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "An error occurred while creating the recycling history record.",
      });
  }
};

const getRecyclingHistoryById = asyncHandler(async (req, res) => {
  const recyclingHistory = await RecyclingHistory.findById(req.params.id);

  if (!recyclingHistory) {
    res.status(404);
    throw new Error("Recycling History not found");
  }

  res.json(recyclingHistory);
});

// @desc  GET Recycling History By User ID
// @route    GET /api/recycle/getRecyclingHistory/:id
// @access   Private
const getRecyclingHistoryByUserId = async (req, res) => {
  const pageSize = 10;
  let page = Number(req.query.page) || 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  try {
    const userId = req.params.id;
    const recyclingHistory = await RecyclingHistory.find({ user: userId })
      .populate({
        path: "recyclingLocation",
        select: "locationName",
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(pageSize);

    const totalCount = await RecyclingHistory.countDocuments({ user: userId });

    const pagination = {};

    if (endIndex < totalCount) {
      pagination.next = {
        page: page + 1,
        pageSize: pageSize,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        pageSize: pageSize,
      };
    }

    res.status(200).json({
      data: recyclingHistory,
      page: page,
      pages: Math.ceil(totalCount / pageSize),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error:
          "An error occurred while retrieving the recycling history records.",
      });
  }
};

// @desc     Update a recycling history
// @route    PUT /api/recycling-history/:id
// @access   Private/Admin
const updateRecyclingHistory = asyncHandler(async (req, res) => {
  const {  recyclingLocationId, recyclingMethod, quantity, wasteType } =
    req.body;

  const recyclingHistory= await RecyclingHistory.findById(req.params.id);

  if (recyclingHistory) {
    recyclingHistory.recyclingLocationId =
      recyclingLocationId || recyclingHistory.recyclingLocationId;
      recyclingHistory.recyclingMethod = recyclingMethod || recyclingHistory.recyclingMethod;
      recyclingHistory.quantity =
      quantity || recyclingHistory.quantity;
      recyclingHistory.wasteType = wasteType || recyclingHistory.wasteType;

    const updatedRecyclingHistory = await recyclingHistory.save();
    res.json(updatedRecyclingHistory);
  } else {
    res.status(404).json({ error: "Recycling history not found" });
  }
});

// @desc     Delete a recycling location
// @route    DELETE /api/recycling-locations/:id
// @access   Private/Admin
const deleteRecyclingHistory = asyncHandler(async (req, res) => {
  const recyclingHistory = await RecyclingHistory.findByIdAndDelete(
    req.params.id
  );

  if (recyclingHistory) {
    res.json({ message: "Recycling History removed" });
  } else {
    res.status(404).json({ error: "Recycling history not found" });
  }
});

export {
  createRecyclingLocation,
  getAllRecyclingLocations,
  deleteRecyclingLocation,
  updateRecyclingLocation,
  getRecyclingLocationById,
  createRecycle,
  getRecyclingHistoryById,
  deleteRecyclingHistory,
  updateRecyclingHistory,
  getRecyclingHistoryByUserId,
};
