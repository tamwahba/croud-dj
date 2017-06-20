const express = require('express');

const paths = require('./paths');

module.exports = (app, isProduction) => {
  const router = new express.Router();
  const htmlFile = paths.indexHtml;

  if (isProduction) {
    router.all('*', (req, res) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(`https://${req.headers.host}${req.url}`);
      } else {
        res.sendFile(htmlFile);
      }
    });
  } else {
    router.all('*', (req, res) => {
      res.sendFile(htmlFile);
    });
  }

  app.use(router);
};
