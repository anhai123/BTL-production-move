import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/auth";
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LogOut from "./Logout";
import EventBus from "../common/EventBus";
const Profile = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showDlppBoard, setShowDlppBoard] = useState(false);
  const [showCssxBoard, setShowCssxBoard] = useState(false);
  const [showTtbhBoard, setShowTtbhBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowAdminBoard(currentUser.vai_tro.includes("Ban điều hành"));
      setShowDlppBoard(currentUser.vai_tro.includes("Đại lý phân phối"));
      setShowCssxBoard(currentUser.vai_tro.includes("Cơ sở sản xuất"));
      setShowTtbhBoard(currentUser.vai_tro.includes("Trung tâm bảo hành"));
    } else {
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
      setShowDlppBoard(false);
      setShowTtbhBoard(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-black">
        <Link to={"/"} className="navbar-brand">
          BigCorp
        </Link>
        <div className="navbar-nav mr-auto">
          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Ban điều hành
              </Link>
            </li>
          )}
          {showDlppBoard && (
            <li className="nav-item">
              <Link to={"/dlpp"} className="nav-link">
                Đại lý phân phối
              </Link>
            </li>
          )}
          {showCssxBoard && (
            <li className="nav-item">
              <Link to={"/cssx"} className="nav-link">
                Cơ sở sản xuất
              </Link>
            </li>
          )}
          {showTtbhBoard && (
            <li className="nav-item">
              <Link to={"/ttbh"} className="nav-link">
                Trung tâm bảo hành
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username} Profile
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Log Out
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.email}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Id:</strong> {currentUser.id}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <strong>Authorities: </strong>
        {currentUser.vai_tro}
      </div>
    </>
  );
};

export default Profile;
