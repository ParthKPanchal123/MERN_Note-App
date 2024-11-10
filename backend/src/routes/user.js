const express = require('express');
const { signup, signin, signout } = require('../controllers/user'); // Ensure the correct path to the controller
const { verifyToken } = require('../middleware/verifyUser');

const user_router = express.Router();

user_router.post("/signup", signup);
user_router.post("/signin", signin);
user_router.get("/signout", verifyToken, signout);

module.exports = { user_router }; // Corrected export
