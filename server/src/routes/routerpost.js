const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postController");
const { middlewareLogin } = require("../middware/middwareLogin");
const { Posts, Users, Images } = require("../models");

// api lấy tất cả bài viết của khách ( người mình xem )
postRouter.get("/posts/getbyuserid", async (req, res) => {
    // console.log(req.query);
  const { page, limit, id } = req.query;
  const iduser = parseInt(id);
  const options = {
    page: parseInt(page, 10) || 1,
    paginate: parseInt(limit, 10) || 3,
    order: [["createdAt", "DESC"]],
    where: {
      UserId: iduser,
    },
    include: {
      model: Users,
      as: "user",
      attributes: ["id", "avatar", "username", "name"],
    },
  };

//   const { docs, pages, total } = await Posts.paginate(options);
  
  try {
    const { docs, pages, total } = await Posts.paginate(options);

    // Tìm một ảnh bất kỳ cho từng bài viết
    const postsWithImage = await Promise.all(
      docs.map(async (post) => {
        const image = await Images.findOne({
          where: { PostId: post.id }, // Điều kiện lấy ảnh
          attributes: ["url"], // Lấy cột "url" (hoặc các cột cần thiết)
        });

        return {
          ...post.toJSON(), // Chuyển bài viết sang JSON
          image: image ? image.url : null, // Gắn ảnh vào bài viết
        };
      })
    );

    res.json({
      posts: postsWithImage,
      currentPage: options.page,
      totalPages: pages,
      totalPosts: total,
    });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// //api lấy tất cả bài viết của tất cả mọi người load ra trang chủ
// postRouter.get("/posts/home", async (req, res) => {
//   const { page, limit } = req.query;
//   const options = {
//     page: parseInt(page, 10) || 1,
//     paginate: parseInt(limit, 10) || 3,
//     order: [["createdAt", "DESC"]],
//     where: {},
//     include: {
//       model: Users,
//       as: "user",
//       attributes: ["id", "avatar", "username", "name"],
//     },
//   };

//   const { docs, pages, total } = await Posts.paginate(options);

//   res.json({
//     posts: docs,
//     currentPage: options.page,
//     totalPages: pages,
//     totalPosts: total,
//   });
// });
// //api lấy ra bài viết dựa vào id bài viết
postRouter.get("/getbyidpost/:id", postController.getPostbyidpostController);

// //api lấy tất cả bài viết của người dùng
// postRouter.get("/posts", middlewareLogin, async (req, res) => {
//   const { page, limit } = req.query;
//   const iduser = req.idUser;
//   const options = {
//     page: parseInt(page, 10) || 1,
//     paginate: parseInt(limit, 10) || 3,
//     order: [["createdAt", "DESC"]],
//     where: {
//       UserId: iduser,
//     },
//     include: {
//       model: Users,
//       as: "user",
//       attributes: ["id", "avatar", "username", "name"],
//     },
//   };

//   const { docs, pages, total } = await Posts.paginate(options);

//   res.json({
//     errCode: 0,
//     posts: docs,
//     currentPage: options.page,
//     totalPages: pages,
//     totalPosts: total,
//   });
// });

// // api lấy các hình ảnh của trang các nhân
// postRouter.get("/getimages/:id", middlewareLogin, postController.getimages);

// postRouter.get("/:id", middlewareLogin, postController.getPostbyidController);

// //api sửa đổi update bài viết
// postRouter.post(
//   "/:id",
//   middlewareLogin,
//   postController.updatePostbyidController
// );
// //api xóa bài viết
// postRouter.post(
//   "/delete/:id",
//   middlewareLogin,
//   postController.deletePostController
// );

//api tạo bài viết mới
postRouter.post("/", middlewareLogin, postController.createPostController);

//api lấy profile 
// postRouter.post("/", middlewareLogin, postController.createPostController);

module.exports = postRouter;
