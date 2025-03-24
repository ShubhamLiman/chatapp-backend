import express from "express";

import { protectRoute } from "../Middlewares/jwtconfig.js";
import { getMessages, sendMessage } from "../Controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/get/:id", protectRoute, getMessages);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
