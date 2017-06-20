const compression = require('compression');
const express = require('express');
const helmet = require('helmet');

const paths = require('./paths');

module.exports = (app) => {
  app.set('host', process.env.HOST || '0.0.0.0');
  app.set('port', process.env.PORT || 3000);

  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.hsts({ force: true, maxAge: 5184000 })); // 60 days
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());

  app.use(compression());

  app.use(express.static(paths.static, { index: false }));
};
