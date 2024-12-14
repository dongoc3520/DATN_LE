import "./Home.css";
import React, { useState, useEffect } from "react";
import Select from "react-select";

import MPost from "../../components/mPost/mPost";
import quancao from "../../img/websitept.png";
import { useParams } from "react-router-dom";
import { wardsData, data } from "../../data";

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
  const [mData, setMData] = useState({
    district: "",
    ward: "",
    price: "",
    area: "",
  });
  const handleSubmit = () => {
    if (!mData.district || !mData.ward || !mData.price || !mData.area) {
      alert("Vui lòng nhập đủ dữ kiện trước khi tìm");
      return;
    }
    console.log(mData);
  };
  const handleSetData = (field, value) => {
    setMData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const { id } = useParams();
  const options = [
    { id: 1, label: "Dưới 2 triệu", value: "under-2m" },
    { id: 2, label: "2 - 3 triệu", value: "2-3m" },
    { id: 3, label: "3 - 4 triệu", value: "3-4m" },
    { id: 4, label: "4 - 5 triệu", value: "4-5m" },
    { id: 5, label: "Trên 5 triệu", value: "5m" },
  ];

  const options2 = [
    { id: 1, label: "Dưới 20 m2", value: "20m2" },
    { id: 2, label: "20 - 30 m3", value: "30m2" },
    { id: 3, label: "30 - 40 m2", value: "40m2" },
    { id: 4, label: "Trên 40 m2", value: "50m2" },
  ];
  const priceOptions = [
    {
      label: "Khoảng giá",
      options: [
        { value: "1-5", label: "Dưới 5 triệu" },
        { value: "5-10", label: "5 - 10 triệu" },
        { value: "10-15", label: "10 - 15 triệu" },
        { value: "15-20", label: "15 - 20 triệu" },
      ],
    },
  ];
  const areaOptions = [
    {
      label: "Diện tích",
      options: [
        { value: "10-50", label: "Dưới 50 m²" },
        { value: "50-100", label: "50 - 100 m²" },
        { value: "100-150", label: "100 - 150 m²" },
        { value: "150-200", label: "150 - 200 m²" },
      ],
    },
  ];
  // const data = [
  //   {
  //     label: "Hà Nội",
  //     options: [
  //       { value: "BaDinh", label: "Ba Đình" },
  //       { value: "Hoan Kiem", label: "Bắc Từ liêm" },
  //       { value: "Dong Da", label: "Đống Đa" },
  //       { value: "Hai Ba Trung", label: "Hai Bà Trưng" },
  //     ],
  //   },
  //   {
  //     label: "TP Hồ Chí Minh",
  //     options: [
  //       { value: "District 1", label: "Quận 1" },
  //       { value: "District 3", label: "Quận 3" },
  //       { value: "Tan Binh", label: "Tân Bình" },
  //       { value: "Phu Nhuan", label: "Phú Nhuận" },
  //     ],
  //   },
  // ];
  // const wardsData = {
  //   BaDinh: [
  //     { value: "PhucXa", label: "Phúc Xá" },
  //     { value: "NguyenTrungTruc", label: "Nguyễn Trung Trực" },
  //   ],
  //   HoanKiem: [
  //     { value: "HangBac", label: "Hàng Bạc" },
  //     { value: "HangDao", label: "Hàng Đào" },
  //   ],
  //   District1: [
  //     { value: "BenNghe", label: "Bến Nghé" },
  //     { value: "DaKao", label: "Đa Kao" },
  //   ],
  //   TanBinh: [
  //     { value: "Ward1", label: "Phường 1" },
  //     { value: "Ward2", label: "Phường 2" },
  //   ],
  // };
  const [isView, setIsView] = useState(true);

  const handleCancel = () => {
    setIsView(false);
  };

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    handleSetData("district", selectedOption.value);
    setSelectedWard(null);
  };

  const handleWardChange = (selectedOption) => {
    setSelectedWard(selectedOption);
    handleSetData("ward", selectedOption.value);
  };

  const getWardsOptions = () => {
    if (!selectedDistrict) return [];
    return wardsData[selectedDistrict.value] || [];
  };

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const handlePriceChange = (selectedOption) => {
    setSelectedPrice(selectedOption);
    handleSetData("price", selectedOption.value);
  };

  const handleAreaChange = (selectedOption) => {
    setSelectedArea(selectedOption);
    handleSetData("area", selectedOption.value);
  };

  return (
    <div className="homePage">
      <div className="homePage_search">
        {/* Chọn Thành phố hoặc Huyện */}

        <div className="location-selector">
          <label htmlFor="district-input" className="filter-label">
            <i className="fa-solid fa-location-dot"></i> Huyện:
          </label>
          <Select
            id="district"
            options={[
              { label: "Hà Nội", options: data[0].options },
              { label: "TP Hồ Chí Minh", options: data[1].options },
            ]}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="-- Chọn Huyện --"
            className="location-selector__input"
          />
        </div>

        {selectedDistrict && (
          <div className="location-selector">
            <label htmlFor="ward-input" className="filter-label">
              <i className="fa-solid fa-location-dot"></i> Phường:
            </label>
            <Select
              id="ward"
              options={getWardsOptions()}
              value={selectedWard}
              onChange={handleWardChange}
              placeholder="-- Chọn Phường --"
              className="location-selector__input"
            />
          </div>
        )}

        {/* Chọn khoảng giá */}
        <div className="filter-group">
          <label htmlFor="price-input" className="filter-label">
            <i className="fa-solid fa-money-check-dollar"></i>
            Khoảng giá
          </label>
          <Select
            id="price-selector"
            options={priceOptions}
            value={selectedPrice}
            onChange={handlePriceChange}
            placeholder="-- Chọn khoảng giá --"
            className="filter-input"
          />
        </div>

        {/* Chọn diện tích */}
        <div className="filter-group">
          <label htmlFor="area-input" className="filter-label">
            <i className="fa-solid fa-chart-area"></i>
            Diện tích
          </label>
          <Select
            id="area-selector"
            options={areaOptions}
            value={selectedArea}
            onChange={handleAreaChange}
            placeholder="-- Chọn diện tích --"
            className="filter-input"
          />
        </div>
        <div>
          <button className="homePage_btn" onClick={handleSubmit}>
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
          <div className="moigioi">Xem theo khoảng giá</div>
          <div className="btn_choose">
            {options.map((option) => (
              <>
                {/* <label>
                  <i class="fa-solid fa-angle-right"></i>
                </label> */}
                <div
                  key={option.id}
                  className="card"
                  // onClick={}
                >
                  <i class="fa-solid fa-angle-right"></i>
                  {option.label}
                </div>
              </>
            ))}
          </div>
          <div className="moigioi">Xem theo diện tích</div>
          <div className="btn_choose">
            {options2.map((option) => (
              <>
                {/* <label>
                  <i class="fa-solid fa-angle-right"></i>
                </label> */}
                <div
                  key={option.id}
                  className="card"
                  // onClick={}
                >
                  <i class="fa-solid fa-angle-right"></i>
                  {option.label}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
      {isView ? (
        <>
          <div className="quangcao">
            <div className="cancel_quancao" onClick={handleCancel}>
              <i class="fa-solid fa-xmark"></i>
            </div>
            <img src={quancao} alt="Shenlik Tech Logo" />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Home;
