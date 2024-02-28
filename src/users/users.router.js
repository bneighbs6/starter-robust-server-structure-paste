// Create instance of Router(). mergeParams merges the parameters from parent route to child route.
const router = require("express").Router({ mergeParams: true });

const methodNotAllowed = require("../errors/methodNotAllowed");
// Import users.controller
const controller = require("./users.controller");

// Imports pastes router.
const pastesRouter = require("../pastes/pastes.router");

// Nested Route. Attaching /pastes route to /users route
router.use("/:userId/pastes", pastesRouter);

// Create route for "/:userId"
router.route("/:userId").get(controller.read).all(methodNotAllowed); // read() shows the specified user data from userId

// Create route for "/"
router.route("/").get(controller.list).all(methodNotAllowed); // list() lists all of users data

module.exports = router;