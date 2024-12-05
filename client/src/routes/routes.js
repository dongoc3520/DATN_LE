import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";

const publicRoutes = [
  { path: "/", Component: Home },
  { path: "/profile", Component: Profile },
];

export { publicRoutes };
