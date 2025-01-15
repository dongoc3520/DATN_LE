import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "../../components/PostCard/PostCard";
import "./Manager.css";
import { useParams, useNavigate } from "react-router-dom";
import { url } from "../../url";
const ManagePosts = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [mockPosts, setMockPosts] = useState([]);
  const validIds = [1, 2, 3]; // Danh sách id hợp lệ
  const postId = validIds.includes(Number(id)) ? Number(id) : 1;
  // console.log("id",postId);
  if (postId !== Number(id)) {
    navigate(`/dashboard/${postId}`);
  }

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${url}/post/gettype/${postId}`);
      if (res.data.errCode === 0) {
        setMockPosts([...res.data.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const [childData, setChildData] = useState(false);
  const handleBla = () => {
    setChildData(!childData);
  };
  useEffect(() => {
    fetchPost();
  }, [postId, childData]);

  const [search, setSearch] = useState("");

  // Filter posts based on search input
  const filteredPosts = mockPosts.filter((post) =>
    post.Title.toLowerCase().includes(search.toLowerCase())
  );
  console.log(filteredPosts);
  return (
    <div className="manage-posts">
      <h2 style={{ color: "#1773ea" }}>
        Quản lý bài đăng
        {id === "2" && <> chung cư mini</>}
        {id === "1" && <> căn hộ</>}
        {id === "3" && <> ở ghép</>}
      </h2>
      <input
        type="text"
        placeholder="Tìm kiếm bài đăng..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />
      <div className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDataChange={handleBla}
              // onDelete={(id) => alert(`Delete post with ID: ${id}`)} // Dummy delete action
            />
          ))
        ) : (
          <p>Không tìm thấy bài viết. </p>
        )}
      </div>
    </div>
  );
};

export default ManagePosts;
