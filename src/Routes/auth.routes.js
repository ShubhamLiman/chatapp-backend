import express from "express";
import {
  signup,
  login,
  logout,
  changeProfilePic,
  checkAuth,
} from "../Controllers/authController.js";
import { protectRoute } from "../Middlewares/jwtconfig.js";
const Authrouter = express.Router();

Authrouter.post("/signup", signup);
Authrouter.post("/login", login);
Authrouter.get("/logout", logout);
Authrouter.post("/uploadprofilepicture", protectRoute, changeProfilePic);
Authrouter.get("/check", protectRoute, checkAuth);
export default Authrouter;
