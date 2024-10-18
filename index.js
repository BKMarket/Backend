const express = require("express");
require("dotenv").config();
const database = require("./config/database.js");

const Product = require("./api/models/product.model.js");

database.connect();

const app = express();
const port = process.env.PORT;

const route = require("./api/routes/index.route.js")

// app.get("/tasks", async(req, res) => {
//     const tasks = await Task.find({
//         deleted: false,
//     }).select("title status timeStart timeFinish");
//     // console.log(tasks);
//     res.json(tasks);
// });

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
