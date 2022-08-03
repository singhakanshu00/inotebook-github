const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User = require('../models/User');
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();

const JWT_TOKEN = process.env.JWT_TOKEN;

//Route 1: 
router.post('/createuser',
    [
        body('email', 'enter a valid email').isEmail(),
        body('name', 'name should be minimum of 3 letters').isLength({ min: 3 }),
        body('password', 'password should be atleast 5 characters').isLength({ min: 5 }),
    ],    // validator
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);  // If there is any wronge validation above it will return error messages
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: success, errors: errors.array() });
        }

        // Checking if user with email already exists.
        try {

            let user = await User.findOne({ email: req.body.email });  //will return a promise
            if (user) {
                return res.status(400).json({ success: success, error: "Sorry user with this email already exist" });
            }
            // If not exixts
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })

            const data = {   //creating data of jwt
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_TOKEN);  //creating jwt token to remeber where the user signed in before or not
            console.log(authToken);
            success = true;
            res.json({ success: success, authToken });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
)

//Route 2:
router.post('/login',
    [
        body('email', 'enter a valid email').isEmail(),
        body('password', 'password cannot be blank').exists(),
    ],    // validator
    async (req, res) => {
        const errors = validationResult(req);   // If any wronge validation above it will return errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let success = false;
            const user = await User.findOne({ email: email });
            if (!user) {

                return res.status(400).json({ success: success, error: "Please login with correct credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ success: success, error: "Please login with correct credentials" });
            }

            const data = {   //creating data of jwt
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_TOKEN);  //creating jwt token to remeber where the user signed in before or not
            console.log(authToken);
            success = true
            res.json({ success: success, authToken });

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");

        }
    }
)

//Route 3: Get logged in user details with login required
router.post('/getuser', fetchuser,    // whenever we want to get userid of our login user we use this middleware after that next fun will run
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: success, errors: errors.array() });
        }

        try {
            const userid = req.user.id;
            const user = await User.findById(userid).select("-password");
            if (!user) {
                return res.status(400).send({ success: success, error: "Enter correct credentials" });
            }
            success = true;
            res.send({ success: success, user });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
);
module.exports = router;