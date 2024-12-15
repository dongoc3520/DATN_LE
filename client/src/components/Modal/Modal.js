import React, { useState } from "react";
import "./Modal.css";
import { url } from "../../url";
import axios from "axios";
import { toast } from "react-toastify";
const Modal = ({ type, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
  });
  const [username, setUsername] = useState({
    oldUsername: "",
    newUsername: "",
    renewUsername: "",
  });
  const [pass, setPass] = useState({
    oldPass: "",
    newPass: "",
    renewPass: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "age" && !/^\d*$/.test(value)) {
      alert("Tuổi chỉ có thể là số");
      return; // Không cập nhật trạng thái nếu không phải số
    }
    setFormData({ ...formData, [name]: value });
  };
  const handleInputChange1 = (e) => {
    const { name, value } = e.target;

    setUsername({ ...username, [name]: value });
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    if (type === "password" && !/^\d*$/.test(value)) {
      alert("Mật khẩu chỉ được phép chứa số! và có ít nhất 6 phần tử");
      return;
    }
    setPass({ ...pass, [name]: value });
  };

  const handleSave = async () => {
    if (type === "info") {
      if (formData.name === profile.name && formData.age === profile.age) {
        toast.warning("Bạn cần thay đổi thông tin");
      } else {
        await axios
          .post(`${url}/user/infor`, formData, { withCredentials: true })
          .then((res) => {
            if (res.data.errCode === 0) {
              toast.success("Update thành công!");
            }
          })
          .catch((err) => {
            console.log(err);
          });
        onSave();
      }
    } else if (type === "username") {
      console.log(username);
      if (username.newUsername.length < 6) {
        toast.warning("Username cần ít nhất 6 phần tử");
        return;
      }
      if (
        !username.oldUsername ||
        !username.newUsername ||
        !username.renewUsername
      ) {
        toast.warning("Cần điền đủ thông tin!");
      } else if (username.newUsername === username.renewUsername) {
        await axios
          .post(`${url}/user/changeUsername`, username, {
            withCredentials: true,
          })
          .then((res) => {
            console.log(res);
            if (res.data.errCode === 0) {
              toast.success("Đổi tên đăng nhập thành công!");
              onSave();
            } else if (res.data.errCode === 1) {
              console.log("hehe");
              toast.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        toast.warning("Xác thực lại username không đúng!");
        setUsername({
          ...username,
          newUsername: "",
          renewUsername: "",
        });
      }
    } else if (type === "password") {
      if (pass.newPass.length < 6) {
        toast.warning("Username cần ít nhất 6 phần tử");
        return;
      }
      if (!pass.oldPass || !pass.newPass || !pass.renewPass) {
        toast.warning("Cần điền đủ thông tin!");
      } else if (pass.newPass === pass.renewPass) {
        await axios
          .post(`${url}/user/changePassword`, pass, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.errCode === 0) {
              toast.success("Đổi mật khẩu thành công!");
              onSave();
            } else if (res.data.errCode === 1) {
              toast.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        toast.warning("Xác thực lại password không đúng!");
        setUsername({
          ...pass,
          newPass: "",
          renewPass: "",
        });
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {type === "info" && (
          <div className="modal-form">
            <label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên mới"
              />
            </label>
            <label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Nhập tuổi mới"
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
              name="oldPass"
              value={pass.oldPass}
              onChange={handleInputChange2}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="modal-input"
              name="newPass"
              value={pass.newPass}
              onChange={handleInputChange2}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="modal-input"
              name="renewPass"
              value={pass.renewPass}
              onChange={handleInputChange2}
            />
          </>
        )}

        {type === "username" && (
          <>
            <input
              type="username"
              name="oldUsername"
              value={username.oldUsername}
              placeholder="Username hiện tại"
              className="modal-input"
              onChange={handleInputChange1}
            />
            <input
              type="username"
              name="newUsername"
              value={username.newUsername}
              placeholder="Username mới"
              className="modal-input"
              onChange={handleInputChange1}
            />
            <input
              type="username"
              name="renewUsername"
              value={username.renewUsername}
              placeholder="Username mới"
              className="modal-input"
              onChange={handleInputChange1}
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
