import "./Home.css";
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Range } from "react-range";
import MPost from "../../components/mPost/mPost";

const leaderboardData = [
  {
    rank: "Thứ nhất",
    name: "Nguyễn Văn A",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    likes: 1500,
  },
  {
    rank: "Thứ nhì",
    name: "Trần Thị B",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    likes: 1200,
  },
  {
    rank: "Thứ ba",
    name: "Lê Quang C",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    likes: 1000,
  },

];

function Home() {
  
  const data = [
    {
      label: "Hà Nội",
      options: [
        { value: "Ba Dinh", label: "Ba Đình" },
        { value: "Hoan Kiem", label: "Hoàn Kiếm" },
        { value: "Dong Da", label: "Đống Đa" },
        { value: "Hai Ba Trung", label: "Hai Bà Trưng" },
      ],
    },
    {
      label: "TP Hồ Chí Minh",
      options: [
        { value: "District 1", label: "Quận 1" },
        { value: "District 3", label: "Quận 3" },
        { value: "Tan Binh", label: "Tân Bình" },
        { value: "Phu Nhuan", label: "Phú Nhuận" },
      ],
    },
    {
      label: "Đà Nẵng",
      options: [
        { value: "Hai Chau", label: "Hải Châu" },
        { value: "Thanh Khe", label: "Thanh Khê" },
        { value: "Son Tra", label: "Sơn Trà" },
        { value: "Ngu Hanh Son", label: "Ngũ Hành Sơn" },
      ],
    },
  ];

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [priceRange, setPriceRange] = useState([1, 10]);
  const [areaRange, setAreaRange] = useState([20, 100]);
  const [showPriceSlider, setShowPriceSlider] = useState(false);
  const [showAreaSlider, setShowAreaSlider] = useState(false);

  const priceInputRef = useRef(null);
  const areaInputRef = useRef(null);

  const handlePriceInputFocus = () => {
    setShowPriceSlider(!showPriceSlider);
  };

  const handleAreaInputFocus = () => {
    setShowAreaSlider(!showAreaSlider);
  };

  const handleChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  // Hàm đóng slider khi mất focus
  const handleBlur = (inputType) => {
    // setTimeout(() => {
    //   if (inputType === "price") {
    //     setShowPriceSlider(false);
    //   } else if (inputType === "area") {
    //     setShowAreaSlider(false);
    //   }
    // }, 100);
  };

  return (
    <div className="homePage">
      <div className="homePage_search">
        {/* Chọn Thành phố hoặc Huyện */}
        <div className="location-selector">
          <label htmlFor="area-input" className="filter-label">
            <i class="fa-solid fa-location-dot"></i> Địa điểm:
          </label>
          <Select
            id="location"
            options={data}
            value={selectedLocation}
            onChange={handleChange}
            placeholder="-- Chọn Thành phố hoặc Huyện --"
            className="location-selector__input"
          />
        </div>
        {/* Chọn khoảng giá */}
        <div className="filter-group">
          <label htmlFor="price-input" className="filter-label">
            <i class="fa-solid fa-money-check-dollar"></i>
            Khoảng giá
          </label>
          <input
            ref={priceInputRef}
            id="price-input"
            type="text"
            className="filter-input"
            value={`${priceRange[0]} - ${priceRange[1]} triệu`}
            readOnly
            onFocus={handlePriceInputFocus}
            onBlur={() => handleBlur("price")}
          />
          {showPriceSlider && (
            <div className="slider-container">
              <Range
                step={1}
                min={1}
                max={20}
                values={priceRange}
                onChange={(values) => setPriceRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      height: "6px",
                      background: "linear-gradient(to right, #007BFF, #82B1FF)",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#007BFF",
                    }}
                  />
                )}
              />
              <div className="slider-labels">
                <span>{priceRange[0]} triệu</span>
                <span>{priceRange[1]} triệu</span>
              </div>
            </div>
          )}
        </div>
        {/* Chọn diện tích */}
        <div className="filter-group">
          <label htmlFor="area-input" className="filter-label">
            <i class="fa-solid fa-chart-area"></i>
            Diện tích:
          </label>
          <input
            ref={areaInputRef}
            id="area-input"
            type="text"
            className="filter-input"
            value={`${areaRange[0]} - ${areaRange[1]} m²`}
            readOnly
            onFocus={handleAreaInputFocus}
            onBlur={() => handleBlur("area")}
          />
          {showAreaSlider && (
            <div className="slider-container">
              <Range
                step={5}
                min={10}
                max={200}
                values={areaRange}
                onChange={(values) => setAreaRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      height: "6px",
                      background: "linear-gradient(to right, #28A745, #85D18F)",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#28A745",
                    }}
                  />
                )}
              />
              <div className="slider-labels">
                <span>{areaRange[0]} m²</span>
                <span>{areaRange[1]} m²</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <button className="homePage_btn">
            <i class="fa-solid fa-magnifying-glass"></i>
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="homePage_body">
        <div className="homePage_body_content">
          <MPost />
          <MPost />
          <MPost />
          <MPost />
          <MPost />
          <MPost />
          <MPost />
          <MPost />
        </div>
        <div className="homePage_body_goiy">
          <div className="moigioi">Top 3 môi giới chuyên nghiệp</div>
          <div className="leaderboard">
            {leaderboardData.map((user, index) => (
              <div className="leaderboard-item" key={index}>
                <div className="leaderboard-rank">
                  <i class="fa-solid fa-crown" style={{ color: "#a8c12b" }}></i>
                </div>
                <div className="leaderboard-user-info">
                  <div className="leaderboard-user-img">
                    <img src={user.image} alt={user.name} />
                  </div>
                  <div className="leaderboard-user-details">
                    <div className="leaderboard-user-name">{user.name}</div>
                    <div className="leaderboard-likes">
                      {user.likes}{" "}
                      <i class="fa-solid fa-heart" style={{ color: "red" }}></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
