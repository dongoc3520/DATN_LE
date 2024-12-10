const express = require("express");
const { body } = require("express-validator");

const userRouter = express.Router();
const userCotroller = require("../controllers/userController");
const { middlewareLogin } = require("../middware/middwareLogin");

//api register ( đăng kí ) người dùng
userRouter.post( "/register",
  userCotroller.userRegisterController
);

//api login ( đăng nhập )
userRouter.post("/login", userCotroller.userLoginController);

//api log out ()
userRouter.get("/logout", middlewareLogin, userCotroller.userLogoutController);

//api đổi mật khẩu
userRouter.post(
  "/changePassword",
  middlewareLogin,
  userCotroller.userchangePasswordController
);

//api lấy người dùng bởi jwt để hiện thị ra trang cá nhân
userRouter.get(
  "/profilebyjwt",
  middlewareLogin,
  userCotroller.userJwtController
);

//api lấy người dùng theo id
userRouter.get("/profile/:id", userCotroller.userIdController);

// api sửa đổi người dùng
userRouter.post("/update", middlewareLogin, userCotroller.userUpdateController);

// api đổi avatar
userRouter.post("/avatar", middlewareLogin, userCotroller.userAvatarController);

// lấy người dùng và tin nhắn sớm nhất của người dùng dành cho mình
userRouter.get(
  "/userandmess",
  middlewareLogin,
  userCotroller.getUserandMessages
);

// api tìm kiếm người dùng
userRouter.post("/search", middlewareLogin, userCotroller.searchUser);

module.exports = userRouter;
