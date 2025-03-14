import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./Utils/dbConfig.js";
import Authrouter from "./Routes/auth.routes.js";
dotenv.config();
const app = express();

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

const port = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", Authrouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log("Listening on port 3000");
  });
})();
