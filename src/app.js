const express = require("express");
const app = express();

const pastesRouter = require("./pastes/pastes.router") // Imports paste router 

const usersRouter = require("./users/users.router") // Imports users router

const productsRouter = require("./products/products.router")

// express.json() is a built in middleware
// It adds a body property to request method (req.body)
// req.body will contain the parsed JSON data or return an empty object if there's an error 
app.use(express.json())

// TODO: Follow instructions in the checkpoint to implement ths API.
// Requiring paste data from ./data/pastes-data
const pastes = require("./data/pastes-data");

// Updated from app.get() to the code below to be able to handle the pasteRouter
// Attaches "/pastes" prefix to the url of any route defined in pastesRouter
app.use("/pastes", pastesRouter);

// attaches "/users" prefix to the url of any route defined in usersRouter
app.use("/users", usersRouter)

app.use("/products", productsRouter);

// Welcome page
app.use("/", (req, res, next) => {
  res.send("Welcome")
})

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