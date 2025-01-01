const express = require("express");
const friendRouter = express.Router();
const { middlewareLogin } = require("../middware/middwareLogin");
const friendController = require("../controllers/friendController");

//api nhắn tin mở đầu (bắt tay)
friendRouter.post(
  "/send",
  middlewareLogin,
  friendController.createFriendRelation
);

//api lấy ra những người có thể nói chuyện
friendRouter.get("/friends", middlewareLogin, friendController.FriendRelation);

module.exports = friendRouter;
