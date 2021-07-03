const http = require('http');
//const https = require('https');
function handler(req, res) {
  res.end('Hello World!');
}
http.createServer(handler).listen(8081);
//https.createServer(handler).listen(443)