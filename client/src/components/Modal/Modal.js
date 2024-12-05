import React, { useState } from "react";
import "./Modal.css";

const Modal = ({ type, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    image: profile.image,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (type === "info") {
      onSave(formData);
    }
    alert(
      `${type === "password" ? "Password" : "Thông tin"} đã được thay đổi!`
    );
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>
          {type === "password"
            ? "Đổi Password"
            : type === "username"
            ? "Đổi Username"
            : "Chỉnh sửa thông tin cá nhân"}
        </h3>

        {type === "info" && (
          <div className="modal-form">
            <label>
              Họ và tên:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên mới"
              />
            </label>
            <label>
              Tuổi:
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Nhập tuổi mới"
              />
            </label>
            <label>
              Link hình ảnh:
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Dán URL ảnh mới"
              />
            </label>
          </div>
        )}

        {type === "password" && (
          <>
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              className="modal-input"
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="modal-input"
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="modal-input"
            />
          </>
        )}

        {type === "username" && (
          <>
            <input
              type="username"
              placeholder="Username hiện tại"
              className="modal-input"
            />
            <input
              type="username"
              placeholder="Username mới"
              className="modal-input"
            />
            <input
              type="username"
              placeholder="Username mới"
              className="modal-input"
            />
          </>
        )}

        <div className="modal-buttons">
          <button className="btn save" onClick={handleSave}>
            Lưu
          </button>
          <button className="btn cancel" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
