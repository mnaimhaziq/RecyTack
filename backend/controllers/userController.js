import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      picture: user.picture,
      phoneNumber: user.phoneNumber,
      address: user.address,
      token: generateToken(user._id),
      darkMode: user.darkMode
    });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

// @desc     Register new user
// @route    POST /api/users/register
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, picture, address } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ error: "User already exists" });
  }

  if (picture) {
    const uploadedResponse = await cloudinary.uploader.upload(picture, {
      upload_preset: "recyTrack_users_picture",
    });

    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      picture: uploadedResponse,
      address,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        picture: uploadedResponse,
        address: user.address,
        token: generateToken(user._id),
        darkMode: user.darkMode
      });
    }
  } else {
    res.status(400).json({ error: "Invalid user data" });
  }
});

// @desc     Update User Profile
// @route    PUT /api/users/updateProfile
// @access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address.street,
        city: req.body.address.city || user.address.city,
        postalCode: req.body.address.postalCode || user.address.postalCode,
        country: req.body.address.country || user.address.country,
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});



// @desc     Get all users By Page
// @route    GET /api/users
// @access   Private
const getUsersByPage = asyncHandler(async (req, res, next) => {
  const pageSize = 8;
  let page = Number(req.query.page) || 1;
  const searchKeyword = req.query.search || "";

  try {
    const query = searchKeyword
      ? {
          name: { $regex: new RegExp(searchKeyword, "i") },
        }
      : {};

    const count = await User.countDocuments(query);

    // If page is not selected, set page to 1
    if (!req.query.page && !req.query.search) {
      const Users = await User.find().sort({
        _id: -1,
      });

      res.json({
        data: Users,
        page: 1,
        pages: 1,
      });
    } else {
      const Users = await User.find(query)
        .sort({ _id: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      res.json({
        data: Users,
        page,
        pages: Math.ceil(count / pageSize),
      });
    }
  } catch (error) {
    next(error);
  }
});

// @desc     Get all users
// @route    GET /api/allUsers
// @access   Private
const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find().sort({ _id: -1 });

    res.json({
      data: users,
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
});

const updateDarkMode = async (req, res) => {
  const { userId, darkMode } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.darkMode = darkMode;
    await user.save();

    
  } catch (error) {
    console.error('Error updating dark mode:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { authUser, registerUser, updateUserProfile, getUsersByPage, getAllUsers, updateDarkMode };
