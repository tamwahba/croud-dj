import test from 'ava';
import express from 'express';
import request from 'supertest';

import configureApp from './config/app';
import configureRoutes from './config/routes';

function makeApp(isProduction) {
  let app = express();
  configureApp(app);
  configureRoutes(app, isProduction);
  return app;
}

test.cb('server should redirect http to https in production', (t) => {
  request(makeApp(true))
    .get('/')
    .set('host', 'localhost')
    .set('x-forwarded-proto', 'http')
    .expect('Location', 'https://localhost/')
    .expect(302, t.end);
});

test.cb('server should NOT redirect http to https in development', (t) => {
  request(makeApp())
    .get('/')
    .set('x-forwarded-proto', 'http')
    .expect(200, t.end);
});

test.cb('server should respond with html at `/` in production', (t) => {
  request(makeApp(true))
    .get('/')
    .set('x-forwarded-proto', 'https')
    .expect('Content-Type', 'text/html; charset=UTF-8')
    .expect(200, t.end);
});

test.cb('server should respond with html at `/` in development', (t) => {
  request(makeApp())
    .get('/')
    .expect('Content-Type', 'text/html; charset=UTF-8')
    .expect(200, t.end);
});

test.cb('server should respond with html at `/any` in production', (t) => {
  request(makeApp(true))
    .get('/any')
    .set('x-forwarded-proto', 'https')
    .expect('Content-Type', 'text/html; charset=UTF-8')
    .expect(200, t.end);
});

test.cb('server should respond with html at `/any` in development', (t) => {
  request(makeApp())
    .get('/any')
    .expect('Content-Type', 'text/html; charset=UTF-8')
    .expect(200, t.end);
});
