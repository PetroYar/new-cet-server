import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
dotenv.config();

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "30d" })
};

const authControler = {
  registration: async (req, res) => {
    try {
      const errror = validationResult(req);
      if (!errror.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error when registering", errror });
      }
      const { username, email, password } = req.body;

    

      const existUserName = await User.findOne({ username });
      if (existUserName) {
        return res
          .status(400)
          .json({ message: "A user with this username already exists" });
      }

      const existEmail = await User.findOne({ email });
      if (existEmail) {
        return res
          .status(400)
          .json({ message: "A user with this email already exists" });
      }

      const hashPass = bcrypt.hashSync(password, 7);
      const user = new User({
        username,
        email,
        password: hashPass,
      });

      await user.save();
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(400).json({ message: "Registration error", error });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Not a valid email" });
      }
      const validatePass =  bcrypt.hashSync(password, user.password);
      if (!validatePass) {
        return res.status(400).json({ message: "Not a valid password" });
      }

      const token = generateAccessToken(user._id);
      return res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ message: "Login error", error });
    }
  },
  getUser: async (req, res) => {
    try {
      
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: "Error getting profile", error });
    }
  },
};

export default authControler;
