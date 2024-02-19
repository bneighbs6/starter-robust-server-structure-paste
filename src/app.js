const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.
// Requiring paste data from ./data/pastes-data
const pastes = require("./data/pastes-data");

// Route for "/pastes/:pasteId".
app.use("/pastes/:pasteId", (req, res, next) => {
// Defines pasteId variable by destructuring it from req.params
  const {pasteId} = req.params;
// Use find() array method to search for the paste by Id.
// If no id matches, find() returns undefined.
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

// if foundPaste = truthy, then sends data with foundPaste object to the client as json. 
  if (foundPaste) {
    res.json({data: foundPaste});
  } else {
// Calls next with an error mesage to move request to error handler. 
    next(`Paste id not found: ${pasteId}`);
  }
})

// Creating Route "/pastes" that will access 
// paste data and return it to user.
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