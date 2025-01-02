import "./Post.css";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import "react-image-gallery/styles/css/image-gallery.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { url } from "../../url";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../Cookie";
import { ClipLoader } from "react-spinners";
import { storage } from "../../config";
import VrImage360 from "../../components/RoomVR/RoomVR";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { wardsData, data } from "../../data";
// import { useMessageContext } from "../../DataContext";
import { DataContext } from "../../DataContext";
import { v4 } from "uuid";
// import {getCookies} from "../"

const PostPage = () => {
  // const { toggleMessageBox1 } = useMessageContext(); // Sử dụng context
  const { setMydata } = useContext(DataContext);
  const navigate = useNavigate();
  const [inter, setInter] = useState([]);
  const { id } = useParams();
  const idUser = getCookie("idUser");
  const [im, setIm] = useState([]);
  const [f5, setF5] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const maxVisibleImages = 6;
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myim, setMyim] = useState("");

  const [checkp, setCheckp] = useState({
    title: "",
    price: 0,
    address: "",
    area: 0,
    district: "",
    ward: "",
  });
  const [post, setPost] = useState({
    idPost: "",
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
    district: "",
    ward: "",
  });

  const handleSendMess = async () => {
    try {
      const receiverId = post.user.id;
      const response = await axios.post(
        `${url}/friend/send`,
        { receiverId: receiverId },
        {
          withCredentials: true,
        }
      );
      if (response) {
        console.log("response", response);
        // toggleMessageBox1();
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài đăng:", error);
    }
    const fakeNe = {
      id: post.user.id,
      avatar: post.user.avatar,
      name: post.user.name,
      content1: "Cho tôi thông tin trọ này",
      content2: post.images[0],
    };
    setMydata(fakeNe);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setIsLoading(true);

    if (file) {
      const imgRef = ref(storage, `files/${v4()}`);
      const metadata = { contentType: file.type };

      uploadBytes(imgRef, file, metadata)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          // console.log("URL returned:", url);
          setMyim(url);
          setIsLoading(false);
          // toast.success("Upload ảnh VR thành công!");
          // Cập nhật vrImage mà không làm mất ảnh tĩnh
        })
        .catch((error) => {
          // setIsLoading(false);
          // toast.error("Upload ảnh VR thất bại!");
          console.error("Error uploading file:", error);
        });
    }
  };

  const saveImageChanges = async () => {
    try {
      if (!myim) {
        toast.warning("Cần up ảnh lên");
        return;
      }
      const body = {
        url: myim,
      };
      if (myim) {
        await axios
          .post(`${url}/post/update/img/${id}`, body)
          .then((res) => {
            console.log("kk", res);
            setPost({ ...post, images: [res.data.url] });
            toast.success("Đổi ảnh thành công!");
            setIsEditInfoModalOpen(false);
            setMyim("");
            console.log(post);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setIsEditImageModalOpen(false);
    } catch (error) {
      console.error("Error saving image changes:", error);
    }
  };

  const saveInfoChanges = async () => {
    try {
      const body = {
        title: post.title,
        price: post.price,
        address: post.address,
        area: post.area,
        district: post.district,
        ward: post.ward,
      };
      if (
        body.title === checkp.title &&
        body.price === checkp.price &&
        body.address === checkp.address &&
        body.area === checkp.area &&
        body.district === checkp.district &&
        body.ward === checkp.ward
      ) {
        toast.warning("Cần sửa đổi thông tin");
        return;
      }

      if (id) {
        await axios
          .post(`${url}/post/update/${id}`, body)
          .then((res) => {
            setIsEditInfoModalOpen(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // setIsEditInfoModalOpen(false);
    } catch (error) {
      console.error("Error saving info changes:", error);
    }
  };
  // const [idU, setIdU] = useState(0);
  // const [posts, setPosts] = useState([]);

  const fetchPosts = async (page) => {
    //console.log("ngoc day", post);
    try {
      // console.log("ngoc day", post.user.id);
      const response = await axios.get(`${url}/post/posts/getbyuserid`, {
        params: {
          id: post.user.id,
          page: page,
          limit: 4,
        },
      });
      // const { posts, totalPages } = response.data;
      // console.log("ngo ne", response.data);
      setFeaturedPosts(response.data.posts); // Cập nhật danh sách bài đăng
      // console.log("us is", idU);
      // console.log(featuredPosts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài đăng:", error);
    }
  };
  const fetchmPost = async () => {
    if (id) {
      await axios
        .get(`${url}/post/getbyidpost/${id}`)
        .then((res) => {
          // console.log("hi", res);
          setPost({
            ...post,
            idPost: res.data.data.post.id,
            title: res.data.data.post.Title,
            price: res.data.data.post.Price,
            area: res.data.data.post.Area,
            address: res.data.data.post.Address,
            images: [res.data.data.type2Image],
            user: { ...res.data.data.post.user },
            district: res.data.data.post.District,
            ward: res.data.data.post.Ward,
          });
          if (res.data.data.interests.length > 0) {
            setInter(res.data.data.interests);
          }
          setCheckp({
            ...checkp,
            title: res.data.data.post.Title,
            price: res.data.data.post.Price,
            area: res.data.data.post.Area,
            address: res.data.data.post.Address,
            district: res.data.data.post.District,
            ward: res.data.data.post.Ward,
          });
          setIm(res.data.data.type1Images);
          // console.log("ngoicoi", res.data.data.post.user.id);
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
    navigate(`/profile/${post.user.id}`);
  };
  const APIDelete = async () => {
    // console.log("delete");
    // console.log(post);
    //  await axios
    //    .post(`${url}/post/delete/${post.idPost}`, { withCredentials: true })
    //    .then((res) => {
    //      console.log("res is", res);
    //      navigate(`/profile/${post.user.id}`);
    //    })
    //    .catch((err) => {
    //      console.log(err);
    //    });
    await axios
      .post(
        `${url}/post/delete/${post.idPost}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.errCode === 0) {
          navigate(`/profile/${post.user.id}`);
          //  toast.success("Update thành công!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { title, price, address, area, images, user, district, ward } = post;

  return (
    <div className="post-page-container">
      <div className="post-page">
        {/* Left Column */}
        <div className="post-left">
          {/* 360 Viewer */}
          <div className="post-360-view">
            {post.user.id === parseInt(idUser) ? (
              <>
                {" "}
                <button
                  className=" ngocbtn"
                  onClick={() => setIsEditImageModalOpen(true)}
                >
                  <i class="fa-regular fa-pen-to-square"></i>
                </button>
              </>
            ) : (
              <></>
            )}

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
              <i class="fa-solid fa-location-dot"></i> Địa chỉ: {address} -{" "}
              {district} - {ward}
            </p>
            <p className="post-area">
              <i class="fa-solid fa-chart-area"></i> Diện tích: {area} m²
            </p>
            {post.user.id === parseInt(idUser) ? (
              <>
                <button
                  className="edit-button"
                  onClick={() => setIsEditInfoModalOpen(true)}
                >
                  Sửa thông tin
                </button>
              </>
            ) : (
              <></>
            )}
          </div>

          {/* Contact Info */}
          <div className="contact-info" style={{ marginLeft: "14px" }}>
            <h2>
              <i class="fa-solid fa-address-book"></i>Thông tin liên hệ
            </h2>
            <p>
              {" "}
              <i class="fa-solid fa-user"></i>Người đăng: {user.name}
            </p>
            <p>
              <i class="fa-solid fa-phone"></i>Điện thoại: {user.phone}
            </p>
            <p>
              <i class="fa-solid fa-envelope"></i>Email: {user.email}
            </p>
          </div>
          {/* <button
            onClick={() => {
              console.log("hehe", inter);
            }}
          >
            HEHEHEHEH
          </button> */}
          {/* {post.Gender === "nu" ? (
            <>
              <i class="fa-solid fa-venus"></i>
            </>
          ) : (
            <>
              <i class="fa-solid fa-mars"></i>
            </>
          )} */}
          <div className="sothich">
            {inter &&
              inter.length > 0 &&
              inter.map((item, index) => (
                <div key={index}>
                  {/* <i class="fa-brands fa-pinterest-p"></i> */}
                  <p>{item.name}</p>
                </div>
              ))}
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
              {post.user.id === parseInt(idUser) ? (
                <>
                  <div
                    className="post_chat"
                    style={{ background: "#c93434" }}
                    onClick={() => {
                      setIsDelete(true);
                    }}
                  >
                    <i class="fa-solid fa-trash"></i>Xóa bài viết
                  </div>
                </>
              ) : (
                <>
                  <div className="post_chat" onClick={handleSendMess}>
                    <i class="fa-brands fa-rocketchat"></i>Nhắn tin
                  </div>
                </>
              )}
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
      <div className="support-container">
        <div className="support-content">
          <div className="">
            <h3 style={{ marginBottom: "30px", marginTop: "20px" }}>
              {" "}
              Đánh giá của khách hàng (5.0{" "}
              <i
                style={{ color: "rgb(162, 183, 8)" }}
                class="fa-solid fa-star"
              ></i>
              )
            </h3>
            <div className="support-image">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              marginTop: "40px",
              marginLeft: "100px",
            }}
          >
            <div className="support-text">
              <h2>Hỗ trợ chủ nhà đăng tin</h2>
              <p>
                Nếu bạn cần hỗ trợ đăng tin, vui lòng liên hệ số điện thoại bên
                dưới:
              </p>
            </div>
            <div className="support-contact">
              <div
                className="contact-button phone"
                onClick={() => {
                  window.open("https://chat.zalo.me/", "_blank");
                }}
              >
                📞 ĐT: 0123456789
              </div>
              <div
                className="contact-button zalo"
                onClick={() => {
                  window.open("https://chat.zalo.me/", "_blank");
                }}
              >
                💬 Zalo: 0123456789
              </div>
            </div>
          </div>
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
      {/* Modal sửa ảnh */}
      {/* Modal sửa ảnh */}
      {isEditImageModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update ảnh 360 VR</h2>
            {isLoading ? (
              <>
                {" "}
                <div className="" style={{ textAlign: "center" }}>
                  {" "}
                  <ClipLoader color="#3498db" size={50} />{" "}
                </div>{" "}
              </>
            ) : (
              <>
                {myim ? (
                  <>
                    <i
                      class="fa-solid fa-xmark iconngoccoi"
                      onClick={() => {
                        setMyim("");
                      }}
                    ></i>
                    <div className="vr-viewer">
                      <VrImage360 imageUrl={myim} /> {/* Hiển thị ảnh 360 */}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="image-upload-box"
                      onClick={() =>
                        document.getElementById("imageInput").click()
                      }
                    >
                      <span className="plus-icon">+</span>
                    </div>
                  </>
                )}
              </>
            )}

            <input
              id="imageInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <div className="btnNgocHe">
              <button className="save_btn_n" onClick={saveImageChanges}>
                Lưu
              </button>
              <button
                className="cancel_btn_n"
                onClick={() => setIsEditImageModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa thông tin */}
      {isEditInfoModalOpen && (
        <div className="_modal">
          <div className="_modal-content">
            <h2>Sửa thông tin</h2>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            <input
              type="number"
              placeholder="Giá"
              value={post.price}
              onChange={(e) =>
                setPost({ ...post, price: parseInt(e.target.value) })
              }
            />
            <input
              type="text"
              placeholder="Địa chỉ"
              value={post.address}
              onChange={(e) => setPost({ ...post, address: e.target.value })}
            />
            <div>
              {/* <label>Quận:</label> */}
              <select
                style={{
                  background: "none",
                  color: "#333",
                  border: "1px solid #999",
                }}
                value={post.district}
                onChange={(e) => {
                  const selectedDistrict = e.target.value;
                  setPost({ ...post, district: selectedDistrict, ward: "" });
                }}
              >
                {data.map((city) =>
                  city.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              {/* <label>Phường:</label> */}
              <select
                style={{
                  background: "none",
                  color: "#333",
                  marginTop: "10px",
                  border: "1px solid #999",
                }}
                value={post.ward}
                onChange={(e) => setPost({ ...post, ward: e.target.value })}
                disabled={!post.district}
              >
                {/* <option value="">Chọn phường</option> */}
                {post.district &&
                  wardsData[post.district]?.map((ward) => (
                    <option
                      className="option_sele"
                      key={ward.value}
                      value={ward.value}
                      // style={{ background: "rgb(103 145 237)", color: "#ddd" }}
                    >
                      {ward.label}
                    </option>
                  ))}
              </select>
            </div>
            <button
              className="save_btn_n"
              style={{ marginRight: "50px" }}
              onClick={saveInfoChanges}
            >
              Lưu
            </button>
            <button
              className="cancel_btn_n"
              onClick={() => setIsEditInfoModalOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {isDelete && (
        <div className="_modal">
          <div className="_modal-content">
            <h2>
              <i
                class="fa-solid fa-triangle-exclamation"
                style={{
                  fontSize: "29px",
                  marginRight: "10px",
                  color: "rgb(250 41 41)",
                }}
              ></i>
              Bài viết sẽ được xóa vĩnh viễn.
            </h2>

            <button
              className="save_btn_n"
              style={{ marginRight: "50px" }}
              onClick={APIDelete}
            >
              Đồng ý
            </button>
            <button className="cancel_btn_n" onClick={() => setIsDelete(false)}>
              Hủy
            </button>
          </div>
        </div>
      )}
      <ToastContainer style={{ zIndex: "999999999999999999" }} />
    </div>
    // </div>
  );
};

export default PostPage;
