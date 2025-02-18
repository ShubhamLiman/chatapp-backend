import jwt from "jsonwebtoken";
import User from "../Models/userSchema.js";
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  // res.cookie("jwt", token, {
  //   maxAge: 1 * 24 * 60 * 60 * 1000, // MS 1 hour
  //   httpOnly: true, // prevent XSS attacks cross-site scripting attacks
  //   sameSite: "None", // CSRF attacks cross-site request forgery attacks
  //   secure: true,
  //   domain: "chatapp-frontend-rust.vercel.app",
  //   path: "/",
  // });

  return token;
};

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
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
