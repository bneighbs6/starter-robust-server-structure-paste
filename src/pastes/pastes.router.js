const router = require("express").Router(); // Creates new instance of Express router
const controller = require("./pastes.controller"); // Importes the /pastes controller

// using route() allows you to write the path once, and then chain multiple route handlers to that path. .get(controller.list) uses the list() route handler defined in the controller for GET requests to "/".
router.route("/")
.get(controller.list)
.post(controller.create);  

// new route for "/:pasteId" using the read fx from paste.controller
router.route("/:pasteId")
.get(controller.read) // Get request to read the paste
.put(controller.update) // Put request to update the paste
.delete(controller.delete); // Delete request to delete the paste

module.exports = router; 