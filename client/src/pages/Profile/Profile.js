import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { FaEdit, FaLock, FaUser } from "react-icons/fa";
import PostButton from "../../components/PostButton/PostButton";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../Cookie";
import { url } from "../../url";
import "./Profile.css";
import { storage } from "../../config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { id } = useParams();
  const idUser = getCookie("idUser");
  const [isHovered, setIsHovered] = useState(false);
  const [img, setImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: 0,
    likes: 0,
    image: "",
  });

  const changeAvatar = (event) => {
    const file = event.target.files[0];
    setIsLoading(true);
    console.log(file);
    if (file) {
      const imgRef = ref(storage, `files/${v4()}`);
      const metadata = { contentType: file.type };

      uploadBytes(imgRef, file, metadata)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          console.log("URL returned:", url);
          setImg(url);
          setIsLoading(false);
          setIsDisplay(true);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/user/profilebyjwt`, {
        withCredentials: true,
      });
      setProfile({
        name: res.data.user.name,
        age: res.data.user.age,
        likes: 0,
        image: res.data.user.avatar,
      });
      setImg(res.data.user.avatar);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSave = () => {
    console.log(img);
    axios
      .post(`${url}/user/avatar`, { img }, { withCredentials: true })
      .then((res) => {
        if (res.data.errCode === 0) {
          console.log("huhu");
          setIsDisplay(false);
          fetchUsers();
          toast.success("Update avatar thành công!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCancel = () => {
    console.log("cancel");
    setImg(profile.image);
    setIsDisplay(false);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
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
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            {isLoading ? (
              <div className="profile-avatar">
                {" "}
                <ClipLoader color="#3498db" size={50} />{" "}
              </div>
            ) : (
              <>
                <img src={img} alt="Profile" className="profile-avatar" />
              </>
            )}
            {isDisplay ? (
              <>
                <div>
                  <button
                    className="cancel_btn_2"
                    style={{ marginRight: "5px", marginBottom: "5px" }}
                    onClick={handleCancel}
                  >
                    Hủy
                  </button>
                  <button
                    className="cancel-button"
                    style={{ marginLeft: "5px", marginBottom: "5px" }}
                    onClick={handleSave}
                  >
                    Lưu
                  </button>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div
                  className="avatar-container"
                  onMouseEnter={() => {
                    setIsHovered(true);
                    console.log("hehehe");
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <label htmlFor="avatar" class="file-label">
                    <i class="fa-solid fa-camera cameraIcon avatar-icon"></i>
                  </label>

                  {isHovered && <div className="tooltip">Chỉnh sửa avatar</div>}
                  <input
                    type="file"
                    class="file-input"
                    id="avatar"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={changeAvatar}
                  />
                </div>
              </>
            )}

            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-age">Tuổi: {profile.age}</p>
            <p className="profile-likes">
              ❤️ <span>{profile.likes}</span> lượt thích
            </p>
          </div>
          {id === idUser ? (
            <>
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
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

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
      {/* <ToastContainer style={{ zIndex: "99999999999" }} /> */}
    </div>
  );
};

export default Profile;
