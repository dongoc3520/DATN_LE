var jwt = require("jsonwebtoken");

export const middlewareLogin = (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie

  if (!token) {
    return res.status(401).json({
      message: "You are not logged in", // Thông báo khi không tìm thấy token
    });
  }

  try {
    const user = jwt.verify(token, "MYKEY"); // Xác thực token
    if (!user) {
      return res.status(400).json({
        errCode: 1,
        message: "Không tìm thấy người dùng", // Thông báo khi token không hợp lệ
      });
    }

    // Nếu token hợp lệ, lưu thông tin vào req và tiếp tục
    const idUser = user.user.id;
    req.idUser = idUser;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Xử lý lỗi khi token hết hạn
      console.log("het han");
      return res.status(401).json({
        errCode: 5,
        message: "Token đã hết hạn, vui lòng đăng nhập lại",
      });
    } else {
      // Xử lý lỗi khác liên quan đến token
      return res.status(403).json({
        errCode: 3,
        message: "Token không hợp lệ",
      });
    }
  }
};
