import 'dotenv/config'; // ✅ MUST BE LINE 1

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; // 👈 Add this for handling cookies
import router from "./router/authRoutes.js";
import userRouter from './router/userRoute.js';

const app = express();

// 1. Define your Frontend Origin
const allowedOrigins = [
  "https://farmer-consumer-digital-supply.vercel.app"
];

app.use(cors({
  origin: true,
  credentials: true
}));
// Middleware
app.use(express.json());
app.use(cookieParser()); // 👈 Essential for your verify/login routes to read tokens

// Routes
app.use("/api/auth", router);
app.use('/api/user', userRouter)

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Connect DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});