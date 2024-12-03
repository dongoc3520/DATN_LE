var jwt = require("jsonwebtoken");
export const middlewareLogin = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.json({
      message: "You are not logged in",
    });
    }
  if (token) {
    const user = jwt.verify(token, "MYKEY");
    if (!user) {
      return res.state(400).json({
        errCode: 1,
        message: "Không tìm thấy người dùng",
      });
    } else {
      const idUser = user.user.id;
      req.idUser = idUser;
      next();
    }
  }
};
