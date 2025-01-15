var jwt = require("jsonwebtoken");

const { Posts, Users, Images, Interests } = require("../models");

export const createPostService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const newpost = await Posts.create({
        UserId: body.id,
        Title: body.title,
        Address: body.address,
        Price: body.price,
        Area: body.area,
        District: body.district,
        Ward: body.ward,
        Type: body.type,
        Gender: body.gender,
        Age: body.age,
        Work: body.work,
      });

      const idPost = newpost.id;

      for (let index = 0; index < body.images.length; index++) {
        // console.log(body.images[index]);
        const a = await Images.create({
          PostId: idPost,
          url: body.images[index],
          type: "1",
        });
      }
      if (body.type === "oghep") {
        for (let index = 0; index < body.selectedTags.length; index++) {
          await Interests.create({
            PostId: idPost,
            name: body.selectedTags[index],
          });
        }
      }

      const b = await Images.create({
        PostId: idPost,
        url: body.vrImage,
        type: "2",
      });

      reslove({
        errCode: 0,
        message: "Tạo Bài Viết Thành Công",
      });
    } catch (error) {
      reject(error);
    }
  });
//getPostsByTypepostService
export const getPostsByTypepostService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      // Xác định Type dựa trên id
      const typeMap = {
        1: "canho",
        2: "chungcu",
        3: "oghep",
      };

      const type = typeMap[id];
      if (!type) {
        resolve({
          errCode: 1,
          errMessage: "Id không hợp lệ!",
        });
        return;
      }

      // Lấy danh sách bài viết theo Type
      const posts = await Posts.findAll({
        where: {
          Type: type,
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["id", "avatar", "name", "phone", "email"],
          },
        ],
        order: [["createdAt", "DESC"]], // Sắp xếp bài viết mới nhất
      });

      if (!posts || posts.length === 0) {
        resolve({
          errCode: 2,
          errMessage: "Không có bài viết nào!",
        });
        return;
      }

      // Lấy thông tin ảnh cho từng bài viết
      const enrichedPosts = await Promise.all(
        posts.map(async (post) => {
          const images = await Images.findAll({
            where: {
              PostId: post.id,
            },
            attributes: ["url", "type"],
          });

          const type2Image =
            images.find((image) => image.type === "2")?.url || null;
          const type1Images = images
            .filter((image) => image.type === "1")
            .map((image) => image.url);

          return {
            ...post.dataValues,
            type2Image,
            type1Images,
          };
        })
      );

      resolve({
        errCode: 0,
        data: enrichedPosts,
      });
    } catch (error) {
      reject({
        errCode: 500,
        errMessage: "Lỗi hệ thống!",
        error: error.message,
      });
    }
  });

export const getPostsByidpostService = (id) =>
  new Promise(async (reslove, reject) => {
    try {
      const posts = await Posts.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["id", "avatar", "name", "phone", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!posts) {
        reslove({
          errCode: 1,
          errMessage: "Bài viết không tồn tại!",
        });
        return;
      }
      let interests = [];
      // const interests;
      if (posts.Type === "oghep") {
        interests = await Interests.findAll({
          where: {
            PostId: id,
          },
          attributes: ["name"],
          raw: true,
        });
        // console.log(interests);
      }
      const images = await Images.findAll({
        where: {
          PostId: id, // Điều kiện lấy ảnh theo bài viết
        },
        attributes: ["url", "type"], // Chỉ lấy các trường cần thiết
      });

      // Tách ảnh theo type
      const type2Image =
        images.find((image) => image.type === "2")?.url || null; // Chỉ lấy URL của ảnh type = 2
      const type1Images = images
        .filter((image) => image.type === "1")
        .map((image) => image.url); // Chỉ lấy URL của các ảnh type = 1

      reslove({
        errCode: 0,
        data: {
          interests: interests || [],
          post: posts,
          type2Image: type2Image || null, // Trả về null nếu không có ảnh type = 2
          type1Images: type1Images, // Trả về mảng rỗng nếu không có ảnh type = 1
        },
      });
    } catch (error) {
      reject(error);
    }
  });

