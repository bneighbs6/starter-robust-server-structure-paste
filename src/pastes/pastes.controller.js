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

function exposurePropertyIsValid(req, res, next) {
    const { data: { exposure } = {} } = req.body;
    const validExposure = ["private", "public"];
    if (validExposure.includes(exposure)) {
        next();
    }
    next({
        status: 400,
        message: `Value of the 'exposure' property must be one of ${validExposure}. Received ${exposure}`,
    });
}

function syntaxPropertyIsValid(req, res, next) {
    const { data: { syntax } = {} } = req.body;
    const validSyntax = ["None", "Javascript", "Pythong", "Ruby", "Perl", "C", "Scheme"];
    if (validSyntax.includes(syntax)) {
        next()
    }
    next({
        status: 400, message: `Value of 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`
    })
}

function expirationPropertyIsValid(req, res, next) {
    const {data: {expiration} = {}} = req.body; 
    if (expiration <= 0 || Number.isInteger(expiration)) {
        next({status: 400, message: `Expiration requires a valid number. Received: ${expiration}`
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
        expirationPropertyIsValid,
        create
    ],
    list,
};