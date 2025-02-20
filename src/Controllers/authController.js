import {
  registerUser,
  loginUser,
  updateProfilepic,
} from "../Reposetories/authRepo.js";
import { generateToken } from "../Middlewares/jwtconfig.js";
// import { JsonWebTokenError } from "jsonwebtoken";

export const signup = async (req, res) => {
  console.log("Signup controller");

  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await registerUser({ fullName, email, password });

    if (!user.success) {
      return res.status(400).json(user);
    }

    res.status(201).json(user);
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await loginUser({ email, password });

    if (!user.success) {
      return res.status(400).json({ message: user.message });
    }

    const token = generateToken(user.user.id);
    console.log(token);

    res.status(200).json({ user, token });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changeProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "Login to continue" });
    }
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    const upload = await updateProfilepic(profilePic, userId);
    if (!upload.success) {
      res.status(400).json(upload);
    }
    res.status(200).json(upload);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
