const express = require('express');
const bunyan = require('bunyan');

const configApp = require('./config/app');
const configRoutes = require('./config/routes');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const app = express();
const logger = bunyan.createLogger({ name: 'croud-dj' });

configApp(app);
configRoutes(app, IS_PRODUCTION);

app.listen(app.get('port'), app.get('host'), (error) => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Server listening on ${app.get('host')}:${app.get('port')}`);
  }
});
