import Home from "../pages/Home/Home";
import Post from "../pages/Post/Post";
import Profile from "../pages/Profile/Profile";

const publicRoutes = [
  { path: "/:id", Component: Home },
  { path: "/profile/:id", Component: Profile },
  { path: "/post/:id", Component: Post },
];

export { publicRoutes };
