const db = require("../models");
const comment = require("../models/comment");
const Comment = db.comments;
const User = db.users;
const jwt = require("jsonwebtoken");

exports.createComment = (req, res, next) => {
  const comment = new Comment({
    UserId: req.body.UserId,
    MessageId: req.body.MessageId,
    comment: req.body.comment,
  });
  comment
    .save()
    .then(() => res.status(201).json({ message: "Commentaire ajouté !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyComment = (req, res, next) => {
  const commentId = req.query.commentId;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TKN_SECRET);
  const userId = decodedToken.userId;
  User.findOne({
    where: { id: userId },
  })
    .then((user) => {
      Comment.findOne({
        where: {
          id: commentId,
        },
      })
        .then((comment) => {
          if (user && (user.isAdmin || user.id == comment.userId)) {
            const comment = Comment.update(
              { comment: req.body.comment },
              { where: { id: req.body.commentId } }
            )
              .then(() => {
                return res.status(200).json({
                  message: "Publication modifié",
                  comments: comment,
                });
              })
              .catch(() => {
                console.error(error.message);
                return res.status(500).json({ error });
              });
          } else {
            return res.status(403).json({
              message: "Vous n'avez pas d'autorisation modifier ce post !",
            });
          }
        })
        .catch((error) => {
          console.error(error.message);
          res.status(404).json({ message: "Le commentaire n'existe pas!" });
        });
    })
    .catch((error) => {
      console.error(error.message);
      return res.status(500).json({ error });
    });
  console.log(comment);
  if (comment) {
    return res.status(200).json(comment);
  } else {
    throw res.json(err);
  }
};

exports.findOneComment = (req, res, next) => {
  Comment.findAll({
    where: {
      MessageId: req.params.Messageid,
    },
    include: {
      model: User,
      required: true,
      attributes: ["userName"],
    },
  })
    .then((comment) => {
      res.status(200).json(comment);
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.findAllComments = (req, res, next) => {
  Comment.findAll()
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteComment = (req, res, next) => {
  console.log(" comment id is: " + req.query.commentId);
  console.log(" comment Uid is : " + req.query.commentUid);
  console.log(" currentUid who ask the deletion is : " + req.query.currentUid);
  const commentId = req.query.commentId;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TKN_SECRET);
  const userId = decodedToken.userId;
  User.findOne({
    where: { id: userId },
  })
    .then((user) => {
      Comment.findOne({
        where: {
          id: commentId,
        },
      })
        .then((comment) => {
          if (user && (user.isAdmin || user.id == comment.userId)) {
            Comment.destroy({
              where: { id: comment.id },
            })
              .then(() => {
                return res.status(200).json({
                  message: "Publication supprimée",
                  comments: comment,
                });
              })
              .catch(() => {
                console.error(error.message);
                return res.status(500).json({ error });
              });
          } else {
            return res.status(403).json({
              message: "Vous n'avez pas d'autorisation effacer ce post !",
            });
          }
        })
        .catch((error) => {
          console.error(error.message);
          res.status(404).json({ message: "Le commentaire n'existe pas!" });
        });
    })
    .catch((error) => {
      console.error(error.message);
      return res.status(500).json({ error });
    });
};
