const express = require('express');
require('dotenv').config();

const database = require('./config/database.js');
const routeAdmin = require('./api/routes/admin/index.route.js');
const route = require('./api/routes/client/index.route.js');
const Product = require('./api/models/product.model.js');
const globalErrorHandler = require('./middleware/globalErrorHandler.js');
const auth = require('./api/routes/auth.route.js');
const {
  mongooseValidationError,
  mongooseDuplicateKeyError
} = require('./middleware/mongooseErrorHandler.js');

database.connect();

const app = express();
const port = process.env.PORT;

app.use(express.json());

routeAdmin(app);
route(app);

// test auth
app.use(auth);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use(mongooseValidationError, mongooseDuplicateKeyError, globalErrorHandler);
