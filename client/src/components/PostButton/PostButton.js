import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import "./PostButton.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VrImage360 from "../RoomVR/RoomVR"; // Import component xem ảnh 360 độ
import { storage } from "../../config";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { url } from "../../url";
import Select from "react-select";
import { wardsData, data } from "../../data";

// const districts = data;

const PostButton = ({ onSubmit }) => {
  const [page, setPage] = useState("1");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  // const [address, setAddress] = useState("");
  const [formData, setFormData] = useState({
    images: [],
    vrImage: null, // Thêm trường VR
    title: "",
    selectedTags: [],
    price: 500000,
    area: 20,
    type: "1",
    district: "",
    ward: "",
  });
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "district" && { ward: "" }), // Reset ward khi chọn lại district
    }));
  };
  const isFormValid = () => {
    const {
      images,
      vrImage,
      title,
      selectedTags,
      price,
      area,
      type,
      district,
      ward,
    } = formData;

    // Kiểm tra xem các trường đã có giá trị chưa
    if (
      !images.length ||
      !vrImage ||
      !title.trim() ||
      (selectedTags.length === 0 && type === "3") ||
      ((selectedTags.length === 1 || selectedTags.length === 2) &&
        type === "3") ||
      !price ||
      !area ||
      !type.trim() ||
      !district.trim() ||
      !ward.trim()
    ) {
      return false;
    }

    return true;
  };
  const [showMore, setShowMore] = useState(false);
  const imagesToDisplay = showMore
    ? formData.images
    : formData.images.slice(0, 4);
  // const [selectedTags, setSelectedTags] = useState([]);

  const availableTags = [
    "Yên lặng",
    "Tấp nập",
    "Kỷ luật",
    "Buông thả",
    "Nấu ăn",
    "Ăn nhanh",
    "Thức khuya",
    "Ngủ sớm",
    "Nuôi pet",
  ];
  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files); // Lấy danh sách file từ input
    setIsLoading2(true);

    const validUrls = [];
    for (const file of files) {
      const imgRef = ref(storage, `files/${v4()}`);
      const metadata = { contentType: file.type };

      try {
        const snapshot = await uploadBytes(imgRef, file, metadata);
        const url = await getDownloadURL(snapshot.ref);
        validUrls.push(url);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
      }
    }

    // Cập nhật ảnh tĩnh mà không làm mất ảnh VR
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...validUrls], // Thêm URL hợp lệ vào trường images
    }));

    setIsLoading2(false);
    if (validUrls.length > 0) {
      toast.success("Upload ảnh thành công!");
    } else {
      toast.error("Upload ảnh thất bại!");
    }
  };

  const handleTagClick = (tag) => {
    // Nếu đã đủ 3 thẻ thì không cho thêm
    if (formData.selectedTags.length >= 3) return;

    // Kiểm tra nếu thẻ chưa tồn tại thì thêm vào
    if (!formData.selectedTags.includes(tag)) {
      setFormData({
        ...formData,
        selectedTags: [...formData.selectedTags, tag],
      });
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      selectedTags: formData.selectedTags.filter((item) => item !== tag),
    });
  };

  const handleNextPage = () => {
    setPage("2");
  };
  const handlePrePage = () => {
    setPage("1");
  };

  const callAPI = async () => {
    console.log(formData);
    await axios
      .post(`${url}/post`, formData, { withCredentials: true })
      .then((response) => {
        // console.log(response);
        if (response.data.errCode === 0) {
          toast.success("Tạo bài viết thành công");
        }
      })
      .catch((err) => {
        toast.error("Tạo bài viết thất bại");
      });
    setFormData({
      images: [],
      vrImage: null, // Thêm trường VR
      title: "",
      selectedTags: [],
      price: 500000,
      area: 20,
      type: "Phòng trọ",
      district: "",
      ward: "",
    });
    onSubmit();
    setShowModal(false);
  };
  const handleVRChange = (event) => {
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
          console.log("URL returned:", url);
          setIsLoading(false);
          toast.success("Upload ảnh VR thành công!");

          // Cập nhật vrImage mà không làm mất ảnh tĩnh
          setFormData((prevData) => ({
            ...prevData,
            vrImage: url,
          }));
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error("Upload ảnh VR thất bại!");
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFormData({ ...formData, images: files });
  // };

  return (
    <>
      {/* Nút mở modal */}
      <button className="post-button" onClick={() => setShowModal(true)}>
        Đăng bài
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Đăng bài mới</h2>
            <div>
              {page === "1" ? (
                <>
                  {" "}
                  {/* Chọn hình ảnh */}
                  <div className="form-group">
                    <div
                      className="image-uploader"
                      onClick={() =>
                        document.getElementById("imageInput").click()
                      }
                    >
                      {formData.images.length > 0 ? (
                        <div className="image-preview">
                          {imagesToDisplay.map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt={`Preview ${idx}`}
                            />
                          ))}
                          {formData.images.length > 4 && !showMore && (
                            <div
                              className="more-images"
                              onClick={() => setShowMore(true)}
                            >
                              <i
                                class="fa-solid fa-ellipsis"
                                style={{ fontSize: "20px", marginLeft: "5px" }}
                              ></i>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="image-placeholder">
                          {isLoading2 ? (
                            <ClipLoader color="#3498db" size={50} />
                          ) : (
                            <>
                              {" "}
                              <span>+</span>
                              <p>Thêm hình ảnh </p>
                            </>
                          )}
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
                          {isLoading ? (
                            <ClipLoader color="#3498db" size={50} />
                          ) : (
                            <>
                              {" "}
                              <span>+</span>
                              <p>Thêm hình ảnh VR</p>
                            </>
                          )}
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
                        <VrImage360 imageUrl={formData.vrImage} />{" "}
                        {/* Hiển thị ảnh 360 */}
                      </div>
                      <button className="btn_deleteVR">
                        <i class="fa-solid fa-trash"></i>
                      </button>
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
                      {new Intl.NumberFormat("vi-VN").format(formData.price)}{" "}
                      VNĐ
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
                      <option value="1">Căn hộ</option>
                      <option value="2">Chung cư mini</option>
                      <option value="3">Ở ghép</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="tag-input-container">
                    {/* Input địa chỉ */}
                    {/* <div className="address-input">
                      <label htmlFor="address">Địa chỉ:</label>
                      <input
                        type="text"
                        id="address"
                        placeholder="Nhập địa chỉ của bạn..."
                        value={formData.address}
                        onChange={handleAddressChange}
                      />
                    </div> */}
                    <div className="address-input">
                      {/* Dropdown Quận/Huyện */}
                      {/* <label htmlFor="district">Quận/Huyện:</label> */}
                      <Select
                        id="district"
                        options={data.flatMap((item) => item.options)}
                        value={
                          data
                            .flatMap((item) => item.options)
                            .find(
                              (option) => option.value === formData.district
                            ) || null
                        }
                        onChange={(option) =>
                          updateField("district", option.value)
                        }
                        placeholder="-- Chọn Quận/Huyện --"
                      />

                      {/* Dropdown Phường/Xã */}
                      {formData.district && (
                        <div style={{ marginTop: "10px" }}>
                          {/* <label htmlFor="ward">Phường/Xã:</label> */}
                          <Select
                            id="ward"
                            options={wardsData[formData.district]}
                            value={
                              wardsData[formData.district]?.find(
                                (option) => option.value === formData.ward
                              ) || null
                            }
                            onChange={(option) =>
                              updateField("ward", option.value)
                            }
                            placeholder="-- Chọn Phường/Xã --"
                          />
                        </div>
                      )}
                    </div>

                    {formData.type === "3" ? (
                      <>
                        {/* Hiển thị các tag đã chọn */}
                        <div className="selected-tags">
                          {formData.selectedTags.map((tag, index) => (
                            <div key={index} className="tag">
                              {tag}
                              <button
                                className="remove-tag"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                ✖
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Danh sách các tag có sẵn */}
                        <div className="available-tags">
                          {availableTags.map((tag, index) => (
                            <div
                              key={index}
                              className={`tag-option ${
                                formData.selectedTags.includes(tag)
                                  ? "tag-selected"
                                  : ""
                              }`}
                              onClick={() => handleTagClick(tag)}
                            >
                              {tag}
                            </div>
                          ))}
                        </div>

                        {/* Hiển thị cảnh báo nếu đạt giới hạn */}
                        {formData.selectedTags.length < 3 && (
                          <p className="warning">Bạn chọn 3 sở thích.</p>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* Nút lưu */}
            <div className="modal-actions">
              {page === "1" ? (
                <>
                  <button
                    className="save-button"
                    style={{ marginLeft: "200px" }}
                    onClick={handleNextPage}
                  >
                    Tiếp
                  </button>{" "}
                </>
              ) : (
                <>
                  <button className="save-button" onClick={handlePrePage}>
                    Trước
                  </button>
                  {isFormValid() ? (
                    <>
                      {" "}
                      <button className="cancel-button" onClick={callAPI}>
                        Gửi
                      </button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <button className="cancel-button_">Gửi</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer style={{ zIndex: "99999999999" }} />
    </>
  );
};

export default PostButton;
