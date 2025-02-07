import express from "express";
import { signup, login, logout } from "../Controllers/authController.js";
const Authrouter = express.Router();

Authrouter.post("/signup", signup);
Authrouter.post("/login", login);
Authrouter.get("/logout", logout);

export default Authrouter;
