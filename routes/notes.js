const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const Notes = require('../models/Notes');
const fetchuser = require("../middleware/fetchuser");

//Route 1: Fetch all notes by get request of a logged in user
router.get('/fetchallnotes', fetchuser,
    async (req, res) => {
        try {
            const notes = await Notes.find({ user: req.user.id });
            res.json(notes);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }

    }
)

//Route 2: Add a new notes by post request of a logged in user
router.post('/addnote', fetchuser,
    [
        body('title', 'title should be minimun of 3 letters').isLength({ min: 3 }),
        body('description', 'description should be minimum of 5 letters').isLength({ min: 5 })
    ],    // validator
    async (req, res) => {
        const errors = validationResult(req);  // If there is any wronge validation above it will return error messages
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { title, description, tag } = req.body;

            const note = new Notes({
                title, description, tag, user: req.user.id
            })

            const savedNote = await note.save();

            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }

    }
)

//Route 3: Update a existing note by put request of a logged in user
router.put('/updatenote/:id', fetchuser,
    async (req, res) => {

        try {
            const { title, description, tag } = req.body;

            const newnote = {};
            if (title) { newnote.title = title }
            if (description) { newnote.description = description }
            if (tag) { newnote.tag = tag }

            let note = await Notes.findById(req.params.id);  // This note is for :id
            if (!note) { return res.status(404).send("Not Found") };
            if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") };  // This check is for whether the current login person is not try to accessing some other users note by providing other users id in /:id 

            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });

            res.json(note);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }

    }
)

//Route 4: Delete a existing note by delete request of a logged in user
router.delete('/deletenote/:id', fetchuser,
    async (req, res) => {

        try {
            const { title, description, tag } = req.body;

            const newnote = {};
            if (title) { newnote.title = title }
            if (description) { newnote.description = description }
            if (tag) { newnote.tag = tag }

            let note = await Notes.findById(req.params.id);  // This note is for :id
            if (!note) { return res.status(404).send("Not Found") };
            if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") };  // This check is for whether the current login person is not try to accessing some other users note by providing other users id in /:id 

            note = await Notes.findByIdAndDelete(req.params.id);

            res.json({ "Success": "Note has been deleted", note: note });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }

    }
)

module.exports = router;