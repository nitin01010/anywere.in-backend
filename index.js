require("dotenv").config("");
const express = require("express");
const app = express();

const Port = process.env.PORT
const bodyParser = require('body-parser');
const cors = require("cors");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const test = require("./routes/test");
const signup = require("./routes/signup");
const tokenVerify = require("./routes/tokenVerify");

app.use('/api/v1/', test);
app.use('/api/v1/', signup);
app.use('/api/v1/', tokenVerify);

app.listen(Port, async (err) => {
    try {
        console.log(`Server is working fine`, Port);
    } catch (error) {
        console.log(`Server is Not working fine`, { err });
    }
});