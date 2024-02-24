const pastes = require("../data/pastes-data");

function list(req, res) {
    res.json({ data: pastes })
}


let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);


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

// pasteExists() and read() fx replace Route for "/pastes/:pasteId"
function pasteExists(req, res, next) {
    const { pasteId } = req.params;
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    if (foundPaste) {
        return next();
    }
    next({ 
        status: 400, 
        message: `Paste id not found: ${pasteId}`,
    });
}

function read(req, res) {
    const {pasteId} = req.params;
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    res.json({data: foundPaste});
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
};