import React, { useState } from "react";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import "./PostButton.css";

import VrImage360 from "../RoomVR/RoomVR"; // Import component xem ảnh 360 độ
import { storage } from "../../config";
const PostButton = ({ onSubmit }) => {
  const [img, setImg] = useState("");
  const [imgUrl, setImgUrl] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    images: [],
    vrImage: null, // Thêm trường VR
    title: "",
    price: 500000,
    area: 20,
    type: "Phòng trọ",
  });

  const handleUpload = () => {};

  const handleVRChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImg(file);
      setFormData({ ...formData, vrImage: file });
      const img = file;
      if (img !== null) {
        const imgRef = ref(storage, `files/${v4()}`);

        const metadata = {
          contentType: img.type,
        };

        uploadBytes(imgRef, img, metadata)
          .then((snapshot) => {
            console.log("Upload successful:", snapshot);
            return getDownloadURL(snapshot.ref);
          })
          .then((url) => {
            console.log("URL returned:", url);
            setImgUrl((prevUrls) => [...prevUrls, url]);
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
          });
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  // const handleVRChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     console.log("this is a data", URL.createObjectURL(file));
  //     setFormData({ ...formData, vrImage: file });
  //   }
  // };

  const handleSubmit = () => {
    if (onSubmit) {
      // Tạo một đối tượng FormData để gửi dữ liệu bao gồm tệp
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("area", formData.area);
      data.append("type", formData.type);

      // Thêm hình ảnh
      formData.images.forEach((image, index) => {
        data.append(`images[${index}]`, image);
      });

      // Thêm VR image
      if (formData.vrImage) {
        data.append("vrImage", formData.vrImage);
      }

      onSubmit(data); // Gửi dữ liệu lên qua prop
    }
    setShowModal(false);
    setFormData({
      images: [],
      vrImage: null,
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

              {/* Chọn VR hình ảnh */}
              <div className="form-group">
                <div
                  className="vr-uploader"
                  onClick={() => document.getElementById("vrInput").click()}
                >
                  {formData.vrImage ? (
                    <></>
                  ) : (
                    <div className="vr-placeholder">
                      <span>+</span>
                      <p>Thêm hình ảnh VR</p>
                    </div>
                  )}
                </div>
                <input
                  id="vrInput"
                  type="file"
                  accept="image/*"
                  onChange={handleVRChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* Xem trước VR */}
              {formData.vrImage && (
                <div className="form-group">
                  <label>Xem trước VR</label>
                  <div className="vr-viewer">
                    <VrImage360
                      imageUrl={URL.createObjectURL(formData.vrImage)}
                    />{" "}
                    {/* Hiển thị ảnh 360 */}
                  </div>
                </div>
              )}

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
                  <option value="Phòng trọ">Phòng trọ</option>
                  <option value="Căn hộ">Căn hộ</option>
                  <option value="Chung cư mini">Chung cư mini</option>
                  <option value="Ở ghép">Ở ghép</option>
                </select>
              </div>
            </form>
            {/* Nút lưu */}
            <div className="modal-actions">
              <button className="save-button" onClick={handleUpload}>
                Tiếp
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
