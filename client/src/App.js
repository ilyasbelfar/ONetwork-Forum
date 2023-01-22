import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Home from "./pages/Home";
import Topic from "./pages/Topic";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NewTopic from "./pages/NewTopic";
import TopicsTab from "./components/Profile/Tabs/TopicsTab";
import CommentsTab from "./components/Profile/Tabs/CommentsTab";
import FollowingTab from "./components/Profile/Tabs/FollowingTab";
import FollowersTab from "./components/Profile/Tabs/FollowersTab";
import UpvotedTab from "./components/Profile/Tabs/UpvotedTab";
import EmailVerify from "./pages/EmailVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import "react-loading-skeleton/dist/skeleton.css";
import "./App.css";
import "./Responsive.css";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const App = () => {
  let isAuth = localStorage.getItem("isLoggedIn") ? true : false;
  const { isLoggedIn } = useSelector((state) => state.auth);

  return useMemo(() => {
    return (
      <Router>
        <Header />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route
            path="/register"
            element={isAuth ? <Navigate replace to="/" /> : <Register />}
          />
          <Route
            path="/login"
            element={isAuth ? <Navigate replace to="/" /> : <Login />}
          />
          <Route
            path="/verify-email"
            element={isAuth ? <Navigate replace to="/" /> : <EmailVerify />}
          />
          <Route
            path="/forgot-password"
            element={isAuth ? <Navigate replace to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={isAuth ? <Navigate replace to="/" /> : <ResetPassword />}
          />
          <Route index element={<Home />} />
          <Route path="/topics/:id/:slug" element={<Topic />} />
          <Route
            path="/topic/new"
            element={!isAuth ? <Navigate replace to="/login" /> : <NewTopic />}
          />
          <Route path="/user/:username" element={<Profile />}>
            <Route path="topics" element={<TopicsTab />} />
            <Route path="upvotes" element={<UpvotedTab />} />
            <Route path="comments" element={<CommentsTab />} />
            <Route path="following" element={<FollowingTab />} />
            <Route path="followers" element={<FollowersTab />} />
          </Route>
          <Route
            path="/user/:username/edit"
            element={
              !isAuth ? <Navigate replace to="/login" /> : <EditProfile />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
    // eslint-disable-next-line
  }, [isLoggedIn]);
};
export default App;
