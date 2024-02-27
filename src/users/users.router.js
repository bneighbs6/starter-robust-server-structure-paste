// Create instance of Router()
const router = require("express").Router();

// Import users.controller
const controller = require("./users.controller");

// Create route for "/:userId"
router.route("/:userId").get(controller.read); // read() shows the specified user data from userId

// Create route for "/"
router.route("/").get(controller.list); // list() lists all of users data

module.exports = router;