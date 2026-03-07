import 'dotenv/config'; // must be first

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./router/authRoutes.js";
import userRouter from './router/userRoute.js';

const app = express();

// ✅ Frontend URL
const FRONTEND_URL = "https://farmer-consumer-digital-supply.vercel.app";

// 1️⃣ CORS Middleware for Render
app.use(cors({
  origin: FRONTEND_URL,   // allow only your Vercel frontend
  credentials: true,      // allow cookies
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2️⃣ Preflight handler (important for Render)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", FRONTEND_URL);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204); // no content for preflight
  }
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", router);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));