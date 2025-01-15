import Home from "../pages/Home/Home";
import Post from "../pages/Post/Post";
import Profile from "../pages/Profile/Profile";
import Manager from "../pages/Manager/Manager";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";


const publicRoutes = [
  { path: "/:id", Component: Home },
  { path: "/profile/:id", Component: Profile },
  { path: "/post/:id", Component: Post },
  { path: "/dashboard/:id", Component: Manager },

  // <Route path="*" element={<NotFound />} />,
];

export { publicRoutes };
