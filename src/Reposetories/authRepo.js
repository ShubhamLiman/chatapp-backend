import User from "../Models/userSchema.js";
import bcrypt from "bcryptjs";
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
      message: "Registration successfully",
    };
  } catch (error) {
    console.log("Error in registerUser repository: ", error.message);

    return { success: false, message: error.message };
  }
};

export const loginUser = async (user) => {
  const { email, password } = user;
  try {
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
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      connections: user.connections,
      rooms: user.rooms,
      createdAt: user.createdAt,
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
