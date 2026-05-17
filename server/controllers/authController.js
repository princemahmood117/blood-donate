import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc   Register user
export const registerUser = async (req, res) => {
  const { fullName, phone, email, password, bloodGroup } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      bloodGroup,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      bloodGroup: user.bloodGroup,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      bloodGroup: user.bloodGroup,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current user profile
export const getMe = async (req, res) => {
  res.json(req.user);
};