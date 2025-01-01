const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { Friendships, Users, Messages } = require("../models");

export const createFriendShip = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const check = await Friendships.findOne({
        where: {
          senderId: body.senderId || body.receiverId,
          receiverId: body.receiverId || body.senderId,
        },
      });

      if (check) {
        reslove({
          errCode: 1,
          message: "Đã có lời mời",
        });
      } else {
        const friendShip = await Friendships.create({
          senderId: body.senderId,
          receiverId: body.receiverId,
          status: "accepted",
        });
        reslove({
          errCode: 0,
          message: "Gửi lời mời thành công",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

// const { Op } = require("sequelize"); // Sử dụng Op để hỗ trợ truy vấn
// const { Friendships, Users, Messages } = require("./models"); // Đảm bảo import các models

export const getFriends = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả bạn bè có trạng thái "accepted"
      const friends = await Friendships.findAll({
        where: {
          status: "accepted",
          [Op.or]: [{ receiverId: id }, { senderId: id }],
        },
        raw: true,
      });

      // Lấy các ID của bạn bè
      const friendIds = friends.map((friend) =>
        friend.senderId === id ? friend.receiverId : friend.senderId
      );

      // Lấy thông tin người dùng theo ID
      const friendsById = await Users.findAll({
        where: {
          id: friendIds,
        },
        raw: true,
      });

      // Lấy tin nhắn gần nhất giữa người dùng và bạn bè
      const friendsWithMessages = await Promise.all(
        friendsById.map(async (friend) => {
          const lastMessage = await Messages.findOne({
            where: {
              [Op.or]: [
                { senderId: id, receiverId: friend.id },
                { senderId: friend.id, receiverId: id },
              ],
            },
            order: [["createdAt", "DESC"]],
            limit: 1,
            raw: true,
          });

          // Lọc và trả về chỉ các trường cần thiết
          return {
            id: friend.id,
            avatar: friend.avatar,
            name: friend.name,
            content: lastMessage ? lastMessage.content : "Gửi lời chào",
          };
        })
      );

      // Trả về danh sách bạn bè kèm theo tin nhắn gần nhất với chỉ các trường cần thiết
      resolve({
        errCode: 0,
        friendsWithMessages,
      });
    } catch (error) {
      reject(error);
    }
  });
};
