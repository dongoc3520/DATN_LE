import "./Post.css";
import React from "react";
import * as THREE from "three"; // Import thư viện Three.js
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

const PostPage = () => {
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
      image: "/featured1.jpg", // Thay bằng đường dẫn thực tế
    },
    {
      title: "Phòng trọ giá rẻ quận Gò Vấp",
      price: 2500000,
      address: "789 Lê Văn Thọ, Gò Vấp",
      image: "/featured2.jpg",
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

          {/* Post Details */}
          <div className="post-details">
            <h1 className="post-title">{title}</h1>
            <p className="post-price">Giá: {price.toLocaleString()} VND</p>
            <p className="post-address">Địa chỉ: {address}</p>
            <p className="post-area">Diện tích: {area} m²</p>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <h2>Thông tin liên hệ</h2>
            <p>Người đăng: {user.name}</p>
            <p>Số điện thoại: {contact.phone}</p>
            <p>Email: {contact.email}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="post-right">
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
    </div>
  );
};

export default PostPage;
