const express = require("express");
const app = express();

const pastesRouter = require("./pastes/pastes.router") // Imports paste router 

// express.json() is a built in middleware
// It adds a body property to request method (req.body)
// req.body will contain the parsed JSON data or return an empty object if there's an error 
app.use(express.json())

// TODO: Follow instructions in the checkpoint to implement ths API.
// Requiring paste data from ./data/pastes-data
const pastes = require("./data/pastes-data");

// Creating Route "/pastes" that will access 
// paste data and return it to user.

//By changing the code from app.use(...) to app.get(...), you're making it so that the handler will be called only if the HTTP method of the incoming request is GET.

// Updated from app.get() to the code below to be able to handle the pasteRouter
app.use("/pastes", pastesRouter)

// POST Request. ONLY used when making POST request to "/pastes"
// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID






// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;