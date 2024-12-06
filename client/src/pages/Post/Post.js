import "./Post.css";
import React, { useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import ImageGallery from "react-image-gallery"; // Thư viện slide ảnh
import "react-image-gallery/styles/css/image-gallery.css";
import ModalImage from "react-modal-image"; // Thư viện phóng to ảnh

const PostPage = () => {
  const im = [
    "https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg",
    "https://i.pinimg.com/736x/57/44/d5/5744d5dac67114a44ab42a07adf67dd6.jpg",
    "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain",
    "https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg",
    "https://i.pinimg.com/736x/57/44/d5/5744d5dac67114a44ab42a07adf67dd6.jpg",
    "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain",
    "https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg",
    "https://i.pinimg.com/736x/57/44/d5/5744d5dac67114a44ab42a07adf67dd6.jpg",
    "https://th.bing.com/th/id/OIP.1a31QUbCZjQD8w2KP2DKnwHaGu?rs=1&pid=ImgDetMain",
  ]; // Thay bằng đường dẫn thực tế
  const galleryImages = im.map((img) => ({
    original: img,
    thumbnail: img,
  }));
  const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái mở modal
  const [selectedImage, setSelectedImage] = useState(null); // Ảnh được chọn
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Theo dõi ảnh hiện tại
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const maxVisibleImages = 5; // Số ảnh tối đa hiển thị

  const goToPreviousImages = () => {
    setVisibleStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNextImages = () => {
    setVisibleStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, im.length - maxVisibleImages)
    );
  };
  const visibleImages = im.slice(
    visibleStartIndex,
    visibleStartIndex + maxVisibleImages
  );

  const openModal = (image) => {
    const index = im.indexOf(im);
    setCurrentImageIndex(index);
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + im.length) % im.length; // Quay vòng nếu cần
      setSelectedImage(im[newIndex]);
      return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % im.length; // Quay vòng nếu cần
      setSelectedImage(im[newIndex]);
      return newIndex;
    });
  };
  const post = {
    title: "Phòng trọ tiện nghi trung tâm quận 1",
    price: 3000000,
    address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
    area: 25,
    images: ["https://vr360.com.vn/uploads/images/chupanh360dodanang.jpg"], // Thay bằng đường dẫn thực tế
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
          <div className="post-image-slider">
            <button
              className="slider-left"
              onClick={goToPreviousImages}
              disabled={visibleStartIndex === 0}
              style={{
                cursor: visibleStartIndex === 0 ? "not-allowed" : "pointer",
              }}
            >
              &#8249;
            </button>

            <div className="image-list">
              {visibleImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  className="thumbnail"
                  onClick={() => openModal(img)}
                  style={{
                    cursor: "pointer",
                    width: "100px",
                    height: "100px",
                    margin: "5px",
                  }}
                />
              ))}
            </div>

            <button
              className="slider-right"
              onClick={goToNextImages}
              disabled={visibleStartIndex + maxVisibleImages >= im.length}
              style={{
                cursor:
                  visibleStartIndex + maxVisibleImages >= im.length
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              &#8250;
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
                <i class="fa-solid fa-heart" style={{ paddingLeft: "5px" }}></i>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-left" onClick={goToPrevious}>
              &#8249; {/* Mũi tên trái */}
            </button>
            <img
              src={selectedImage}
              alt="Phóng to"
              style={{ width: "100%", height: "auto" }}
            />
            <button className="modal-right" onClick={goToNext}>
              &#8250; {/* Mũi tên phải */}
            </button>
            <button className="modal-close" onClick={closeModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
