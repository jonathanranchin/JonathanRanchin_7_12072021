const db = require("../models");
const User = db.users;
const Message = db.messages;
const Comment = db.comments;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

exports.findOneUser = (req, res, next) => {
  const userData = {};
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      userData.id = user.id;
      userData.userName = user.userName;
      userData.email = user.email;
      userData.createdAt = user.createdAt;
      userData.isAdmin = user.isAdmin;
    })
    .then(() => {
      Message.count({ where: { userId: req.params.id } }).then((total) => {
        userData.totalMessages = total;
      });
    })
    .then(() => {
      Comment.count({ where: { userId: req.params.id } }).then((total) => {
        userData.totalComments = total;
        res.status(200).json(userData);
      });
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.findAllUsers = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TKN_SECRET);
  const userId = decodedToken.userId;
  if (userId == 1) {
    User.findAll({
      where: { id: { [Op.gt]: 0 } },
    })
      .then((found) => {
        res.status(200).json({ found });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    console.log("You are trying to access content reserved for the admin");
    return res.status(401).json({ message: " unauthorized " });
  }
};

exports.deleteOneUser = (req, res, next) => {
  console.log(" user Id is: " + req.query.uid);
  console.log(" User Id who ask the deletion is sAdmin : " + req.query.isAdmin);

  console.log(req.query.isAdmin);
  if (req.query.isAdmin) {
    User.destroy({ where: { id: req.query.uid } });
    Message.destroy({ where: { UserId: req.query.uid } });
    Comment.destroy({ where: { UserId: req.query.uid } })
      .then((res) => {
        res.status(200).json({
          message: "User, its Messages and its comments have been destroyed",
        });
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    return res.status(401).json({ message: " unauthorized " });
  }
};

exports.deleteMyAccount = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TKN_SECRET);
  const userId = decodedToken.userId;
  console.log(userId + "  " + req.params.id);
  if (Number(req.params.id) === Number(userId)) {
    Comment.destroy({ where: { UserId: req.params.id } });
    Message.destroy({ where: { UserId: req.params.id } });
    User.destroy({ where: { id: req.params.id } })
      .then(() => res.status(200).json({ message: "ok" }))
      .catch((error) => console.log(error));
  } else {
    console.log("You are trying to delete an acount which is not yours");
    return res.status(403).json({ error });
  }
};
