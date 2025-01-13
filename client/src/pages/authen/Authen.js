// eslint-disable-next-line no-unused-vars
import "./Authen.css";
import axios from "axios";
import { setCookie } from "../../Cookie";
import { url } from "../../url";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Authen() {
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
  const [lg, setLg] = useState({
    userName: "",
    pass: "",
  });
  const [reg, setReg] = useState({
    name: "",
    userName: "",
    pass: "",
    age: "",
    rePass: "",
    role: "2",
    work: "kithuat",
    selectedTags: [],
    phone: "",
    email: "",
    gender: "nam",
  });
  // eslint-disable-next-line no-unused-vars
  const [isV, setIsV] = useState(true);
  const [chLogin, setchLogin] = useState(true);
  const handleTagClick = (tag) => {
    // Nếu đã đủ 3 thẻ thì không cho thêm
    if (reg.selectedTags.length >= 3) return;

    // Kiểm tra nếu thẻ chưa tồn tại thì thêm vào
    if (!reg.selectedTags.includes(tag)) {
      setReg({
        ...reg,
        selectedTags: [...reg.selectedTags, tag],
      });
    }
  };

  const handleRemoveTag = (tag) => {
    setReg({
      ...reg,
      selectedTags: reg.selectedTags.filter((item) => item !== tag),
    });
  };
  const handleLogin = () => {
    if (!lg.userName || !lg.pass) {
      alert("Cần điền đủ thông tin");
      return;
    }
    axios
      .post(`${url}/user/login`, lg) // Thay thế URL bằng URL của API bạn
      .then((response) => {
        // Xử lý phản hồi từ API
        // console.log("Đăng nhập thành công:", response.data);
        if (response.data.errCode === 0) {
          setLg({
            userName: "",
            pass: "",
          });
          console.log(response.data);
          toast.success(response.data.message);
          setCookie("token", response.data.token, 30);
          setCookie("idUser", response.data.idUser, 30);
          setCookie("avatarU", response.data.avatar, 30);

          // window.location.reload();
          window.location.href = "/1";
        } else {
          toast.warning(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi đăng nhập:", err);
        toast.error("Đăng nhập thất bại");
      });
    // console.log(lg);
  };
  const handleRegister = () => {
    // console.log(reg);
    if (reg.rePass !== reg.pass) {
      setReg({
        name: "",
        userName: "",
        pass: "",
        age: "",
        rePass: "",
        role: "2",
        work: "kithuat",
        phone: "",
        email: "",
        gender: "nam",
        selectedTags: [],
      });
      alert("Mật khẩu không khớp");
    } else if (
      !reg.name ||
      !reg.userName ||
      !reg.pass ||
      !reg.rePass ||
      !reg.age ||
      !reg.gender
    ) {
      console.log("hixxx");
      alert("Cần nhập đủ thông tin");
      return;
    } else if (reg.selectedTags.length < 3 && reg.role === "1") {
      console.log("hixxx1");
      alert("Cần nhập đủ thông tin");
      return;
    } else if (reg.pass.length < 6) {
      alert("Password phải có ít nhất 6 phần tử");
      return;
    } else if (reg.userName.length < 6) {
      alert("userName phải có ít nhất 6 phần tử");
    } else {
      axios
        .post(`${url}/user/register`, reg) // Thay thế URL bằng URL của API bạn
        .then((response) => {
          // Xử lý phản hồi từ API
          // console.log("Đăng nhập thành công:", response.data);
          if (response.data.errCode === 0) {
            setReg({
              name: "",
              userName: "",
              pass: "",
              age: "",
              rePass: "",
              role: "2",
              work: "kithuat",
              phone: "",
              email: "",
              gender: "nam",
              selectedTags: [],
            });
            toast.success("Đăng ký thành công!");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi đăng nhập:", err);
        });
    }
  };
  const handleState = () => {
    setchLogin(!chLogin);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "pass" && !/^\d*$/.test(value)) {
      alert("Mật khẩu chỉ được phép chứa số! và có ít nhất 6 phần tử");
      return; // Không cập nhật trạng thái nếu không phải số
    }
    if (name === "age" && !/^\d*$/.test(value)) {
      alert("Tuổi chỉ có thể là số");
      return; // Không cập nhật trạng thái nếu không phải số
    }
    if (name === "phone" && !/^\d*$/.test(value)) {
      alert("Số điện thoại chỉ có thể là số");
      return; // Không cập nhật trạng thái nếu không phải số
    }
    setReg((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLg((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div>
      <div>
        {chLogin ? (
          <>
            <div class="login">
              <h1 style={{ paddingBottom: "20px" }}>Đăng Nhập</h1>

              <div>
                <input
                  className="input_au"
                  type="text"
                  name="userName"
                  value={lg.userName}
                  placeholder="Tên đăng nhập"
                  required="required"
                  onChange={handleLoginChange}
                />
                <input
                  className="input_au"
                  type="password"
                  name="pass"
                  value={lg.pass}
                  onChange={handleLoginChange}
                  placeholder="Mật khẩu"
                  required="required"
                />
                <button className="btnLogin" onClick={handleLogin}>
                  Đăng Nhập
                </button>
                <div onClick={handleState} className="registerNow">
                  Đăng ký ngay
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              class="login"
              style={{
                top: reg.role === "1" ? "18%" : "30%",
                width: "460px",
                left: "20%",
              }}
            >
              <h1 style={{ paddingBottom: "20px" }}>Đăng Ký</h1>

              <div
                onSubmit={(e) => {
                  e.preventDefault(); // Ngăn chặn reload trang
                  handleLogin(); // Gọi hàm login
                }}
              >
                <input
                  className="input_au"
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  required="required"
                  value={reg.name}
                  onChange={handleChange}
                />
                <input
                  className="input_au"
                  type="text"
                  name="userName"
                  placeholder="Tên đăng nhập"
                  required="required"
                  value={reg.userName}
                  onChange={handleChange}
                />
                <input
                  className="input_au"
                  type="text"
                  name="age"
                  placeholder="Tuổi"
                  required="required"
                  value={reg.age}
                  onChange={handleChange}
                />
                <input
                  className="input_au"
                  type="text"
                  name="email"
                  placeholder="Email"
                  required="required"
                  value={reg.email}
                  onChange={handleChange}
                />
                <input
                  className="input_au"
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  required="required"
                  value={reg.phone}
                  onChange={handleChange}
                />
                <input
                  className="input_au"
                  type="password"
                  name="pass"
                  placeholder="Mật khẩu"
                  required="required"
                  value={reg.pass}
                  onChange={handleChange}
                />
                <input
                  className="input_au"
                  type="password"
                  name="rePass"
                  placeholder="Nhập lại mật khẩu"
                  required="required"
                  value={reg.rePass}
                  onChange={handleChange}
                />
                <div style={{ display: "flex", gap: "16px" }}>
                  {/* <label style = {{color : '#ddd'}} for="cars">Bạn đang là</label> */}
                  <select
                    name="work"
                    id="work"
                    value={reg.work}
                    onChange={handleChange}
                    style={{ maxWidth: "100%", color: "#333 !important" }}
                  >
                    <option value="sinhvien">Sinh Viên</option>
                    <option value="kithuat">Nhân viên kỹ thuật</option>
                    <option value="vanphong">Nhân viên văn phòng</option>
                  </select>
                  <select
                    name="gender"
                    id="gender"
                    value={reg.gender}
                    onChange={handleChange}
                    style={{ maxWidth: "100%", color: "#333" }}
                  >
                    <option value="nam">Nam</option>
                    <option value="nu">Nữ</option>
                  </select>
                </div>
                <div>
                  {/* <label style = {{color : '#ddd'}} for="cars">Bạn đang là</label> */}
                  <select
                    name="role"
                    id="role"
                    value={reg.role}
                    onChange={handleChange}
                    style={{ maxWidth: "100%", color: "#333 !important" }}
                  >
                    <option value="1">Người thuê</option>
                    <option value="2">Chủ cho thuê</option>
                  </select>
                </div>
                {reg.role === "1" ? (
                  <div className="sub_tag">
                    {/* Hiển thị các tag đã chọn */}
                    <div
                      className="selected-tags"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                    >
                      {reg.selectedTags.map((tag, index) => (
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
                            reg.selectedTags.includes(tag) ? "tag-selected" : ""
                          }`}
                          style={{
                            backgroundColor: "#374c6f",
                            textAlign: "center",
                          }}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>

                    {/* Hiển thị cảnh báo nếu đạt giới hạn */}
                    {reg.selectedTags.length < 3 && (
                      <p className="warning">Bạn chọn 3 sở thích.</p>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                <button
                  className="btnLogin"
                  onClick={handleRegister}
                  style={{ marginTop: "10px" }}
                >
                  Đăng ký
                </button>
                <div onClick={handleState} className="registerNow">
                  Đăng nhập ngay
                </div>
              </div>
            </div>
          </>
        )}
        <div className="imgright">
          <img src="https://img.pikbest.com/png-images/qiantu/vector-illustration-of-a-cartoon-interior-of-a-cozy-interior-living-room_2682766.png!bw700" />
        </div>
      </div>
      <ToastContainer />
      <p className="textlinhtinh">
        Website tìm kiếm phòng trọ đỉnh nhất Vịnh Bắc Bộ. Với 1000+ bài đăng mỗi
        ngày. <br />
        Liên hệ ngay 0123456789
      </p>
    </div>
  );
}

export default Authen;
