import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../../config/Nodemailer.js";
import userModel from "../../model/authmodel/userModel.js";

// ── import helpers from farmerController ──
import {
  createFarmerProfileHelper,
  getFarmerDashboardHelper
} from "../farmerController/farmerController.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res) => {
  const { fullName, email, password, phoneNumber, address, role } = req.body;

  if (!fullName || !email || !password || !phoneNumber || !address || !role) {
    return res.json({ success: false, message: "Please provide all required details to join MaMholi." });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "This email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      fullName, email,
      password: hashedPassword,
      phoneNumber, address,
      role: role.toLowerCase(),
      isAccountVerified: true,
    });
    await user.save();

    // ── create farmer profile using helper ──
    if (role.toLowerCase() === 'farmer') {
      await createFarmerProfileHelper(user._id)
    }

    // ── JWT + Cookie ──
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ── Welcome Email ──
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Welcome to MaMholi, ${fullName}! 🌿`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to MaMholi</title>
</head>
<body style="margin:0;padding:0;background-color:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080808;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(90deg,#4ade80,#22c55e,#16a34a);height:3px;border-radius:3px 3px 0 0;"></td></tr>
        <tr><td style="background:#0d0d0d;border:1px solid #1a1a1a;border-top:none;border-radius:0 0 24px 24px;padding:50px 48px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:36px;">
              <span style="font-size:32px;">🌾</span><br/>
              <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:6px;text-transform:uppercase;">Ma<span style="color:#4ade80;">Mholi</span></span><br/>
              <span style="font-size:10px;color:#333;letter-spacing:4px;text-transform:uppercase;font-weight:700;">FROM SOIL TO SOUL</span>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:32px;">
              <div style="background:linear-gradient(135deg,rgba(74,222,128,0.08),rgba(34,197,94,0.04));border:1px solid rgba(74,222,128,0.12);border-radius:20px;padding:36px 32px;">
                <p style="margin:0 0 8px;font-size:13px;color:#4ade80;font-weight:800;letter-spacing:3px;text-transform:uppercase;">You're In 🎉</p>
                <h1 style="margin:0 0 12px;font-size:30px;font-weight:900;color:#ffffff;line-height:1.2;">Welcome, ${fullName}!</h1>
                <p style="margin:0;font-size:15px;color:#666;font-weight:400;line-height:1.6;">Your journey on MaMholi begins now.<br/>Direct. Fresh. Soulful.</p>
              </div>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td align="center">
              <div style="display:inline-block;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);border-radius:100px;padding:10px 28px;">
                <span style="color:#4ade80;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">
                  ${role === 'farmer' ? '🌾' : '🛒'} &nbsp; Registered as ${role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </div>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="border-top:1px solid #1a1a1a;"></td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td><p style="margin:0 0 20px;font-size:11px;color:#444;font-weight:800;letter-spacing:3px;text-transform:uppercase;">What's Next</p></td></tr>
            <tr><td>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${role.toLowerCase() === 'farmer' ? `
                <tr><td style="padding-bottom:12px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:16px 20px;">
                    <tr>
                      <td width="40" style="vertical-align:middle;"><div style="width:36px;height:36px;background:rgba(74,222,128,0.1);border-radius:10px;text-align:center;line-height:36px;font-size:16px;">🌱</div></td>
                      <td style="padding-left:14px;vertical-align:middle;">
                        <p style="margin:0;color:#fff;font-size:13px;font-weight:700;">Add Your First Crop Listing</p>
                        <p style="margin:4px 0 0;color:#555;font-size:12px;">Go to your dashboard and list what you grow.</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                <tr><td style="padding-bottom:12px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:16px 20px;">
                    <tr>
                      <td width="40" style="vertical-align:middle;"><div style="width:36px;height:36px;background:rgba(74,222,128,0.1);border-radius:10px;text-align:center;line-height:36px;font-size:16px;">📦</div></td>
                      <td style="padding-left:14px;vertical-align:middle;">
                        <p style="margin:0;color:#fff;font-size:13px;font-weight:700;">Manage Orders</p>
                        <p style="margin:4px 0 0;color:#555;font-size:12px;">Track and fulfill consumer orders with ease.</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                <tr><td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:16px 20px;">
                    <tr>
                      <td width="40" style="vertical-align:middle;"><div style="width:36px;height:36px;background:rgba(74,222,128,0.1);border-radius:10px;text-align:center;line-height:36px;font-size:16px;">💰</div></td>
                      <td style="padding-left:14px;vertical-align:middle;">
                        <p style="margin:0;color:#fff;font-size:13px;font-weight:700;">Get Paid Directly</p>
                        <p style="margin:4px 0 0;color:#555;font-size:12px;">Zero middlemen. 100% of your earnings, yours.</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                ` : `
                <tr><td style="padding-bottom:12px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:16px 20px;">
                    <tr>
                      <td width="40" style="vertical-align:middle;"><div style="width:36px;height:36px;background:rgba(74,222,128,0.1);border-radius:10px;text-align:center;line-height:36px;font-size:16px;">🔍</div></td>
                      <td style="padding-left:14px;vertical-align:middle;">
                        <p style="margin:0;color:#fff;font-size:13px;font-weight:700;">Browse Fresh Produce</p>
                        <p style="margin:4px 0 0;color:#555;font-size:12px;">Explore crops listed directly by local farmers.</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                <tr><td style="padding-bottom:12px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:16px 20px;">
                    <tr>
                      <td width="40" style="vertical-align:middle;"><div style="width:36px;height:36px;background:rgba(74,222,128,0.1);border-radius:10px;text-align:center;line-height:36px;font-size:16px;">🛒</div></td>
                      <td style="padding-left:14px;vertical-align:middle;">
                        <p style="margin:0;color:#fff;font-size:13px;font-weight:700;">Place Your First Order</p>
                        <p style="margin:4px 0 0;color:#555;font-size:12px;">Buy fresh, support local, skip the middleman.</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                <tr><td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:16px 20px;">
                    <tr>
                      <td width="40" style="vertical-align:middle;"><div style="width:36px;height:36px;background:rgba(74,222,128,0.1);border-radius:10px;text-align:center;line-height:36px;font-size:16px;">🚚</div></td>
                      <td style="padding-left:14px;vertical-align:middle;">
                        <p style="margin:0;color:#fff;font-size:13px;font-weight:700;">Track Your Delivery</p>
                        <p style="margin:4px 0 0;color:#555;font-size:12px;">Real-time updates from farm to your doorstep.</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                `}
              </table>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
            <tr><td align="center">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login"
                style="display:inline-block;background:linear-gradient(135deg,#4ade80,#22c55e);color:#000000;font-size:13px;font-weight:900;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:14px;">
                Go to Dashboard →
              </a>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="border-top:1px solid #1a1a1a;"></td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
            <tr>
              <td align="center" width="33%">
                <p style="margin:0;color:#4ade80;font-size:18px;font-weight:900;">10K+</p>
                <p style="margin:4px 0 0;color:#444;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Farmers</p>
              </td>
              <td align="center" width="33%" style="border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
                <p style="margin:0;color:#4ade80;font-size:18px;font-weight:900;">50K+</p>
                <p style="margin:4px 0 0;color:#444;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Consumers</p>
              </td>
              <td align="center" width="33%">
                <p style="margin:0;color:#4ade80;font-size:18px;font-weight:900;">0%</p>
                <p style="margin:4px 0 0;color:#444;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Middlemen</p>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <p style="margin:0 0 6px;font-size:12px;color:#333;line-height:1.6;">Questions? Reply to this email — we're always here.</p>
              <p style="margin:0;font-size:11px;color:#222;letter-spacing:1px;">© 2026 MaMholi · Sustainable Farming, Better Living.</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:10px;color:#2a2a2a;letter-spacing:4px;text-transform:uppercase;font-weight:700;">100% DIRECT &nbsp;·&nbsp; 0% MIDDLEMEN</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
    }

    await transporter.sendMail(mailOptions);

    // ── get dashboard using helper ──
    const dashboard = role.toLowerCase() === 'farmer'
      ? await getFarmerDashboardHelper(user._id)
      : null

    return res.json({
      success: true,
      message: "Registration successful! Welcome to MaMholi.",
      role: user.role,
      name: user.fullName,
      user: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
      dashboard
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verifyOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.verifyOtpExpireAt) return res.status(400).json({ message: "OTP expired" });
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();
    res.json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'Email and Password are Required' });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'Invalid mail id' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ── get dashboard using helper ──
    const dashboard = user.role === 'farmer'
      ? await getFarmerDashboardHelper(user._id)
      : null

    return res.json({
      success: true,
      role: user.role,
      name: user.fullName,
      user: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
      dashboard
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required' });
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'No account found with this email' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'MaMholi — Password Reset OTP 🔐',
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
        <tr><td style="background:linear-gradient(90deg,#4ade80,#22c55e,#16a34a);height:3px;border-radius:3px 3px 0 0;"></td></tr>
        <tr><td style="background:#0d0d0d;border:1px solid #1a1a1a;border-top:none;border-radius:0 0 24px 24px;padding:48px 44px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:32px;">
              <span style="font-size:30px;">🌾</span><br/>
              <span style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:6px;text-transform:uppercase;">Ma<span style="color:#4ade80;">Mholi</span></span><br/>
              <span style="font-size:9px;color:#2a2a2a;letter-spacing:4px;text-transform:uppercase;font-weight:700;">FROM SOIL TO SOUL</span>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td align="center" style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.12);border-radius:20px;padding:32px 28px;">
              <div style="width:56px;height:56px;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.2);border-radius:16px;display:inline-block;text-align:center;line-height:56px;font-size:24px;margin-bottom:16px;">🔐</div>
              <p style="margin:0 0 6px;font-size:11px;color:#4ade80;font-weight:800;letter-spacing:3px;text-transform:uppercase;">Password Reset</p>
              <h2 style="margin:0 0 10px;font-size:26px;font-weight:900;color:#ffffff;">Here's your OTP</h2>
              <p style="margin:0;font-size:13px;color:#555;line-height:1.6;">Hi <strong style="color:#fff;">${user.fullName}</strong>, use the code below.<br/>Valid for <strong style="color:#4ade80;">15 minutes</strong> only.</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td align="center">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${otp.split('').map(digit => `
                    <td style="padding:0 5px;">
                      <div style="width:52px;height:60px;background:#111;border:1px solid #252525;border-radius:14px;text-align:center;line-height:60px;font-size:26px;font-weight:900;color:#4ade80;display:inline-block;">${digit}</div>
                    </td>
                  `).join('')}
                </tr>
              </table>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.1);border-radius:12px;padding:14px 18px;">
              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">⚠️ &nbsp;Didn't request this? Simply ignore this email.</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <p style="margin:0;font-size:10px;color:#1e1e1e;letter-spacing:1px;">© 2026 MaMholi · Sustainable Farming, Better Living.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP and new password are required' });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });
    if (!user.resetOtp || user.resetOtp !== otp) return res.json({ success: false, message: 'Invalid OTP' });
    if (Date.now() > user.resetOtpExpireAt) return res.json({ success: false, message: 'OTP has expired. Please request a new one.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, role: user.role, message: 'Password reset successfully' });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};