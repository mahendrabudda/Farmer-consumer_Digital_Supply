import express from "express";
import { login, register , resetPassword, sendResetOtp } from "../controller/auth/authController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login",login);
router.post("/reset-password", resetPassword);
router.post("/send-reset-otp" , sendResetOtp);

export default router;