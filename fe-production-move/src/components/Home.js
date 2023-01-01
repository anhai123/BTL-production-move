import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import UserService from "../services/user.service";
import Login from "./Login";
import Register from "./Register";
const Home = () => {
  const [content, setContent] = useState("");

  // useEffect(() => {
  //   UserService.getPublicContent().then(
  //     (response) => {
  //       setContent(response.data);
  //     },
  //     (error) => {
  //       const _content =
  //         (error.response && error.response.data) ||
  //         error.message ||
  //         error.toString();

  //       setContent(_content);
  //     }
  //   );
  // }, []);

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-black">
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/register"} className="nav-link">
              Sign up
            </Link>
          </li>
        </div>
      </nav>
    </div>
  );
};

export default Home;
