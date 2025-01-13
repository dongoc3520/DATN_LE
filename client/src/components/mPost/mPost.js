import "./mPost.css";
import { Tooltip } from "react-tooltip";

function MPost({ post }) {
  //console.log("log ne", post);
  return (
    <>
      <div className="homePage_post">
        <div className="homePage_post_img">
          <img src={post.image}></img>
        </div>
        <div className="homePage_post_cnt">
          <h3 className="homePage_post_title">{post.Title}</h3>
          <div className="homePage_post_price">
            {post.Price} VNĐ/tháng {post.Area}m2
          </div>
          <div className="homePage_post_quan">
            {post.Address} - {post.Ward} - {post.District}
          </div>
          <div className="homePage_post_user">
            <div className="home_post_user_img">
              <img src={post.user.avatar} alt="" />
            </div>
            <div>{post.user.name}</div>
            <div className="home_post_heart" style={{ fontSize: "30px" }}>
              {post.Type === "oghep" ? (
                <>
                  {post.Gender === "nu" ? (
                    <>
                      <i
                        class="fa-solid fa-venus he"
                        data-tooltip-id="nu"
                        data-tooltip-content="Nữ"
                      ></i>
                    </>
                  ) : (
                    <>
                      <i
                        class="fa-solid fa-mars he"
                        data-tooltip-id="nam"
                        data-tooltip-content="Nam"
                      ></i>
                    </>
                  )}
                  {post.Work === "kithuat" && (
                    <>
                      <i
                        class="fa-solid fa-microchip hu"
                        data-tooltip-id="kt"
                        data-tooltip-content="Kĩ Thuật"
                      ></i>
                    </>
                  )}

                  {post.Work === "vanphong" && (
                    <>
                      <i
                        class="fa-solid fa-business-time hu"
                        data-tooltip-id="vp"
                        data-tooltip-content="Văn Phòng"
                      ></i>
                    </>
                  )}
                  {post.Work === "sinhvien" && (
                    <>
                      <i
                        class="fa-solid fa-graduation-cap hu"
                        data-tooltip-id="sv"
                        data-tooltip-content="Sinh Viên"
                      ></i>
                    </>
                  )}
                  {post.Age > 0 && (
                    <>
                      <i
                        class="fa-regular hi"
                        data-tooltip-id="t"
                        data-tooltip-content="Tuổi"
                      >
                        {post.Age}
                      </i>
                    </>
                  )}

                  <Tooltip
                    id="nam"
                    place="right"
                    style={{ color: "#ddd", zIndex: "9999" }}
                  />
                  <Tooltip
                    id="nu"
                    place="right"
                    style={{ color: "#ddd", zIndex: "9999" }}
                  />
                  <Tooltip
                    id="vp"
                    place="left"
                    style={{ color: "#ddd", zIndex: "9999" }}
                  />
                  <Tooltip
                    id="kt"
                    place="left"
                    style={{ color: "#ddd", zIndex: "9999" }}
                  />
                  <Tooltip
                    id="sv"
                    place="left"
                    style={{ color: "#ddd", zIndex: "9999" }}
                  />
                  <Tooltip
                    id="t"
                    place="left"
                    style={{ color: "#ddd", zIndex: "9999" }}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MPost;
