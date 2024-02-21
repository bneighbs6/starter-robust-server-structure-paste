const express = require("express");
const app = express();

// express.json() is a built in middleware
// It adds a body property to request method (req.body)
// req.body will contain the parsed JSON data or return an empty object if there's an error 
app.use(express.json())

// TODO: Follow instructions in the checkpoint to implement ths API.
// Requiring paste data from ./data/pastes-data
const pastes = require("./data/pastes-data");

// Route for "/pastes/:pasteId".
app.use("/pastes/:pasteId", (req, res, next) => {
  // Defines pasteId variable by destructuring it from req.params
  const { pasteId } = req.params;
  // Use find() array method to search for the paste by Id.
  // If no id matches, find() returns undefined.
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  // if foundPaste = truthy, then sends data with foundPaste object to the client as json. 
  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    // Calls next with an error mesage to move request to error handler. 
    next(`Paste id not found: ${pasteId}`);
  }
})

// Creating Route "/pastes" that will access 
// paste data and return it to user.

//By changing the code from app.use(...) to app.get(...), you're making it so that the handler will be called only if the HTTP method of the incoming request is GET.
app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// POST Request. ONLY used when making POST request to "/pastes"
// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID

// New middleware function to validate the request body
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // Call `next()` without an error message if the result exists
  }
  next("A 'text' property is required.");
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text } = {} } = req.body;
  if (text) {
    const newPaste = {
      id: ++lastPasteId, // Increment last ID, then assign as the current ID
      name,
      syntax,
      exposure,
      expiration,
      text,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
   } else {
     res.sendStatus(400);
   }
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