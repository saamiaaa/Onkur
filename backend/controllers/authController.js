const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate authentication token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Send token through secure cookie
const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.cookie("onkur_token", token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    message:
      statusCode === 201
        ? "Account created successfully!"
        : "Login successful!",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      university: user.university,
      degree: user.degree,
      year: user.year,
      interests: user.interests,
      skills: user.skills,
    },
  });
};

// SIGN UP
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid full name.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    console.error("Signup error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong while creating your account.",
    });
  }
};

// SIGN IN
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.error("Signin error:", error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong while signing in.",
    });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.cookie("onkur_token", "", {
    ...cookieOptions,
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch your profile.",
    });
  }
};

// UPDATE STUDENT PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const { fullName, university, degree, year, interests } = req.body;

    if (fullName !== undefined) {
      if (typeof fullName !== "string" || fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid full name.",
        });
      }

      user.fullName = fullName.trim();
    }

    if (university !== undefined) {
      user.university = String(university).trim();
    }

    if (degree !== undefined) {
      user.degree = String(degree).trim();
    }

    if (year !== undefined) {
      user.year = String(year).trim();
    }

    if (interests !== undefined) {
      if (!Array.isArray(interests)) {
        return res.status(400).json({
          success: false,
          message: "Interests must be a list.",
        });
      }

      user.interests = interests
        .filter((interest) => typeof interest === "string")
        .map((interest) => interest.trim())
        .filter(Boolean);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Your profile has been updated successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        university: user.university,
        degree: user.degree,
        year: user.year,
        interests: user.interests,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update your profile.",
    });
  }
};

module.exports = {
  signup,
  signin,
  logout,
  getMe,
  updateProfile,
};