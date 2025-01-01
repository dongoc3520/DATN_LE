import { body } from "express-validator";
const { Op } = require("sequelize");
const { Messages, Users } = require("../models");

export const getMess = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const messages = await Messages.findAll({
        // senderId: body.senderId || body.receiverId,
        // receiverId: body.senderId || body.receiverId,

        where: {
          [Op.or]: [
            { senderId: body.senderId, receiverId: body.receiverId },
            { senderId: body.receiverId, receiverId: body.senderId },
          ],
        },
        include: [
          {
            model: Users,
            as: "usersender",
            attributes: ["id", "avatar", "username", "name"],
          },
          {
            model: Users,
            as: "userreceiver",
            attributes: ["id", "avatar", "username", "name"],
          },
        ],
      });
      
      reslove({
        errCode: 0,
        data: messages,
      });
    } catch (error) {
      reject(error);
    }
  });
