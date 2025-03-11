import User from "../Models/userSchema.js";
import bcrypt from "bcryptjs";
import { uploadResult } from "../Utils/cloudinaryConfig.js";
import cloudinary from "../Utils/cloudinaryConfig.js";

export const registerUser = async (user) => {
  const { fullName, email, password } = user;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, email, password: hashedPassword });
    const savedUser = await newUser.save();
    const senduserData = {
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
    };
    return {
      success: true,
      user: senduserData,
      message: "Registration successfull",
    };
  } catch (error) {
    console.log("Error in registerUser repository: ", error.message);

    return { success: false, message: error.message };
  }
};

export const loginUser = async (user) => {
  const { email, password } = user;
  try {
    if (!email || !password) {
      return {
        success: false,
        message: "All fields are required",
      };
    }
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }
    const senduserData = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      connections: user.connections,
      rooms: user.rooms,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return {
      success: true,
      user: senduserData,
      message: "Login successfully",
    };
  } catch (error) {
    console.log("Error in loginUser repository: ", error.message);

    return { success: false, message: error.message };
  }
};

export const updateProfilepic = async (dp, userId) => {
  try {
    const uploadResponse = await uploadResult(dp);
    // console.log(uploadResponse);
    let url = cloudinary.url(uploadResponse.public_id, {
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
        },
        {
          width: 500,
          height: 500,
        },
      ],
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: url },
      { new: true }
    );
    const senduserData = {
      _id: updatedUser._id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      profilePic: updatedUser.profilePic,
      connections: updatedUser.connections,
      rooms: updatedUser.rooms,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
    return {
      success: true,
      message: "Profile picture uploaded",
      user: senduserData,
    };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};
