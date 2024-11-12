const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { user_router } = require('./src/routes/user'); // Correct import of user router
const { note_router } = require('./src/routes/note'); // Correct import of note router
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

// Routes
app.use('/api/user', user_router); // Use user routes for /api/user
app.use('/api/note', note_router); // Use note routes for /api/note


// Connect to MongoDB
app.listen(3001, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log("Connected to MongoDB..."))
        .catch(err => console.log(err));
    console.log(`Server is running on port 3001`);
});




// error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Serer Error"
  
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    })
  })