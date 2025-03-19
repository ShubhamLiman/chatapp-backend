import express from "express";
import {
  sendConnectionReq,
  interactToReq,
  deleteConnectionReq,
} from "../Controllers/connectionController.js";
import { protectRoute } from "../Middlewares/jwtconfig.js";
const requestRouter = express.Router();

requestRouter.post("/sendreq", protectRoute, sendConnectionReq);
requestRouter.put("/interact", protectRoute, interactToReq);
requestRouter.delete("/deleterequest", protectRoute, deleteConnectionReq);

export default requestRouter;
