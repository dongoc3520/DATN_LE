import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { FaEdit, FaLock, FaUser } from "react-icons/fa";
import PostButton from "../../components/PostButton/PostButton";

import "./Profile.css";

const Profile = () => {
   
  const [profile, setProfile] = useState({
    name: "Nguyễn Văn A",
    age: 25,
    likes: 250,
    image:
      "https://th.bing.com/th/id/R.d930651664e60ab0a9873be8e2aa3e81?rik=EBlnjyuPTTRdNg&riu=http%3a%2f%2fwww.hdwallpapersfreedownload.com%2fuploads%2flarge%2fcartoons%2fdoraemon-full.jpg&ehk=bMkOVg25D1cJaXdXQdJOjvkUi5JVCeq9jQJw6sIeDKU%3d&risl=&pid=ImgRaw&r=0",
  });

  const [posts, setPosts] = useState([
    {
      id: 1,
      title:
        "Phòng trọ gần trường Đại học A Phòng trọ gần trường Đại học A Phòng trọ gần trường Đại học A Phòng trọ gần trường Đại học A ",
      image: "https://feliz-home.com.vn/wp-content/uploads/2023/02/uecuhb.jpg",
      description: "Phòng rộng 20m², giá 2.5 triệu/tháng, đầy đủ tiện nghi.",
      area: "20",
      price: "1000",
    },
    {
      id: 2,
      title: "Nhà nguyên căn tại trung tâm",
      image:
        "https://ecogreen-saigon.vn/uploads/phong-tro-la-loai-hinh-nha-o-pho-bien-gia-re-tien-loi-cho-sinh-vien-va-nguoi-di-lam.png",
      description: "Nhà 3 tầng, 4 phòng ngủ, giá 10 triệu/tháng.",
      area: "20",
      price: "1000",
    },
    {
      id: 3,
      title: "Căn hộ mini quận B",
      image:
        "https://toancanhbatdongsan.com.vn/uploads/images/blog/hoangvy/2022/06/02/cho-thue-phong-tro-1654136735.jpeg",
      description: "Căn hộ 1 phòng ngủ, giá 5 triệu/tháng, an ninh tốt.",
      area: "20",
      price: "1000",
    },
    {
      id: 4,
      title: "Căn hộ mini quận B",
      image: "https://feliz-home.com.vn/wp-content/uploads/2023/02/uecuhb.jpg",
      description: "Căn hộ 1 phòng ngủ, giá 5 triệu/tháng, an ninh tốt.",
      area: "20",
      price: "1000",
    },
    {
      id: 5,
      title: "Căn hộ mini quận B",
      image: "https://feliz-home.com.vn/wp-content/uploads/2023/02/uecuhb.jpg",
      description: "Căn hộ 1 phòng ngủ, giá 5 triệu/tháng, an ninh tốt.",
      area: "20",
      price: "1000",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateProfile = (newData) => {
    setProfile({ ...profile, ...newData });
  };

  return (
    <div className="profile-posts-container">
      {/* Bên trái: Profile */}
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img src={profile.image} alt="Profile" className="profile-avatar" />
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-age">Tuổi: {profile.age}</p>
            <p className="profile-likes">
              ❤️ <span>{profile.likes}</span> lượt thích
            </p>
          </div>

          <div className="profile-actions">
            <button
              className="btn btn-info"
              onClick={() => handleOpenModal("info")}
            >
              <FaUser /> Chỉnh sửa thông tin
            </button>
            <button
              className="btn btn-username"
              onClick={() => handleOpenModal("username")}
            >
              <FaEdit /> Đổi Username
            </button>
            <button
              className="btn btn-password"
              onClick={() => handleOpenModal("password")}
            >
              <FaLock /> Đổi Password
            </button>
            <PostButton />
          </div>
        </div>
      </div>

      {/* Bên phải: Danh sách bài đăng */}
      <div className="posts-container">
        <h2>Bài đăng của bạn</h2>
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <img src={post.image} alt={post.title} className="post-image" />
              <h3 className="post-title">{post.title}</h3>
              <div className="post-details">
                <p className="post-area">Diện tích: {post.area} m²</p>
                <p className="post-price">Giá: {post.price} triệu</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showModal && (
        <Modal
          type={modalType}
          onClose={handleCloseModal}
          profile={profile}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default Profile;
