import jwt from "jsonwebtoken";
import User from "../Models/userSchema.js";
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};

export const protectRoute = async (req, res, next) => {
  console.log(req.cookies.jwt);

  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkToken = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided", success: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Token", success: false });
    }

    const user = await User.findById(decoded.userId).select("-password");
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res
      .status(200)
      .json({ success: true, message: "user is alredy logged in", user });
  } catch (err) {
    console.log("Error in protectRoute middleware: ", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", err: err.message });
  }
};
