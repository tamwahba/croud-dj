require('babel-polyfill');

const skip = [ // relative to './client'
  './main.jsx',
];
const context = require.context('./client', true, /\.jsx?$/);

context.keys().filter(key => !skip.includes(key)).forEach(context);
