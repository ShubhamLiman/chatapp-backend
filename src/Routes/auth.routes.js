import express from "express";
import {
  signup,
  login,
  logout,
  changeProfilePic,
} from "../Controllers/authController.js";
import { protectRoute, checkToken } from "../Middlewares/jwtconfig.js";
const Authrouter = express.Router();

Authrouter.post("/signup", signup);
Authrouter.post("/login", login);
Authrouter.get("/logout", logout);
Authrouter.post("/uploadprofilepicture", protectRoute, changeProfilePic);
Authrouter.post("/checktoken", checkToken);

export default Authrouter;
