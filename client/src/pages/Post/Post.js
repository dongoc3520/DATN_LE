import "./Post.css";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import "react-image-gallery/styles/css/image-gallery.css";

const PostPage = () => {
  const im = [
    "https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg",
    "https://i.pinimg.com/736x/57/44/d5/5744d5dac67114a44ab42a07adf67dd6.jpg",
    "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain",
    "https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg",
    "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain",
    "https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg",
    "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain",
    "https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg",
    "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain",
    "https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg",
  ]; // Thay bằng đường dẫn thực tế

  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const maxVisibleImages = 6;

  // const visibleImages = im.slice(visibleStartIndex, Math.min(9999, im.length));
  const handleNext = () => {
    setVisibleStartIndex((prevIndex) => {
      if (im.length <= maxVisibleImages) {
        return (prevIndex + 1) % im.length;
      } else {
        return (prevIndex + 1) % (im.length - maxVisibleImages + 1);
      }
    });
  };

  // Hàm quay lại ảnh trước
  const handlePrev = () => {
    setVisibleStartIndex((prevIndex) => {
      if (im.length <= maxVisibleImages) {
        return (prevIndex - 1 + im.length) % im.length;
      } else {
        return (
          (prevIndex - 1 + im.length - maxVisibleImages + 1) %
          (im.length - maxVisibleImages + 1)
        );
      }
    });
  };
  useEffect(() => {
    console.log('1');
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
    console.log("hi");
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % im.length);
  };

  const post = {
    title: "Phòng trọ tiện nghi trung tâm quận 1",
    price: 3000000,
    address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
    area: 25,
    images: ["https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg"],
    user: { name: "Nguyễn Văn A" },
    contact: { phone: "0901234567", email: "nva@gmail.com" },
  };

  const featuredPosts = [
    {
      title: "Phòng trọ cao cấp quận 7",
      price: 3500000,
      address: "456 Huỳnh Tấn Phát, Quận 7",
      image:
        "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain", // Thay bằng đường dẫn thực tế
    },
    {
      title: "Phòng trọ giá rẻ quận Gò Vấp",
      price: 2500000,
      address: "789 Lê Văn Thọ, Gò Vấp",
      image:
        "https://i.pinimg.com/736x/57/44/d5/5744d5dac67114a44ab42a07adf67dd6.jpg",
    },
    {
      title: "Phòng trọ cao cấp quận 7",
      price: 3500000,
      address: "456 Huỳnh Tấn Phát, Quận 7",
      image:
        "https://th.bing.com/th/id/OIP.WdtD6iS63Iji7EO6iMBKUgHaHa?rs=1&pid=ImgDetMain", // Thay bằng đường dẫn thực tế
    },
    {
      title: "Phòng trọ cao cấp quận 7",
      price: 3500000,
      address: "456 Huỳnh Tấn Phát, Quận 7",
      image:
        "https://th.bing.com/th/id/OIP._ptc2dSyNtdmlSr5PfpQgQHaHQ?w=750&h=735&rs=1&pid=ImgDetMain", // Thay bằng đường dẫn thực tế
    },
  ];
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
            <p className="post-price_">Giá: {price.toLocaleString()} VND</p>
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
              <i class="fa-solid fa-phone"></i>Số điện thoại: {contact.phone}
            </p>
            <p>
              <i class="fa-solid fa-envelope"></i>Email: {contact.email}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="post-right">
          <div className="post_person">
            <div className="post_canhan">
              <div className="post_image">
                <img
                  src="https://th.bing.com/th/id/OIP.bwOwujLirWR_DHF3rYZrJwHaFj?rs=1&pid=ImgDetMain"
                  alt=""
                />
              </div>
              <h4>
                {" "}
                Đỗ Văn Ngọc{" "}
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
          <ul className="featured-posts">
            {featuredPosts.map((featured, index) => (
              <li key={index} className="featured-post-item">
                <img src={featured.image} alt={featured.title} />
                <div>
                  <h3>{featured.title}</h3>
                  <p>Giá: {featured.price.toLocaleString()} VND</p>
                  <p>Địa chỉ: {featured.address}</p>
                </div>
              </li>
            ))}
          </ul>
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
