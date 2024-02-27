const pastes = require("../data/pastes-data");

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

// Middleware Validation Functions

// New middleware function to validate the request body
// Updated to allow validation of any given parameter (propertyName)
function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next()
        }
        next({ status: 400, message: `Must include a ${propertyName}` })
    }
}

// pasteExists() and read() fx replace Route for "/pastes/:pasteId"
function pasteExists(req, res, next) {
    const { pasteId } = req.params;
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    if (foundPaste) {
        res.locals.paste = foundPaste;
        return next();
    }
    next({ 
        status: 400, 
        message: `Paste id not found: ${pasteId}`,
    });
}


// Tests if exposure property is valid
function exposurePropertyIsValid(req, res, next) {
    const { data: { exposure } = {} } = req.body;
    const validExposure = ["private", "public"];
    if (validExposure.includes(exposure)) {
      return next();
    }
    next({
      status: 400,
      message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
    });
  }


  // Tests if syntax property is valid
  function syntaxPropertyIsValid(req, res, next) {
    const { data: { syntax } = {} } = req.body;
    const validSyntax = ["None", "Javascript", "Python", "Ruby", "Perl", "C", "Scheme"];
    if (validSyntax.includes(syntax)) {
      return next();
    }
    next({
      status: 400,
      message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
    });
  }


  // Tests if expiration property is valid
  function expirationIsValidNumber(req, res, next){
    const { data: { expiration }  = {} } = req.body;
    if (expiration <= 0 || !Number.isInteger(expiration)){
        return next({
            status: 400,
            message: `Expiration requires a valid number`
        });
    }
    next();
  }

// CRUDL Functions

function create(req, res) {
    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
    const newPaste = {
        id: ++lastPasteId, // Increment last id then assign as the current ID
        name,
        syntax,
        exposure,
        expiration,
        text,
        user_id,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
}

// Reads list of paste data
function read(req, res) {
    res.json({data: res.locals.paste});
}

// Updates an existing paste
function update(req, res) {
    const paste = res.locals.paste;
    const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
    
    // Update the paste
    paste.name = name;
    paste.syntax = syntax;
    paste.expiration = expiration;
    paste.exposure = exposure;
    paste.text = text; 

    res.json({ data: paste });
 }


 // Delete existing paste
 function destroy(req, res) {
    const { pasteId } = req.params; 
    const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
    // splice returns an array of the deleted elements, even if it is one element
    const deletedPaste = pastes.slice(index, 1);
    res.sendStatus(204);
 }

 function list(req, res) {
    res.json({ data: pastes })
}

// Order of exports matters
module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        bodyDataHas("user_id"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        create
    ],
    list,
    read: [pasteExists, read],
    update: [
        pasteExists,
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        update
    ],
    delete: [pasteExists, destroy],
};