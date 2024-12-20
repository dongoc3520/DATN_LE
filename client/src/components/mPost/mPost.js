import "./mPost.css";

function MPost({ post }) {
  // console.log(post);
  return (
    <>
      <div className="homePage_post">
        <div className="homePage_post_img">
          <img src={post.image}></img>
        </div>
        <div className="homePage_post_cnt">
          <h3 className="homePage_post_title">{post.Title}</h3>
          <div className="homePage_post_price">{post.Price} VNĐ/tháng {post.Area}m2</div>
          <div className="homePage_post_quan">
            {post.Address} - {post.Ward} - {post.District}
          </div>
          <div className="homePage_post_user">
            <div className="home_post_user_img">
              <img
                src={post.user.avatar}
                alt=""
              />
            </div>
            <div>{post.user.name}</div>
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
