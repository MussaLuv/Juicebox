const { client } = require('./db');
client.connect();
const express = require('express');
const server = express();
const PORT = 3000;
const apiRouter = require('./api');
server.use('/api', apiRouter);
const morgan = require('morgan');
server.use(morgan('dev'));


server.use(express.json())

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

server.use('/api', (req, res, next) => {
  console.log("A request was made to /api");
  next();
});

server.get('/api', (req, res, next) => {
  console.log("A get request was made to /api");
  res.send({ message: "success" });
});

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});
