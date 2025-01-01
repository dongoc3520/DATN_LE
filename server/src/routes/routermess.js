const express = require("express");
const messRouter = express.Router();
const messController = require("../controllers/messController");
const { middlewareLogin } = require("../middware/middwareLogin");
const { Messages, Users } = require("../models");
const { io } = require("../../server");
const jwt = require("jsonwebtoken");

//mess realtime ( 2 người ) chưa nâng cấp lên nhắn theo phòng nhiều người
io.on("connection", (socket) => {
  // const token = socket.handshake.headers.cookie.slice(6);
  // const decode = jwt.verify(token, "MYKEY");
  // const UserId = 1;
  socket.on("joinRoom", (data) => {
    const UserId = data.idUser;
    const IdReceiver = parseInt(data.receiverId);
    const roomName = `message:${Math.min(UserId, IdReceiver)}-${Math.max(
      UserId,
      IdReceiver
    )}`;

    console.log("this is name room", roomName);

    socket.join(roomName); // Tham gia vào phòng tương ứng
  });

  socket.on("newMess", async (data) => {
    const UserId = data.idUser;
    const IdReceiver = parseInt(data.receiverId);
    const roomName = `message:${Math.min(UserId, IdReceiver)}-${Math.max(
      UserId,
      IdReceiver
    )}`;


    console.log("ngoc ne", data);
    try {
      const newMess = await Messages.create({
        senderId: UserId,
        receiverId: IdReceiver,
        content: data.content,
      });
      io.to(roomName).emit("newMess", newMess);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    // console.log(`Client disconnected: ${socket.id}`);
  });
});

//api lấy tin nhắn của phòng
messRouter.get("/get", middlewareLogin, messController.getMessController);

module.exports = messRouter;
