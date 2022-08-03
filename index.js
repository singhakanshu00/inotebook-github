const dotenv = require('dotenv');
const mongoose = require('mongoose');

const auth = require('./routes/auth.js');

const express = require('express')
var cors = require('cors')

dotenv.config({ path: './.env.local' });
const mongooseUri = process.env.DATABASE;
const port = process.env.PORT || 5000;


const app = express()
// respond with "hello world" when a GET request is made to the homepage

app.use(express.json());   // middleware needed to use req.body
app.use(cors())     // To fetch request from browser using frontend we need this


app.use('/api/auth', auth);
app.use('/api/notes', require("./routes/notes.js"));

//To deploy build of frontend on heroku

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
}

mongoose.connect(mongooseUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => {
        console.log("Server up and running!")
        console.log("Database connected");
    }))
    .catch((error) => console.log(error.message))