const express = require('express');
require('dotenv').config();

const database = require('./config/database.js');
const routeAdmin = require('./api/routes/admin/index.route.js');
const route = require('./api/routes/client/index.route.js');
const routeDev = require('#routes/dev/db.route.js');
const globalErrorHandler = require('./middleware/errorHandler/globalError.middleware.js');
const {
  mongooseValidationError,
  mongooseDuplicateKeyError
} = require('./middleware/errorHandler/mongooseError.middlware.js');

database.connect();

const app = express();
const port = process.env.PORT;

app.use(express.json());

routeAdmin(app);
route(app);
if (process.env.NODE_ENV === 'development') app.use('/dev', routeDev);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use(mongooseValidationError, mongooseDuplicateKeyError, globalErrorHandler);
