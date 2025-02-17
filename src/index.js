import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./Utils/dbConfig.js";
import Authrouter from "./Routes/auth.routes.js";
dotenv.config({
  origin: "https://chatapp-backend-pi-fawn.vercel.app/", // Or "*" for all domains
  credentials: true,
});
const app = express();

app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies to be sent from the frontend
  })
);

const port = process.env.PORT;

app.use(express.json());

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
