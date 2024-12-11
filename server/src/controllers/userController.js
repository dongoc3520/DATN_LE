const userService = require("../services/userSevices");
const { validationResult } = require("express-validator");
//---------------------------------------------------------------
export const userRegisterController = async (req, res) => {
  const { name, userName, pass, age, rePass, role, work } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!name || !userName || !pass || !age || !rePass || !role || !work) {
      return res.status(400).json({
        errCode: 1,
        message: "Cần điền đủ thông tin",
      });
    }

    const response = await userService.userRegisterService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

//---------------------------------------------------------------
export const userLoginController = async (req, res) => {
  const { userName, pass } = req.body;
  try {
    if (!userName || !pass) {
      return res.status(400).json({
        errCode: 1,
        message: "Cần điền đủ thông tin",
      });
    }
    const response = await userService.userLoginService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const userLogoutController = async (req, res) => {
  const idUser = req.idUser;
  const body = {
    idUser,
  };
  try {
    const response = await userService.userLogoutService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};
export const userchangePasswordController = async (req, res) => {
  const idUser = req.idUser;

  const { oldPass, newPass , renewPass } = req.body;
  const body = {
    newPass,
    oldPass,
    idUser,
  };
  try {
    const response = await userService.userchangePassservice(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

//userchangeUserNameController
export const userchangeUserNameController = async (req, res) => {
  const idUser = req.idUser;

  const { oldUsername, newUsername, renewUsername } = req.body;
  const body = {
    oldUsername,
    newUsername,
    idUser,
  };
  try {
    const response = await userService.userchangeUserNameservice(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const userJwtController = async (req, res) => {
  const id = req.idUser;
  try {
    const response = await userService.userGetprofileService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const userUpdateController = async (req, res) => {
  const { age, name } = req.body;
  // const token = req.cookies.token;
  const idUser = req.idUser;
  const body = {
    id: idUser,
    name: name,
    age: age,
  };

  try {
    if (!age || !name) {
      return res.status(400).json({
        errCode: 1,
        message: "Cần điền đủ thông tin",
      });
    }
    const response = await userService.userUpdateService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

// userAvatarController;

export const userAvatarController = async (req, res) => {
  const img = req.body.img;

  // const token = req.cookies.token;
  const idUser = req.idUser;

  const body = {
    avatar: img,
    idUser: idUser,
  };
  // console.log(body);
  try {
    if (!img) {
      return res.status(400).json({
        errCode: 1,
        message: "Cần điền đủ thông tin",
      });
    }
    const response = await userService.userAvatarService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};
export const userIdController = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await userService.userGetprofileService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const getUserandMessages = async (req, res) => {
  const body = {
    userid: parseInt(req.idUser),
  };

  try {
    const response = await userService.userGetMessService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const searchUser = async (req, res) => {
  const { search } = req.body;
  console.log("this is search user", search);
  const body = {
    search,
    idUser: req.idUser,
  };

  try {
    const response = await userService.searchUser(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};
