const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const messageCtrl = require("../controllers/messagesCtrl");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, messageCtrl.createMessage);

router.put("/:MessageId", auth, multer, messageCtrl.modifyMessage);

router.get("/all/:id", auth, messageCtrl.findAllMessagesForOne);

router.get("/:id", auth, messageCtrl.findOneMessage);

router.get("/", auth, messageCtrl.findAllMessages);

router.delete("/", auth, messageCtrl.deleteMessage);

module.exports = router;
