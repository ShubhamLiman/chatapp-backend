import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./Utils/dbConfig.js";
import Authrouter from "./Routes/auth.routes.js";
import requestRouter from "./Routes/connection.Routes.js";
import messageRouter from "./Routes/message.Routes.js";
import { app, server } from "./Socket.js";

dotenv.config();
const port = process.env.PORT;
// app.use(
//   cors({
//     origin: "https://chatapp-frontend-rust.vercel.app/", // Allow requests from this origin
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//     credentials: true, // Allow cookies to be sent from the frontend
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chatapp-frontend-uewp.vercel.app",
    ], // Allow requests from all origins
    credentials: true, // Allow cookies to be sent from the frontend
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", Authrouter);
app.use("/api/request", requestRouter);
app.use("/api/message", messageRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

(async () => {
  await connectDB();
  server.listen(port, () => {
    console.log("Listening on port 3000");
  });
})();
