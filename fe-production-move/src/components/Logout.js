import React, { useCallback } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/auth";
const LogOut = () => {
  const dispatch = useDispatch();
  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <>
      <Link to={"/login"} onClick={logOut} className="nav-link">
        Log Out
      </Link>
    </>
  );
};

export default LogOut;
