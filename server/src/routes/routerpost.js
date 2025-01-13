const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postController");
const { middlewareLogin } = require("../middware/middwareLogin");
const { Posts, Users, Images, Criterias, Interests } = require("../models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { raw } = require("body-parser");

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
postRouter.get("/posts/home", middlewareLogin, async (req, res) => {
  const idUser = req.idUser;
  //console.log(idUser);
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

  const typeMap = {
    1: "canho",
    2: "chungcu",
    3: "oghep", // Kiểu "oghep"
  };

  const user = await Users.findOne({
    where: { id: idUser },
    raw: true,
  });

  // Lấy sở thích của người thuê
  let interests = [];
  if (user.role === "1") {
    interests = await Criterias.findAll({
      where: { UserId: user.id },
      attributes: ["name"],
      raw: true,
    });
  }

  const options = {
    page: parseInt(page, 10) || 1, // Trang hiện tại
    paginate: parseInt(limit, 10) || 6, // Số bài viết mỗi trang
    order: [["createdAt", "DESC"]], // Sắp xếp giảm dần theo createdAt
    where: {}, // Điều kiện lọc bài viết
    include: {
      model: Users,
      as: "user",
      attributes: ["id", "avatar", "username", "name", "gender"], // Lấy thông tin người dùng và giới tính
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

  // Lọc theo diện tích
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

    // Lọc và sắp xếp bài viết
    const postsWithImage = await Promise.all(
      docs.map(async (post) => {
        // Lấy ảnh cho bài viết
        const image = await Images.findOne({
          where: { PostId: post.id },
          attributes: ["url"],
        });

        // Kiểm tra sự phù hợp với giới tính và sở thích
        let genderMatch = 0; // 0 = không trùng, 1 = trùng giới tính
        let interestMatchCount = 0; // Đếm số sở thích trùng

        // Kiểm tra nếu bài viết có loại "oghep" và người thuê có sở thích phù hợp
        if (post.Type === "oghep" && user.role === "1") {
          const postGender = post.Gender; // Giới tính bài viết
          const userGender = user.gender; // Giới tính người thuê
          // console.log("lll");
          // console.log(postGender);
          // console.log(userGender);
          // Kiểm tra nếu giới tính bài viết và người thuê trùng nhau
          if (postGender === userGender) {
            genderMatch = 1; // Trùng giới tính
          }

          // Lấy sở thích của bài viết từ bảng Interests
          const postInterests = await Interests.findAll({
            where: { PostId: post.id },
            attributes: ["name"],
            raw: true,
          });

          // Kiểm tra sở thích của bài viết với sở thích của người thuê (so sánh với 3 sở thích)
          const userInterestNames = interests.map((i) => i.name);
          const matchedInterests = postInterests.filter((postInterest) =>
            userInterestNames.includes(postInterest.name)
          );

          // Đếm số sở thích trùng
          interestMatchCount = matchedInterests.length;
        }

        // Trả lại bài viết đã có các chỉ số phù hợp
        return {
          post: {
            ...post.toJSON(),
            image: image ? image.url : null,
            genderMatch,
            interestMatchCount,
          },
        };
      })
    );
    const sortedPosts = postsWithImage
      .filter((post) => post) // Lọc các bài viết không phải null
      .sort((a, b) => {
        // 1. So sánh giới tính (ưu tiên trùng giới tính)
        if (b.post.genderMatch !== a.post.genderMatch) {
          return b.post.genderMatch - a.post.genderMatch;
        }

        // 2. So sánh độ tuổi (gần độ tuổi người dùng hơn sẽ ưu tiên hơn)
        const ageDifferenceA = Math.abs(user.age - a.post.Age || Infinity);
        const ageDifferenceB = Math.abs(user.age - b.post.Age || Infinity);
        if (ageDifferenceA !== ageDifferenceB) {
          return ageDifferenceA - ageDifferenceB; // Tuổi gần hơn sẽ được ưu tiên
        }

        // 3. So sánh công việc (ưu tiên nếu công việc giống nhau)
        if (a.post.Work && b.post.Work && a.post.Work !== b.post.Work) {
          return a.post.Work === user.work ? -1 : 1; // Ưu tiên công việc trùng với người dùng
        }

        // 4. So sánh số sở thích trùng
        return b.post.interestMatchCount - a.post.interestMatchCount;
      })
      .map((post) => post.post); // Trả về phần tử bài viết đã sắp xếp

    res.json({
      posts: sortedPosts,
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
