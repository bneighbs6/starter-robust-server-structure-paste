const router = require("express").Router({ mergeParams: true }); // Creates new instance of Express router
const controller = require("./pastes.controller"); // Importes the /pastes controller
const methodNotAllowed = require("../errors/methodNotAllowed");

// new route for "/:pasteId" using the read fx from paste.controller.js
router.route("/:pasteId")
.get(controller.read) // Get request to read the paste
.put(controller.update) // Put request to update the paste
.delete(controller.delete) // Delete request to delete the paste
.all(methodNotAllowed); // Called at the end to be called only if no earlier handler completes request

// using route() allows you to write the path once, and then chain multiple route handlers to that path. .get(controller.list) uses the list() route handler defined in the controller for GET requests to "/".
router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);

module.exports = router; 