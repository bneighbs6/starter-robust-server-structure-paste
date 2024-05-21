const express = require("express");
const app = express();
const pastes = require("./data/pastes-data")

// TODO: Follow instructions in the checkpoint to implement ths API.

// /pastes path handler

app.use("/pastes", (req, res, next) => {
  res.json({ data: pastes })
})

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
