import "./Post.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import "react-image-gallery/styles/css/image-gallery.css";
import axios from "axios";
import { url } from "../../url";
import { useNavigate } from "react-router-dom";

const PostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const im
  const [im, setIm] = useState([]);
  const [f5, setF5] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const maxVisibleImages = 6;
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [idU, setIdU] = useState(0);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({
    title: "",
    price: 0,
    address: "",
    area: 25,
    images: [""],
    user: {
      avatar: "",
      name: "",
      id: 0,
    },
    contact: { phone: "", email: "" },
  });
  const fetchPosts = async (page) => {
    console.log("ngoc day", post);
    try {
      console.log("ngoc day", post.user.id);
      const response = await axios.get(`${url}/post/posts/getbyuserid`, {
        params: {
          id: post.user.id,
          page: page,
          limit: 4,
        },
      });
      const { posts, totalPages } = response.data;
      // console.log("ngo ne", response.data);
      setFeaturedPosts(response.data.posts); // Cập nhật danh sách bài đăng
      console.log("us is", idU);
      console.log(featuredPosts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài đăng:", error);
    }
  };
  const fetchmPost = async () => {
    if (id) {
      await axios
        .get(`${url}/post/getbyidpost/${id}`)
        .then((res) => {
          console.log(res);
          setPost({
            ...post,
            title: res.data.data.post.Title,
            price: res.data.data.post.Price,
            area: res.data.data.post.Area,
            address: res.data.data.post.Address,
            images: [res.data.data.type2Image],
            user: { ...res.data.data.post.user },
          });
          setIm(res.data.data.type1Images);
          console.log("ngoicoi", res.data.data.post.user.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    fetchmPost();
    // setIdU(post.user.id);
    fetchPosts(1);
  }, [f5, post.user?.id]);
  // const visibleImages = im.slice(visibleStartIndex, Math.min(9999, im.length));
  const handleNext = () => {
    setVisibleStartIndex((prevIndex) => {
      if (im.length <= maxVisibleImages) {
        // return (prevIndex + 1) % im.length;
        return;
      } else {
        return (prevIndex + 1) % (im.length - maxVisibleImages + 1);
      }
    });
  };

  // Hàm quay lại ảnh trước
  const handlePrev = () => {
    setVisibleStartIndex((prevIndex) => {
      if (im.length <= maxVisibleImages) {
        // return (prevIndex - 1 + im.length) % im.length;
        return;
      } else {
        return (
          (prevIndex - 1 + im.length - maxVisibleImages + 1) %
          (im.length - maxVisibleImages + 1)
        );
      }
    });
  };
  useEffect(() => {
    setSelectedImage(im[currentImageIndex]);
  }, [currentImageIndex]);
  const openModal = (imageIndex) => {
    setIsModalOpen(true);
    setCurrentImageIndex(imageIndex);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const goToPrevious = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + im.length) % im.length
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % im.length);
  };
  const handleSwitch = () => {
    // console.log("hehelllll");
    navigate(`/profile/${post.user.id}`);
  };
  // const post = {
  //   title: "Phòng trọ tiện nghi trung tâm quận 1",
  //   price: 3000000,
  //   address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
  //   area: 25,
  //   images: ["https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg"],
  //   user: { name: "Nguyễn Văn A" },
  //   contact: { phone: "0901234567", email: "nva@gmail.com" },
  // };

  // const featuredPosts = [
  //   {
  //     title: "Phòng trọ cao cấp quận 7",
  //     price: 3500000,
  //     address: "456 Huỳnh Tấn Phát, Quận 7",
  //     image:
  //       "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain", // Thay bằng đường dẫn thực tế
  //   },
  //   {
  //     title: "Phòng trọ giá rẻ quận Gò Vấp",
  //     price: 2500000,
  //     address: "789 Lê Văn Thọ, Gò Vấp",
  //     image:
  //       "https://i.pinimg.com/736x/57/44/d5/5744d5dac67114a44ab42a07adf67dd6.jpg",
  //   },
  //   {
  //     title: "Phòng trọ cao cấp quận 7",
  //     price: 3500000,
  //     address: "456 Huỳnh Tấn Phát, Quận 7",
  //     image:
  //       "https://th.bing.com/th/id/OIP.WdtD6iS63Iji7EO6iMBKUgHaHa?rs=1&pid=ImgDetMain", // Thay bằng đường dẫn thực tế
  //   },
  //   {
  //     title: "Phòng trọ cao cấp quận 7",
  //     price: 3500000,
  //     address: "456 Huỳnh Tấn Phát, Quận 7",
  //     image:
  //       "https://th.bing.com/th/id/OIP._ptc2dSyNtdmlSr5PfpQgQHaHQ?w=750&h=735&rs=1&pid=ImgDetMain", // Thay bằng đường dẫn thực tế
  //   },
  // ];
  const { title, price, address, area, images, user, contact } = post;

  return (
    <div className="post-page-container">
      <div className="post-page">
        {/* Left Column */}
        <div className="post-left">
          {/* 360 Viewer */}
          <div className="post-360-view">
            <Canvas>
              <ambientLight intensity={1} />
              <OrbitControls enableZoom={false} />
              <Environment preset="city" />
              <mesh>
                <sphereGeometry args={[500, 60, 40]} />
                <meshBasicMaterial
                  map={new THREE.TextureLoader().load(images[0])}
                  side={THREE.BackSide}
                />
              </mesh>
            </Canvas>
          </div>
          <div
            className="post-image-slider"
            style={{ display: "flex", alignItems: "center" }}
          >
            <button
              onClick={handlePrev}
              style={{ position: "absolute", left: 0 }}
              className="btnLeft_slide"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div
              style={{
                position: "relative",
                width: `${maxVisibleImages * 110}px`,
              }}
              className="slider_im"
            >
              <div
                style={{
                  overflow: "hidden",
                  width: `${maxVisibleImages * 110}px`,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    transition: "transform 0.3s ease-in-out",
                    transform: `translateX(-${
                      (visibleStartIndex % im.length) * 110
                    }px)`,
                  }}
                >
                  {im.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index}`}
                      onClick={() => openModal(index)}
                      style={{
                        cursor: "pointer",
                        width: "100px",
                        height: "100px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        marginRight: "10px",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Nút tiến */}
            </div>
            <button
              onClick={handleNext}
              style={{ position: "absolute", right: 0 }}
              className="btnRight_slide"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Post Details */}
          <div className="post-details">
            <h1 className="post-title_">{title}</h1>
            <p className="post-price_">Giá: {price} VND</p>
            <p className="post-address">
              <i class="fa-solid fa-location-dot"></i> Địa chỉ: {address}
            </p>
            <p className="post-area">
              <i class="fa-solid fa-chart-area"></i> Diện tích: {area} m²
            </p>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <h2>
              <i class="fa-solid fa-address-book"></i>Thông tin liên hệ
            </h2>
            <p>
              {" "}
              <i class="fa-solid fa-user"></i>Người đăng: {user.name}
            </p>
            <p>
              <i class="fa-solid fa-phone"></i>Số điện thoại:
            </p>
            <p>
              <i class="fa-solid fa-envelope"></i>Email:
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="post-right">
          <div className="post_person">
            <div className="post_canhan" onClick={handleSwitch}>
              <div className="post_image">
                <img src={user.avatar} alt="" />
              </div>
              <h4>
                {" "}
                {user.name}{" "}
                <div>
                  <i class="fa-solid fa-user"></i>
                  Cá nhân
                </div>
              </h4>
            </div>
            <div className="post_call">
              <p>
                Độ tương tác{" "}
                <i
                  class="fa-solid fa-circle"
                  style={{ fontSize: "7px", padding: "0px 10px" }}
                ></i>{" "}
                1000
                <i
                  class="fa-solid fa-heart"
                  style={{ paddingLeft: "5px", color: "red" }}
                ></i>
              </p>
              <div className="post_chat">
                <i class="fa-brands fa-rocketchat"></i>Chat
              </div>
            </div>
          </div>
          <h2>Bài đăng nổi bật</h2>
          {featuredPosts.length > 0 ? (
            <>
              {" "}
              <ul className="featured-posts">
                {featuredPosts.map((featured, index) => (
                  <li
                    key={index}
                    className="featured-post-item"
                    onClick={() => {
                      navigate(`/post/${featured.id}`);
                      setF5(!f5);
                    }}
                  >
                    <img src={featured.image} alt={featured.Title} />
                    <div>
                      <h3>{featured.Title}</h3>
                      <p>Giá: {featured.Price} VND</p>
                      <p>
                        Địa chỉ: {featured.District} - {featured.Ward}{" "}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>Hiện chưa có bài đăng nào</>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content_" onClick={(e) => e.stopPropagation()}>
            <button className="modal-left" onClick={goToPrevious}>
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <img
              src={im[currentImageIndex]}
              alt="Phóng to"
              style={{ width: "100%", height: "auto" }}
            />
            <button className="modal-right" onClick={goToNext}>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
