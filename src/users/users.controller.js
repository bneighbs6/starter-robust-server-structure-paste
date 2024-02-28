// Require users data
const users = require("../data/users-data");

// list() lists the users data
function list(req, res) {
    res.json({ data: users });
}

// Middleware validation fx to verify if user exists
function userExists(req, res, next) {
    const { userId } = req.params;
    const foundUser = users.find((user) => user.id === Number(userId));
    if (foundUser) {
        res.locals.user = foundUser;
        return next()
    }
    next({ status: 400, message: `User id not found ${userId}`, })
}

// read() reads the foundUser
function read(req, res, next) {
    res.json({ data: res.locals.user });
}

// Exports
module.exports = {
    list,
    read: [userExists, read],
    userExists,
}