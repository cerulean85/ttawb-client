const express = require("express");
const app = express();
const action = require("./routes/action");
const config = require("./config");
var cookieParser = require('cookie-parser');
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.json());
app.use(cookieParser());
app.use("/action", action)

app.listen(config.port, () => {
    console.log(`Server Listening at http://localhost:${config.port}`)
});

