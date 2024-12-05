import React, { useState } from "react";
import "./PostButton.css";
const PostButton = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    images: [],
    title: "",
    price: 500000,
    area: 20,
    type: "Phòng trọ",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData); // Gửi dữ liệu lên qua prop
    }
    setShowModal(false);
    setFormData({
      images: [],
      title: "",
      price: 500000,
      area: 20,
      type: "Phòng trọ",
    });
  };

  return (
    <>
      {/* Nút mở modal */}
      <button className="post-button" onClick={() => setShowModal(true)}>
        Đăng bài
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Đăng bài mới</h2>
            <form>
              {/* Chọn hình ảnh */}
              <div className="form-group">
                <label>Hình ảnh</label>
                <div
                  className="image-uploader"
                  onClick={() => document.getElementById("imageInput").click()}
                >
                  {formData.images.length > 0 ? (
                    <div className="image-preview">
                      {formData.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(img)}
                          alt="Preview"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="image-placeholder">
                      <span>+</span>
                      <p>Thêm ảnh</p>
                    </div>
                  )}
                </div>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* Tiêu đề */}
              <div className="form-group">
                
                <textarea
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề"
                  rows="2" /* Đặt chiều cao mặc định */
                />
              </div>

              {/* Giá (Slider) */}
              <div className="form-group">
                <label>Giá 1 triệu - 5 triệu (VNĐ)</label>
                <input
                  type="range"
                  name="price"
                  min="1000000"
                  max="5000000"
                  step="100000"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <p>
                  {new Intl.NumberFormat("vi-VN").format(formData.price)} VNĐ
                </p>
              </div>

              {/* Diện tích (Slider) */}
              <div className="form-group">
                <label>Diện tích (m²)</label>
                <input
                  type="range"
                  name="area"
                  min="10"
                  max="100"
                  step="1"
                  value={formData.area}
                  onChange={handleInputChange}
                />
                <p>{formData.area} m²</p>
              </div>

              {/* Loại phòng */}
              <div className="form-group">
                <label>Loại</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="1">Căn hộ</option>
                  <option value="2">Chung cư mini</option>
                  <option value="3">Ở ghép</option>
                </select>
              </div>
            </form>
            {/* Nút lưu */}
            <div className="modal-actions">
              <button className="save-button" onClick={handleSubmit}>
                Lưu
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostButton;
