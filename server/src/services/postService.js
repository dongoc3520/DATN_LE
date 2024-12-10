var jwt = require("jsonwebtoken");

const { Posts, Users, Images, Interests } = require("../models");

// const body = {
//   id: req.idUser,
//   title: title,
//   address: address,
//   price: price,
//   area: area,
//   images: images,
//   vrImage: vrImage,
//   selectedTags: selectedTags,
//   type: type,
// };

export const createPostService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const newpost = await Posts.create({
        UserId: body.id,
        Title: body.title,
        Address: body.address,
        Price: body.price,
        Area: body.area,
      });
      // const post = await Posts.findOne({
      //   where: { id: newpost.id, UserId: newpost.UserId },
      //   include: {
      //     model: Users,
      //     as: "user",
      //   },
      // });
      const idPost = newpost.id;
      console.log("len:",body.images.length);
      for (let index = 0; index < body.images.length; index++) {
        console.log(body.images[index]);
        const a = await Images.create({
          PostId: idPost,
          url: body.images[index],
          type: "1",
        });
       
      }
      if(body.type === "3"){
       
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
            attributes: ["id", "username", "avatar", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      reslove({
        errCode: 0,
        data: posts,
      });
    } catch (error) {
      reject(error);
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
