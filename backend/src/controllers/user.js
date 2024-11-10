const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { errorHandler } = require('../middleware/error');

const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if all required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the user already exists
        const isValidUser = await User.findOne({ email }); // Corrected `findOne`

        if (isValidUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error); // Passes error to the error handling middleware
    }
};

const signin = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const validUser = await User.findOne({ email })

        if (!validUser) {
            return next(errorHandler(404, "User not found"))
        }

        const validPassword = bcrypt.compareSync(password, validUser.password)

        if (!validPassword) {
            return next(errorHandler(401, "Wrong Credentials"))
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

        const { password: pass, ...rest } = validUser._doc

        res.cookie("access_token", token, { httpOnly: true }).status(200).json({
            success: true,
            message: "Login Successful!",
            rest,
        })
    } catch (error) {
        next(error)
    }
}

const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token")

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { signup, signin, signout };
