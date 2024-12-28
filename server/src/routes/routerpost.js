const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postController");
const { middlewareLogin } = require("../middware/middwareLogin");
const { Posts, Users, Images } = require("../models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

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
// api lấy ra bài viết dựa vào id bài viết
postRouter.get("/getbyidpost/:id", postController.getPostbyidpostController);

//api lấy ra bài viết của mọi người theo cách bình thường, ứng với căn hộ và chung cư mini
// postRouter.get("/posts/home", async (req, res) => {
//   const { page, limit, id } = req.query;

//   // Map id to Type
//   const typeMap = {
//     1: "canho",
//     2: "chungcu",
//     3: "oghep",
//   };

//   const options = {
//     page: parseInt(page, 10) || 1, // Trang hiện tại
//     paginate: parseInt(limit, 10) || 5, // Số bài viết mỗi trang
//     order: [["createdAt", "DESC"]], // Sắp xếp giảm dần theo createdAt
//     where: {},
//     include: {
//       model: Users,
//       as: "user",
//       attributes: ["id", "avatar", "username", "name"], // Lấy thông tin người dùng
//     },
//   };

//   // Thêm điều kiện lọc Type dựa vào id
//   if (id && typeMap[id]) {
//     options.where.Type = typeMap[id];
//   }

//   try {
//     const { docs, pages, total } = await Posts.paginate(options);
//     const postsWithImage = await Promise.all(
//       docs.map(async (post) => {
//         const image = await Images.findOne({
//           where: { PostId: post.id }, // Điều kiện lấy ảnh
//           attributes: ["url"], // Lấy cột "url" (hoặc các cột cần thiết)
//         });

//         return {
//           ...post.toJSON(), // Chuyển bài viết sang JSON
//           image: image ? image.url : null, // Gắn ảnh vào bài viết
//         };
//       })
//     );
//     res.json({
//       posts: postsWithImage,
//       currentPage: options.page,
//       totalPages: pages,
//       totalPosts: total,
//     });
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
postRouter.get("/posts/home", async (req, res) => {
  const {
    page,
    limit,
    id,
    district,
    ward,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
  } = req.query;
  // console.log(req.query);
  // console.log(limit);
  // console.log(id);
  // console.log(district);
  // console.log(ward);

  // Map id to Type
  const typeMap = {
    1: "canho",
    2: "chungcu",
    3: "oghep",
  };

  const options = {
    page: parseInt(page, 10) || 1, // Trang hiện tại
    paginate: parseInt(limit, 10) || 5, // Số bài viết mỗi trang
    order: [["createdAt", "DESC"]], // Sắp xếp giảm dần theo createdAt
    where: {}, // Điều kiện lọc bài viết
    include: {
      model: Users,
      as: "user",
      attributes: ["id", "avatar", "username", "name"], // Lấy thông tin người dùng
    },
  };

  // Lọc theo loại bài viết dựa vào id
  if (id && typeMap[id]) {
    options.where.Type = typeMap[id];
  }

  // Lọc theo địa chỉ huyện (district) nếu tồn tại
  if (district) {
    options.where.District = district;
  }

  // Lọc theo địa chỉ xã (ward) nếu tồn tại
  if (ward) {
    options.where.Ward = ward;
  }

  // Lọc theo khoảng giá (minPrice và maxPrice) nếu ít nhất một tồn tại
  if (minPrice || maxPrice) {
    options.where.Price = {
      [Op.and]: [
        minPrice ? { [Op.gte]: parseInt(minPrice) } : {},
        maxPrice ? { [Op.lte]: parseInt(maxPrice) } : {},
      ],
    };
  }

  if (minArea || maxArea) {
    options.where.Area = {
      [Op.and]: [
        minArea ? { [Op.gte]: parseInt(minArea) } : {},
        maxArea ? { [Op.lte]: parseInt(maxArea) } : {},
      ],
    };
  }

  try {
    // Lấy bài viết từ cơ sở dữ liệu
    const { docs, pages, total } = await Posts.paginate(options);
    // console.log("doc is", docs);
    // Gắn thêm ảnh vào bài viết
    const postsWithImage = await Promise.all(
      docs.map(async (post) => {
        const image = await Images.findOne({
          where: { PostId: post.id },
          attributes: ["url"],
        });

        return {
          ...post.toJSON(),
          image: image ? image.url : null,
        };
      })
    );

    // Trả dữ liệu về client
    res.json({
      posts: postsWithImage,
      currentPage: options.page,
      totalPages: pages,
      totalPosts: total,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//api tạo bài viết mới
postRouter.post("/", middlewareLogin, postController.createPostController);

//api xóa bài viết
postRouter.post(
  "/delete/:id",
  middlewareLogin,
  postController.deletePostController
);

//api update bài viết
postRouter.post("/update/:id", postController.updatePostbyId);

//api update ảnh VR bài viết
postRouter.post("/update/img/:id", postController.updatePostimgbyId);
//updatePostbyId
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

//api tạo bài viết mới
// postRouter.post("/", middlewareLogin, postController.createPostController);

//api lấy profile
// postRouter.post("/", middlewareLogin, postController.createPostController);

module.exports = postRouter;
