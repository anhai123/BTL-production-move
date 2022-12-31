import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BroadUser";
import BoardAdmin from "./components/BoardAdmin";
import BoardDlpp from "./components/BoardDlpp";
import BoardCssx from "./components/BoardCssx";
import BoardTtbh from "./components/BoardTtbh";
import { logout } from "./slices/auth";

import EventBus from "./common/EventBus";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user" element={<BoardUser />} />
        <Route path="/admin/*" element={<BoardAdmin />} />
        <Route path="/dlpp/*" element={<BoardDlpp />} />
        <Route path="/cssx/*" element={<BoardCssx />} />
        <Route path="/ttbh/*" element={<BoardTtbh />} />
      </Routes>
    </Router>
  );
};

export default App;
