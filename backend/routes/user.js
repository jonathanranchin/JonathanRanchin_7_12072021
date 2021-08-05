const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/usersCtrl");
const auth = require("../middleware/auth");

router.get("/all/", auth, userCtrl.findAllUsers);

router.get("/:id", auth, userCtrl.findOneUser);

router.delete("/", auth, userCtrl.deleteOneUser);

router.delete("/:id", auth, userCtrl.deleteMyAccount);

module.exports = router;
