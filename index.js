const express = require('express');

const cors = require('cors');
const database = require('#config/db/database.js');
const routeAdmin = require('#routes/admin/index.route.js');
const route = require('#routes/client/index.route.js');
const routeDev = require('#routes/dev/db.route.js');
const globalErrorHandler = require('#middleware/errorHandler/globalError.middleware.js');
const {
  mongooseValidationError,
  mongooseDuplicateKeyError
} = require('#middleware/errorHandler/mongooseError.middlware.js');

database.connect();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

routeAdmin(app);
route(app);
if (process.env.NODE_ENV === 'development') app.use('/dev', routeDev);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.use(mongooseValidationError, mongooseDuplicateKeyError, globalErrorHandler);
