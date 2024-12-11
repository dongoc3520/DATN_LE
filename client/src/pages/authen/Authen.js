import "./Authen.css";
import axios from "axios";
import { setCookie } from "../../Cookie";
import { url } from "../../url";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Authen() {
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
    role: "1",
    work: "1",
  });
  const [chLogin, setchLogin] = useState(true);
  const handleLogin = () => {
    if (!lg.userName || !lg.pass) {
      alert("Cần điền đủ thông tin");
      return;
    }
    axios
      .post(`${url}/user/login`, lg) // Thay thế URL bằng URL của API bạn
      .then((response) => {
        // Xử lý phản hồi từ API
        console.log("Đăng nhập thành công:", response.data);
        if (response.data.errCode === 0) {
          setLg({
            userName: "",
            pass: "",
          });
          toast.success(response.data.message);
          setCookie("token", response.data.token, 30);
          setCookie("idUser", response.data.idUser, 30);
          window.location.reload();
        } else {
          toast.warning(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi đăng nhập:", err);
        toast.error("Đăng nhập thất bại");
      });
    console.log(lg);
  };
  const handleRegister = () => {
    if (reg.rePass !== reg.pass) {
      setReg({
        name: "",
        userName: "",
        pass: "",
        age: "",
        rePass: "",
        role: "1",
        work: "1",
      });
      alert("Mật khẩu không khớp");
    } else if (
      !reg.name ||
      !reg.userName ||
      !reg.pass ||
      !reg.rePass ||
      !reg.age
    ) {
      alert("Cần nhập đủ thông tin");
    } else if (reg.pass.length < 6) {
      alert("Password phải có ít nhất 6 phần tử");
    } else if (reg.userName.length < 6) {
      alert("userName phải có ít nhất 6 phần tử");
    } else {
      axios
        .post(`${url}/user/register`, reg) // Thay thế URL bằng URL của API bạn
        .then((response) => {
          // Xử lý phản hồi từ API
          console.log("Đăng nhập thành công:", response.data);
          if (response.data.errCode === 0) {
            setReg({
              name: "",
              userName: "",
              pass: "",
              age: "",
              rePass: "",
              role: "1",
              work: "1",
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
          <div class="login">
            <h1 style={{ paddingBottom: "20px" }}>Đăng Ký</h1>

            <div>
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
              <div>
                {/* <label style = {{color : '#ddd'}} for="cars">Bạn đang là</label> */}
                <select
                  name="work"
                  id="work"
                  value={reg.work}
                  onChange={handleChange}
                >
                  <option value="1">Sinh Viên</option>
                  <option value="2">Nhân viên kỹ thuật</option>
                  <option value="3">Nhân viên văn phòng</option>
                </select>
              </div>
              <div>
                {/* <label style = {{color : '#ddd'}} for="cars">Bạn đang là</label> */}
                <select
                  name="role"
                  id="role"
                  value={reg.role}
                  onChange={handleChange}
                >
                  <option value="1">Người thuê</option>
                  <option value="2">Chủ cho thuê</option>
                </select>
              </div>

              <button className="btnLogin" onClick={handleRegister}>
                Đăng ký
              </button>
              <div onClick={handleState} className="registerNow">
                Đăng nhập ngay
              </div>
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default Authen;
