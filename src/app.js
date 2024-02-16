const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.

// Requiring paste data from ./data/pastes-data
const pastes = require("./data/pastes-data");
// Creating Route "/pastes" that will access paste data and return it to user.
app.use("/pastes", (req, res) => {
  res.json({data: pastes});
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
