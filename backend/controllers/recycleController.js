import RecyclingCollection from "../models/recyclingCollectionModel.js";
import RecyclingHistory from "../models/recyclingHistoryModel.js";
import asyncHandler from "express-async-handler";


// @desc     Create New Recycling Location
// @route    POST /api/recycle/location/create
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


// @desc     Get All Recycling Locations in Reverse Order or Search By Keyword
// @route    GET /api/recycle/location?page=1&search=keyword
// @access   Private
const getAllRecyclingLocationsByPage = asyncHandler(async (req, res, next) => {
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


// @desc     Delete a Recycling Location
// @route    DELETE /api/recycle/location/:id
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


// @desc     Update a Recycling Location
// @route    PUT /api/location/:id
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


// @desc     Get Recycling Location By ID
// @route    Get /api/location/:id
// @access   Private
const getRecyclingLocationById = asyncHandler(async (req, res) => {
  const recyclingLocation = await RecyclingCollection.findById(req.params.id);

  if (!recyclingLocation) {
    res.status(404);
    throw new Error("Recycling location not found");
  }

  res.json(recyclingLocation);
});


// @desc     Create New Recycling History
// @route    POST /api/recycle/create
// @access   Private
const createRecycle = async (req, res) => {
  try {
    const { recyclingLocationId, recyclingMethod, quantity, wasteType } =
      req.body;
    const userId = req.user._id; 

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
    res.status(500).json({
      error: "An error occurred while creating the recycling history record.",
    });
  }
};


// @desc     Delete a Recycling History
// @route    DELETE /api/recycle/delete/:id
// @access   Private
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


// @desc     Update a Recycling History
// @route    PUT /api/recycle/update/:id
// @access   Private
const updateRecyclingHistory = asyncHandler(async (req, res) => {
  const { recyclingLocationId, recyclingMethod, quantity, wasteType } =
    req.body;
  const recyclingHistory = await RecyclingHistory.findById(req.params.id);

  if (recyclingHistory) {
    recyclingHistory.recyclingLocation =
      recyclingLocationId || recyclingHistory.recyclingLocationId;
    recyclingHistory.recyclingMethod =
      recyclingMethod || recyclingHistory.recyclingMethod;
    recyclingHistory.quantity = quantity || recyclingHistory.quantity;
    recyclingHistory.wasteType = wasteType || recyclingHistory.wasteType;

    const updatedRecyclingHistory = await recyclingHistory.save();
   
    res.json(updatedRecyclingHistory);
  } else {
    res.status(404).json({ error: "Recycling history not found" });
  }
});


const getRecyclingHistoryByUserIdAndPage = async (req, res) => {
  const pageSize = 8;
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

    recyclingHistory.forEach((record) => {
      if (!record.recyclingLocation) {
        record.recyclingLocation = null;
      }
    });

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
    res.status(500).json({
      error:
        "An error occurred while retrieving the recycling history records.",
    });
  }
};



// @desc     GET Recycling History By its ID
// @route    GET /api/recycle/getRecyclingHistoryById/:id
// @access   Private
const getRecyclingHistoryById = asyncHandler(async (req, res) => {
  const recyclingHistory = await RecyclingHistory.findById(req.params.id);

  if (!recyclingHistory) {
    res.status(404);
    throw new Error("Recycling History not found");
  }

  res.json(recyclingHistory);
});


// @desc     GET Total Recycling History By User ID
// @route    GET /api/recycle/getTotalRecyclingHistoryByUserId/:id
// @access   Private
const getTotalRecyclingHistoryByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const recyclingHistory = await RecyclingHistory.find({ user: userId });

  const recyclingHistoryCount = recyclingHistory.length;

  if (recyclingHistoryCount === 0) {
    res.status(404);
    throw new Error("Recycling History not found");
  }

  res.status(200).json({
    count: recyclingHistoryCount,
  });
});


// @desc     GET Total Recycling History By User ID
// @route    GET /api/recycle/getMostRecycledWasteType/:id
// @access   Private
const getMostRecycledWasteType = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const recyclingHistory = await RecyclingHistory.find({ user: userId });

  if (!recyclingHistory) {
    res.status(404);
    throw new Error("Recycling History not found");
  }

  const wasteTypeMap = {};
  recyclingHistory.forEach((record) => {
    if (wasteTypeMap[record.wasteType]) {
      wasteTypeMap[record.wasteType] += record.quantity;
    } else {
      wasteTypeMap[record.wasteType] = record.quantity;
    }
  });

  const sortedWasteTypes = Object.entries(wasteTypeMap).sort(
    (a, b) => b[1] - a[1]
  );

  const mostRecycledWasteType = sortedWasteTypes[0][0];

  res.status(200).json({ mostRecycledWasteType });
});

const getRecyclingPercentagesByUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Get all recycling records for the user
    const userRecycling = await RecyclingHistory.find({ user: userId });

    // Calculate recycling quantities for each waste type
    const wasteTypes = await RecyclingHistory.distinct("wasteType", { user: userId });
    const totalRecyclingQuantities = {};
    for (const wasteType of wasteTypes) {
      const wasteTypeRecycling = userRecycling.filter(
        (recycling) => recycling.wasteType === wasteType
      );
      const wasteTypeQuantity = wasteTypeRecycling.reduce((total, recycling) => {
        return total + recycling.quantity;
      }, 0);
      totalRecyclingQuantities[wasteType] = wasteTypeQuantity;
    }

    // Calculate recycling percentages for each waste type
    const recyclingPercentages = {};
    const totalQuantity = Object.values(totalRecyclingQuantities).reduce((total, quantity) => {
      return total + quantity;
    }, 0);
    for (const [wasteType, quantity] of Object.entries(totalRecyclingQuantities)) {
      const percentage = ((quantity / totalQuantity) * 100).toFixed(2);
      recyclingPercentages[wasteType] = percentage;
    }

    // Sort the result by percentage values in ascending order
    const sortedResult = Object.entries(recyclingPercentages).sort((a, b) => b[1] - a[1]);
    const sortedRecyclingPercentages = {};
    for (const [wasteType, percentage] of sortedResult) {
      sortedRecyclingPercentages[wasteType] = percentage;
    }

    res.json(sortedRecyclingPercentages);
  } catch (error) {
    next(error);
  }
});




export {
  createRecyclingLocation,
  getAllRecyclingLocationsByPage,
  deleteRecyclingLocation,
  updateRecyclingLocation,
  getRecyclingLocationById,
  createRecycle,
  getRecyclingHistoryById,
  getTotalRecyclingHistoryByUserId,
  deleteRecyclingHistory,
  updateRecyclingHistory,
  getRecyclingHistoryByUserIdAndPage,
  getMostRecycledWasteType,
  getRecyclingPercentagesByUser
};
