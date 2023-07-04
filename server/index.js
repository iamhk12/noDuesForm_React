const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(bodyParser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// app.use(express.bodyParser({limit: '20mb'}));

const port = process.env.PORT || 5000;
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