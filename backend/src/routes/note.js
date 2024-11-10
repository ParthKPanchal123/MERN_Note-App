// src/routes/note.js
const express = require('express');
const { addNote, editNote, getAllNotes, deleteNote, updateNotePinned, searchNote } = require('../controllers/note');  // Import addNote from controllers/note.js
const { verifyToken } = require('../middleware/verifyUser');  // Import verifyUser from middleware/verifyUser.js

const note_router = express.Router();

// Ensure addNote and verifyUser are defined and not undefined
note_router.post("/add", verifyToken, addNote);  // Handle POST request for adding a note
note_router.post("/edit/:noteId", verifyToken, editNote);  // Handle POST request for editing a note
note_router.get("/all", verifyToken, getAllNotes);
note_router.delete("/delete/:noteId", verifyToken, deleteNote);
note_router.put("/update-note-pinned/:noteId", verifyToken, updateNotePinned);
note_router.get("/search", verifyToken, searchNote);


module.exports = { note_router };  // Correct export