//updatePostService
export const updatePostService = (body, id) =>
  new Promise(async (resolve, reject) => {
    try {
      // Tìm bài viết cần cập nhật
      const post = await Posts.findOne({
        where: { id: id },
      });

      if (!post) {
        resolve({
          errCode: 1,
          errMessage: "Bài viết không tồn tại!",
        });
        return;
      }

      // Cập nhật thông tin bài viết
      await post.update({
        Title: body.title || post.title,
        Price: body.price || post.price,
        Address: body.address || post.address,
        Area: body.area || post.area,
        District: body.district || post.district,
        Ward: body.ward || post.ward,
      });

      resolve({
        errCode: 0,
        message: "Cập nhật bài viết thành công!",
      });
    } catch (error) {
      reject({
        errCode: -1,
        errMessage: "Lỗi hệ thống!",
        error: error.message,
      });
    }
  });

//updatePostimgService
export const updatePostimgService = (body, id) =>
  new Promise(async (resolve, reject) => {
    try {
      // Tìm bài viết cần cập nhật
      const image = await Images.findOne({
        where: { PostId: id, type: "2" },
      });

      if (!image) {
        resolve({
          errCode: 1,
          errMessage: "Hình ảnh không tồn tại!",
        });
        return;
      }

      // Cập nhật thông tin bài viết
      await image.update({
        url: body.url || image.url,
      });

      resolve({
        errCode: 0,
        message: "Update ảnh VR thành công!",
        url: image.url,
      });
    } catch (error) {
      reject({
        errCode: -1,
        errMessage: "Lỗi hệ thống!",
        error: error.message,
      });
    }
  });

export const getPostsByIdService = (bodyId) =>
  new Promise(async (reslove, reject) => {
    const post = await Posts.findOne({
      where: {
        id: parseInt(bodyId.idPost),
        UserId: bodyId.idUser,
      },
      raw: true,
    });
    if (!post) {
      reslove({
        errCode: 1,
        message: "Không tìm thấy bài post của bạn",
      });
    }

    reslove({
      errCode: 0,
      message: "success",
      data: post,
    });

    try {
      reslove({
        errCode: 0,
        message: "success",
        bodyId,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePostsByIdService = (body) =>
  new Promise(async (reslove, reject) => {
    const post = await Posts.findOne({
      where: {
        id: parseInt(body.idPost),
        UserId: body.idUser,
      },
      raw: true,
    });
    if (!post) {
      reslove({
        errCode: 1,
        message: "Không tìm thấy bài post bạn có quyền sửa",
      });
    }
    const postUpdate = await Posts.update(
      {
        postText: body.postText,
        postImage: body.postImage,
      },
      {
        where: {
          id: parseInt(body.idPost),
          UserId: body.idUser,
        },
      }
    );

    reslove({
      errCode: 0,
      message: "success",
    });

    try {
      reslove({
        errCode: 0,
        message: "success",
        bodyId,
      });
    } catch (error) {
      reject(error);
    }
  });

//deletePostServiceAD

export const deletePostServiceAD = (body) =>
  new Promise(async (reslove, reject) => {
    const post = await Posts.findOne({
      where: {
        id: parseInt(body.idPost),
      },
      raw: true,
    });
    if (!post) {
      reslove({
        errCode: 1,
        message: "Không tìm thấy bài post của bạn",
      });
    }
    const postDelete = await Posts.destroy({
      where: {
        id: parseInt(body.idPost),
      },
    });
    reslove({
      errCode: 0,
      message: "success",
      postDelete,
    });

    try {
      reslove({
        errCode: 0,
        message: "success",
      });
    } catch (error) {
      reject(error);
    }
  });
export const deletePostService = (body) =>
  new Promise(async (reslove, reject) => {
    const post = await Posts.findOne({
      where: {
        id: parseInt(body.idPost),
        UserId: body.idUser,
      },
      raw: true,
    });
    if (!post) {
      reslove({
        errCode: 1,
        message: "Không tìm thấy bài post của bạn",
      });
    }
    const postDelete = await Posts.destroy({
      where: {
        id: parseInt(body.idPost),
        UserId: body.idUser,
      },
    });
    reslove({
      errCode: 0,
      message: "success",
      postDelete,
    });

    try {
      reslove({
        errCode: 0,
        message: "success",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getImagesService = (id, idParam) =>
  new Promise(async (reslove, reject) => {
    try {
      const newid = parseInt(id);
      const images = [];
      const result = await Posts.findAll({
        where: { UserId: newid },
        limit: idParam,
      });
      result.forEach((element) => {
        if (element.postImage) {
          images.push(element.postImage);
        }
      });
      reslove({
        data: images,
      });
    } catch (error) {
      reject(error);
    }
  });
