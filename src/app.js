const express = require('express');
const routes = require('./routes');
const logger = require('./middlewares/logger');
const errorHandler = require('./utils/globalErrorHandlers/errorHandler');

const app = express();
app.use(express.json());
app.use(logger);

app.use('/api/v1', routes);

app.use(errorHandler);

module.exports = app;
