const friendService = require("../services/friendService");

export const createFriendRelation = async (req, res) => {
  try {
    const senderId = req.idUser;
    const { receiverId } = req.body;
    const body = {
      senderId: senderId,
      receiverId: receiverId,
    };
    const response = await friendService.createFriendShip(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const FriendRelation = async (req, res) => {
  try {
    const id = req.idUser;
    const response = await friendService.getFriends(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

