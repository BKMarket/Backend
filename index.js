const express = require("express");
require("dotenv").config();
const database = require("./config/database.js");

const Product = require("./api/models/product.model.js");

database.connect();

const app = express();
const port = process.env.PORT;

const route = require("./api/routes/index.route.js")


route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
