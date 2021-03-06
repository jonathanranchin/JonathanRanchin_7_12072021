const db = require("../models");
const Message = db.messages;
const User = db.users;
const Comment = db.comments;
const jwt = require("jsonwebtoken");

exports.modifyMessage = (req, res, next) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TKN_SECRET);
  const userId = decodedToken.userId;
  User.findOne({
    where: { id: userId },
  })
    .then((user) => {
      Message.findOne({
        where: {
          id: obj.MessageId,
        },
      })
        .then((comment) => {
          if (user && (user.isAdmin || user.id == comment.userId)) {
            try {
              let imagePost = "";
              if (req.file) {
                imagePost = `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`;
              }
              const obj = JSON.parse(JSON.stringify(req.body));
              console.log(obj);
              Message.update(
                {
                  message: obj.message,
                  messageUrl: imagePost,
                },
                { where: { id: obj.MessageId } }
              );
              res.status(200).json({ message: "Publication réussie" });
            } catch {
              return res.status(400).json({ error });
            }
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

exports.createMessage = (req, res, next) => {
  let imagePost = "";
  if (req.file) {
    imagePost = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  const message = new Message({
    UserId: req.body.UserId,
    message: req.body.message,
    messageUrl: imagePost,
  });
  message
    .save()
    .then(() => res.status(201).json({ message: "Publication réussie" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.findAllMessages = (req, res, next) => {
  Message.findAll({
    include: { model: User, required: true, attributes: ["userName"] },

    order: [["id", "DESC"]],
  })
    .then((messages) => {
      const list = messages.map((message) => {
        return Object.assign(
          {},
          {
            id: message.id,
            createdAt: message.createdAt,
            message: message.message,
            messageUrl: message.messageUrl,
            UserId: message.UserId,
            userName: message.User.userName,
            isActive: message.User.isActive,
          }
        );
      });
      res.status(200).json({ list });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.findOneMessage = (req, res, next) => {
  const oneMessage = {};
  Message.findOne({
    where: { id: req.params.id },
    include: {
      model: User,
      required: true,
      attributes: ["userName"],
    },
    order: [["id", "DESC"]],
  })
    .then((message) => {
      oneMessage.id = message.id;
      oneMessage.userId = message.UserId;
      oneMessage.userName = message.User.userName;
      oneMessage.createdAt = message.createdAt;
      oneMessage.message = message.message;
      oneMessage.messageUrl = message.messageUrl;
      res.status(200).json(oneMessage);
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.findAllMessagesForOne = (req, res, next) => {
  let list = "";
  Message.findAll({
    where: { UserId: req.params.id },
  })
    .then((res) => {
      list = res;
      res.status(200).json({ list });
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.deleteMessage = (req, res, next) => {
  console.log(" message Id is: " + req.query.messageId);
  console.log(" message User Id is : " + req.query.messageUid);
  console.log(" User Id who ask the deletion is : " + req.query.uid);
  const obj = JSON.parse(JSON.stringify(req.body));
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TKN_SECRET);
  const userId = decodedToken.userId;
  User.findOne({
    where: { id: userId },
  })
    .then((user) => {
      Message.findOne({
        where: {
          id: req.query.messageId,
        },
      })
        .then((comment) => {
          if (user && (user.isAdmin || user.id == comment.userId)) {
            if (req.query.messageUid == req.query.uid || user.isAdmin) {
              Comment.destroy({ where: { MessageId: req.query.messageId } });
              Message.destroy({ where: { id: req.query.messageId } })
                .then((res) => {
                  res.status(200).json({
                    message: "Message and its comments have been destroyed",
                  });
                })
                .catch((error) => res.status(400).json({ error }));
            } else {
              return res.status(401).json({ message: "Unauthorized " });
            }
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
