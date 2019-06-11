var httpServer = null;
const http = require('http');
const indexRouter = require('./router');


module.exports.init = function() {
  http.createServer();
}