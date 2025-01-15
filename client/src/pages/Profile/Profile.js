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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import StatisticsBox from "../../components/StatisticsBox/StatisticsBox";
import PieChart from "../../components/PieChart/PieChart";
import BarChart from "../../components/BarChart/BarChart";
const Profile = () => {
  const navigate = useNavigate();
  const [f, setF] = useState(false);
  const { id } = useParams();
  const idUser = getCookie("idUser");
  const role = getCookie("role");
  const [isHovered, setIsHovered] = useState(false);
  const [img, setImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [profile, setProfile] = useState({
    work: "",
    gender: "",
    name: "",
    age: 0,
    likes: 1000,
    image: "",
    role: "",
  });

  const changeAvatar = (event) => {
    const file = event.target.files[0];
    setIsLoading(true);
    // console.log(file);
    if (file) {
      const imgRef = ref(storage, `files/${v4()}`);
      const metadata = { contentType: file.type };

      uploadBytes(imgRef, file, metadata)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          // console.log("URL returned:", url);
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
      const res = await axios.get(`${url}/user/profile/${id}`, {
        withCredentials: true,
      });
      setProfile({
        gender: res.data.user.gender,
        work: res.data.user.work,
        name: res.data.user.name,
        age: res.data.user.age,
        likes: 1000,
        image: res.data.user.avatar,
        role: res.data.user.role,
      });
      // console.log(profile);
      setImg(res.data.user.avatar);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSave = () => {
    // console.log(img);
    axios
      .post(`${url}/user/avatar`, { img }, { withCredentials: true })
      .then((res) => {
        if (res.data.errCode === 0) {
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
    // console.log("cancel");
    setImg(profile.image);
    setIsDisplay(false);
  };
  const fetchPosts = async (page) => {
    try {
      const response = await axios.get(`${url}/post/posts/getbyuserid`, {
        params: {
          id: id, // ID người dùng (ví dụ)
          page: page, // Trang hiện tại
          limit: 6, // Số bài đăng mỗi trang
        },
      });
      const { posts, totalPages } = response.data;
      // console.log(response.data);
      setPosts(posts); // Cập nhật danh sách bài đăng
      setTotalPages(totalPages); // Cập nhật tổng số trang
      // console.log(posts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài đăng:", error);
    }
  };
  const [statistics, setStatistics] = useState({
    apartments: 0,
    miniApartments: 0,
    sharedRooms: 0,
    averagePriceApartments: 0, // Giá trung bình Căn hộ (VND)
    averagePriceMiniApartments: 0, // Giá trung bình Chung cư mini (VND)
    averagePriceSharedRooms: 0, // Giá trung bình Ở ghép (VND)
  });

  const totalPosts =
    statistics.apartments + statistics.miniApartments + statistics.sharedRooms;

  // Dữ liệu cho biểu đồ tròn
  const pieData = [
    (statistics.apartments / totalPosts) * 100,
    (statistics.miniApartments / totalPosts) * 100,
    (statistics.sharedRooms / totalPosts) * 100,
  ];

  // Dữ liệu cho biểu đồ cột
  const barData = [
    statistics.averagePriceApartments,
    statistics.averagePriceMiniApartments,
    statistics.averagePriceSharedRooms,
  ];
  const getCount = async () => {
    try {
      const response = await axios.get(`${url}/post/statistics`);
      if (response.data.errCode === 0) {
        console.log(response);
        const mBody = {
          apartments: response.data.apartments.count,
          miniApartments: response.data.miniApartments.count,
          sharedRooms: response.data.sharedRooms.count,
          averagePriceApartments: response.data.apartments.averagePrice,
          averagePriceMiniApartments: response.data.miniApartments.averagePrice,
          averagePriceSharedRooms: response.data.sharedRooms.averagePrice,
        };
        setStatistics(mBody);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài đăng:", error);
    }
  };
  useEffect(() => {
    fetchPosts(currentPage);
    fetchUsers();
    getCount();
  }, [f, currentPage, id]);
  const handleChildParent = () => {
    setF(!f);
  };
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateProfile = () => {
    // setProfile({ ...profile, ...newData });
    if (modalType === "info") {
      setF((prev) => !prev);
      // console.log(f);
    }

    setShowModal(false);
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
              <div>
                <img src={img} alt="Profile" className="profile-avatar" />
              </div>
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
                    // console.log("hehehe");
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
            <p className="profile-name">Công việc: {profile.work}</p>
            <p className="profile-name">Giới tính: {profile.gender}</p>
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
                {profile.role === "2" ? (
                  <>
                    {" "}
                    <PostButton onSubmit={handleChildParent} />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      {role === "99" && id === idUser ? (
        <div className="posts-container">
          <h2 style={{ color: "#1773ea" }}>Dashboard - Quản lý bài đăng</h2>
          <div className="statistics-boxes" style={{ cursor: "pointer" }}>
            <StatisticsBox
              title="Căn hộ"
              count={statistics.apartments}
              color="rgb(48 135 58)"
              type="1"
            />
            <StatisticsBox
              title="Chung cư mini"
              count={statistics.miniApartments}
              color="rgb(41 120 173)"
              type="2"
            />
            <StatisticsBox
              title="Ở ghép"
              count={statistics.sharedRooms}
              color="#092756"
              type="3"
            />
          </div>

          <div className="charts">
            <div className="chart">
              <h2 style={{ color: "#1773ea" }}>Phân bổ bài đăng theo loại</h2>
              <PieChart data={pieData} />
            </div>

            <div className="chart">
              <h2 style={{ color: "#1773ea" }}>
                Giá tiền trung bình theo loại phòng
              </h2>
              <BarChart data={barData} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="posts-container">
            <h2>Bài đăng của bạn</h2>
            <div className="posts-list">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="post-card"
                  onClick={() => {
                    navigate(`/post/${post.id}`);
                  }}
                >
                  <img
                    src={post.image}
                    alt={post.Title}
                    className="post-image"
                  />
                  <h3 className="post-title">{post.Title}</h3>
                  <div className="post-details" style={{ textAlign: "left" }}>
                    <p className="post-area">
                      <i class="fa-solid fa-chart-area"></i>Diện tích:{" "}
                      {post.Area} m²
                    </p>
                    <p className="post-price">
                      <i class="fa-solid fa-money-bill"></i>Giá: {post.Price}{" "}
                      VND
                    </p>
                    <p className="post-area">
                      <i class="fa-solid fa-location-dot"></i>Địa chỉ:{" "}
                      {post.Address} m²
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {posts.length > 0 ? (
              <>
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </button>
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Tiếp
                  </button>
                </div>
              </>
            ) : (
              <>Bạn hiện chưa có bài đăng nào</>
            )}
          </div>
        </>
      )}

      {showModal && (
        <Modal
          type={modalType}
          onClose={handleCloseModal}
          profile={profile}
          onSave={handleUpdateProfile}
        />
      )}
      <ToastContainer style={{ zIndex: "99999999999999999" }} />
    </div>
  );
};

export default Profile;
