

const fs = require('fs');
const https = require('https');
const path = require('path');

const express = require('express');
const debug = require('debug')('app');

const publicServer = express();

publicServer.use(express.static(path.join(__dirname, 'dist')));

const handler = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.sendFile('./dist/index.html');
};

publicServer.get('/', handler);

const options = {
  name: 'emelyanovtv',
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('cert.pem'),
};

https.createServer(options, publicServer).listen(443, () => {
  debug(`public API ${publicServer.name} listening at port: 443`);
});

// Redirect from http port 80 to https
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);
