import User from "../schema/user.schema.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generateTokens.js";

export const registerUser = async (req, res) => {
    const { name,email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (newUser) {
           const token = generateAccessToken(newUser._id);
           res.status(201).json({ 
            name: newUser.name,
            message: "User created successfully",
            token
         });
        }


    }catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            email,
        });
        if (!user) {
            return res.status(400).json({ message: "User Does Not Exist" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateAccessToken(user._id);
        res.status(200).json({ 
            message: "Login successful", 
            token,
            name: user.name,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};