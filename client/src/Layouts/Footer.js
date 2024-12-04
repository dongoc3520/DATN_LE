// src/components/Footer.js
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Địa chỉ: 99 Phố Trương Định, Quận Hai Bà Trưng, Thành Phố Hà Nội</p>
          <p>Email: example@email.com</p>
          <p>Số điện thoại: 0123456789</p>
        </div>

        <div className="footer-section">
          <h4>Về chúng tôi</h4>
          <p>
            Chúng tôi cung cấp các dịch vụ cho thuê phòng trọ tiện lợi, giá rẻ
            và an ninh cho sinh viên và người đi làm.
          </p>
        </div>

        <div className="footer-section">
          <h4>Kết nối với chúng tôi</h4>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-facebook"></i> Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-twitter"></i> Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-instagram"></i> Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024, Phòng Trọ byLE HUST. Mọi quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;
