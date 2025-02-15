const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const logger = require('./middlewares/logger');
const {methodNotAllowedHandler} = require('./middlewares/errorHandlers');
const errorHandler = require('./utils/globalErrorHandlers/errorHandler');
const corsMiddleware = require('./middlewares/cors');

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use('/api/v1', routes);

app.use(methodNotAllowedHandler);
app.use(errorHandler);

module.exports = app;
