import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../../url";

const PostCard = ({ post, onDataChange }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Trạng thái modal xác nhận
  const navigate = useNavigate();

  const body = {
    id: post.id,
    title: post.Title,
    price: post.Price,
    address: post.Address,
    user: post.user.name,
    image: post.type1Images[0],
  };

  const handleSwitch = () => {
    navigate(`/post/${parseInt(body.id)}`);
  };

  const APIDelete = async () => {
    try {
      const res = await axios.post(`${url}/post/remove/${post.id}`);
      if (res.data.errCode === 0) {
        console.log("delete success");
        onDataChange();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Hàm xử lý khi người dùng đồng ý xóa
  const handleDelete = () => {
    APIDelete();
    setShowConfirmModal(false); // Đóng modal sau khi xóa
  };

  // Hàm xử lý khi người dùng hủy bỏ
  const handleCancel = () => {
    setShowConfirmModal(false); // Đóng modal nếu người dùng hủy
  };

  return (
    <>
      <div className="post-card">
        <img
          src={body.image}
          alt={body.title}
          className="post-image"
          onClick={handleSwitch}
        />
        <div className="post-info" onClick={handleSwitch}>
          <h3 className="title_">{body.title}</h3>
          <p>
            <strong>Giá:</strong> {body.price} VND
          </p>
          <p>
            <strong>Địa chỉ:</strong> {body.address}
          </p>
          <p>
            <strong>Đăng bởi:</strong> {body.user}
          </p>
        </div>
        <div
          className="delete-btn"
          onClick={() => setShowConfirmModal(true)} // Hiển thị modal khi nhấn Xóa
        >
          Xóa
        </div>

        {/* Modal xác nhận xóa */}
      </div>
      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="modal-content__">
            <p style={{ fontSize: "18px" }}>
              {" "}
              <i
                class="fa-solid fa-triangle-exclamation "
                style={{ marginRight: "10px", fontSize: "25px", color: "red" }}
              ></i>
              Bạn có chắc chắn muốn xóa bài đăng này?
            </p>
            <button style={{ color: "#1773ea" }} onClick={handleDelete}>
              Đồng ý
            </button>
            <button style={{ color: "#ff4d4f" }} onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
