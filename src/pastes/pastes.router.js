const router = require("express").Router(); // Creates new instance of Express router
const controller = require("./pastes.controller"); // Importes the /pastes controller

router.route("/").
get(controller.list) // using route() allows you to write the path once, and then chain multiple route handlers to that path. .get(controller.list) uses the list() route handler defined in the controller for GET requests to /.
.post(controller.create);  

// new route for "/:pasteId" using the read fx from paste.controller
router.route("/:pasteId").get(controller.read);

module.exports = router; 