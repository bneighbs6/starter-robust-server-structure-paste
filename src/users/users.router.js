// Create instance of Router()
const router = require("express").Router();

const methodNotAllowed = require("../errors/methodNotAllowed");
// Import users.controller
const controller = require("./users.controller");

const pastesRouter = require("../pastes/pastes.router");

router.use("/:userId/pastes", pastesRouter);

// Create route for "/:userId"
router.route("/:userId").get(controller.read).all(methodNotAllowed); // read() shows the specified user data from userId

// Create route for "/"
router.route("/").get(controller.list).all(methodNotAllowed); // list() lists all of users data

module.exports = router;