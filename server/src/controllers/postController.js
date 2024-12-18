const postService = require("../services/postService");

export const createPostController = async (req, res) => {
  const {
    title,
    district,
    ward,
    price,
    area,
    images,
    vrImage,
    address,
    selectedTags,
    type,
    gender,
  } = req.body;
  const body = {
    id: req.idUser,
    title: title,
    address: address,
    district: district,
    ward: ward,
    price: price,
    area: area,
    images: images,
    vrImage: vrImage,
    selectedTags: selectedTags,
    type: type,
    gender: gender,
  };
  // console.log("body",body);
  try {
    const response = await postService.createPostService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const getPostbyidpostController = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await postService.getPostsByidpostService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const getPostbyidController = async (req, res) => {
  const id = req.idUser;
  const idPost = req.params.id;
  const bodyId = {
    idUser: id,
    idPost: idPost,
  };
  try {
    const response = await postService.getPostsByIdService(bodyId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const updatePostbyidController = async (req, res) => {
  const id = req.idUser;
  const idPost = req.params.id;
  const postText = req.body.postText;
  const postImage = req.body.postImage;

  const body = {
    idUser: id,
    idPost: idPost,
    postImage,
    postText,
  };
  try {
    const response = await postService.updatePostsByIdService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};
export const getimages = async (req, res) => {
  let id = 0;
  let idParam = parseInt(req.params.id);
  let idsub = parseInt(req.query.idsub);
  if (idsub === 0) {
    id = req.idUser;
  } else {
    id = idsub;
  }

  try {
    const response = await postService.getImagesService(id, idParam);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const deletePostController = async (req, res) => {
  const id = req.idUser;
  const idPost = req.params.id;
  const body = {
    idUser: id,
    idPost: idPost,
  };
  // console.log("this is body", body);
  try {
    const response = await postService.deletePostService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};
