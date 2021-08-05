const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/commentsCtrl");
const auth = require("../middleware/auth");

router.get("/", auth, commentCtrl.findAllComments);

router.get("/:Messageid", auth, commentCtrl.findOneComment);

router.post("/", auth, commentCtrl.createComment);

router.put("/:MessageId", auth, commentCtrl.modifyComment);

router.delete("/:CommentId", auth, commentCtrl.deleteComment); //ajout de l'id du commentaire

module.exports = router;
