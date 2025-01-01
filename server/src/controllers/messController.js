const messService = require("../services/messService");

export const getMessController = async (req, res) => {
  try {
    const senderId = req.idUser;
    const { receiverId } = req.query;
    const body = {
      senderId,
      receiverId: parseInt(receiverId),
    };

    const response = await messService.getMess(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};
