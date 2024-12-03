const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { Users, sequelize } = require("../models");
var jwt = require("jsonwebtoken");

export const userRegisterService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const checkUser = await Users.findOne({
        where: {
          userName: body.userName,
        },
      });
      if (checkUser) {
        reslove({
          errCode: 1,
          message: "Tài khoản đã tồn tại",
        });
      } else {
        const hash = bcrypt.hashSync(body.pass, 12);
        const user = await Users.create({
          userName: body.userName,
          pass: hash,
          name: body.name,
          role: body.role,
          work: body.work,
          age: body.age,
        });
        reslove({
          errCode: 0,
          message: "Tạo tài khoản thành công",
        });
      }
    } catch (error) {
      reject(error);
    }
  });

//logins
export const userLoginService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const user = await Users.findOne({
        where: { userName: body.userName },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 1,
          message: "Tài khoản không tồn tại",
        });
      } else {
        const checkPassword = bcrypt.compareSync(body.pass, user.pass);
        if (!checkPassword) {
          reslove({
            errCode: 1,
            message: "Mật khẩu không đúng",
          });
        } else {
          //delete user.pass;
          // const userUpdated = await Users.update(
          //   { isactive: true },
          //   { where: { id: user.id } }
          // );

          const token = jwt.sign({ user: user }, "MYKEY", { expiresIn: "24h" });
          // await new Promise((resolve, reject) => {
          //   res
          //     .cookie("token", token, {
          //       maxAge: 86400000, // thời gian sống của cookie, ở đây là 1 ngày
          //       httpOnly: true, // chỉ được truy cập bằng HTTP, không được truy cập bằng JavaScript
          //       secure: true, // chỉ được gửi qua kênh HTTPS
          //       sameSite: "none", // cho phép gửi cookie qua các domain khác
          //       domain: "localhost", // domain của server
          //       path: "/", // path của server
          //     })
          //     .on("end", resolve)
          //     .on("error", reject);
          // });
          reslove({
            errCode: 0,
            message: "Đăng nhập thành công",
            token: token,
            idUser: user.id,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const userLogoutService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const user = await Users.findOne({
        where: { id: parseInt(body.idUser) },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 1,
          isLogout: false,
          message: "Tài khoản không tồn tại",
        });
      } else {
        const userUpdated = await Users.update(
          { isactive: false },
          { where: { id: user.id } }
        );
        reslove({
          errCode: 0,
          message: "Đăng xuất thành công",
          isLogout: true,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
export const userchangePassservice = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      if (!body.currentPass || !body.newPass) {
        reslove({
          errCode: 1,
          message: "Cần điền đủ thông tin",
        });
      }
      const user = await Users.findOne({
        where: { id: parseInt(body.idUser) },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 1,
          isLogout: false,
          message: "Tài khoản không tồn tại",
        });
      } else {
        const checkPassword = bcrypt.compareSync(
          body.currentPass,
          user.password
        );
        if (!checkPassword) {
          reslove({
            errCode: 1,
            message: "Mật khẩu không đúng",
          });
        } else {
          const hash = bcrypt.hashSync(body.newPass, 12);
          const userUpdated = await Users.update(
            { password: hash },
            { where: { id: user.id } }
          );
          reslove({
            errCode: 0,
            message: "Đổi mật khẩu thành công",
            reLogin: true,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const userGetprofileService = (id) =>
  new Promise(async (reslove, reject) => {
    try {
      const user = await Users.findOne({
        where: { id: id },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 1,
          message: "Tài khoản không tồn tại",
        });
      }
      delete user.password;
      reslove({
        errCode: 0,
        message: "Thông tin tài khoản thành công",
        user: user,
      });
    } catch (error) {
      reject(error);
    }
  });

//update user
export const userUpdateService = (body) =>
  new Promise(async (reslove, reject) => {
    // const decode = jwt.verify(body.token, "MYKEY");
    const idUser = body.idUser;
    try {
      const user = await Users.findOne({
        where: {
          id: idUser,
        },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 404,
          message: "User not found",
        });
      }

      await Users.update(
        {
          name: body.name,
          avatar: body.avatar,
          username: body.username,
        },
        { where: { id: idUser } }
      );

      reslove({
        errCode: 0,
        message: "Update Thành Công",
      });
    } catch (error) {
      reject(error);
    }
  });

export const userGetMessService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      function uniqueArray(orinalArray) {
        return orinalArray.filter((elem, position, arr) => {
          return arr.indexOf(elem) == position;
        });
      }
      let result = [];
      // Lấy ra danh sách bạn bè của người dùng
      const friendIds = await Friendships.findAll({
        attributes: ["status", "senderId", "receiverId"],
        where: {
          status: "accepted",
          [Op.or]: [{ senderId: body.userid }, { receiverId: body.userid }],
        },
      });

      // Chuyển đổi danh sách bạn bè thành một mảng các friendId
      const friendIdArray = friendIds.map((friendship) => {
        if (friendship.senderId === body.userid) {
          return friendship.receiverId;
        }

        if (friendship.receiverId === body.userid) {
          return friendship.senderId;
        }
      });

      const newarray = uniqueArray(friendIdArray);

      // Lấy ra danh sách các tin nhắn đã gửi hoặc nhận từ bạn bè

      for (let i = 0; i < newarray.length; i++) {
        const messages = await Messages.findAll({
          attributes: ["content", "senderId", "receiverId", "createdAt"],
          where: {
            [Op.or]: [
              { senderId: body.userid, receiverId: newarray[i] },
              { senderId: newarray[i], receiverId: body.userid },
            ],
          },
          include: [
            {
              model: Users,
              as: "userreceiver",
              attributes: ["id", "avatar", "username", "name"],
            },
            {
              model: Users,
              as: "usersender",
              attributes: ["id", "avatar", "username", "name"],
            },
          ],
          order: [["createdAt", "ASC"]],
        });
        result.push(messages[messages.length - 1]);
      }
      // // Lấy ra tin nhắn gần nhất giữa bạn và người bạn của mình

      reslove({
        errCode: 0,
        result,
      });
    } catch (error) {
      reject(error);
    }
  });

export const searchUser = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const users = await Users.findAll({
        where: {
          name: { [Op.like]: `%${body.search}%` },
          id: {
            [Op.ne]: body.idUser,
          },
        },
        limit: 4,
      });
      users.forEach((element) => {
        element.password = null;
      });
      reslove({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
