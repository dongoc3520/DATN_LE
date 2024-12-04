import "./mPost.css";

function MPost() {
  return (
    <>
      <div className="homePage_post">
        <div className="homePage_post_img">
          <img src="https://ecogreen-saigon.vn/uploads/phong-tro-la-loai-hinh-nha-o-pho-bien-gia-re-tien-loi-cho-sinh-vien-va-nguoi-di-lam.png"></img>
        </div>
        <div className="homePage_post_cnt">
          <h3 className="homePage_post_title">
            Chính chủ cho thuê căn hộ số 10 ngõ 16 hàng cháo Hà Nội
          </h3>
          <div className="homePage_post_price">3.5 Triệu/tháng 20m2</div>
          <div className="homePage_post_quan">Quận Đống Đa</div>
          <div className="homePage_post_user">
            <div className="home_post_user_img">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOHiqTAWd0BsULGqcC17UaeOOSYAllzeyLWw&s"
                alt=""
              />
            </div>
            <div>Lê Thu Hương</div>
            <div className="home_post_heart">
              <i class="fa-regular fa-heart"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MPost;
