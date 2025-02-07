import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./Utils/dbConfig.js";
import Authrouter from "./Routes/auth.routes.js";
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", Authrouter);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log("Listening on port 3000");
  });
})();
