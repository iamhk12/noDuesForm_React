const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = 5000;
const db = "mongodb+srv://rait:rait@cluster0.co23ho5.mongodb.net/raitnodues";

app.use(require("./routes"));

mongoose.connect(db).then(() => {
    console.log("Connection successful")
}).catch((err) => {
    console.log(err)
});

app.listen(port, () => {
    console.log("Listening on port : ", port);
})