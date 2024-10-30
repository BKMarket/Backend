const express = require('express');
require('dotenv').config();
console.log(process.env.PORT);
console.log(decodeURIComponent(process.env.MONGO_URL));
const database = require('./config/database.js');
const routeAdmin = require('./api/routes/admin/index.route.js');
const route = require('./api/routes/client/index.route.js');
const Product = require('./api/models/product.model.js');
const globalErrorHandler = require('./middleware/globalErrorHandler.js');

database.connect();

const app = express();
const port = process.env.PORT;

routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use(globalErrorHandler);
