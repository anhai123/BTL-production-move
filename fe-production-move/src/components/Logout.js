import React, { useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/auth";
const LogOut = () => {
  const dispatch = useDispatch();
  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <>
      <li className="nav-item">
        <a href="/login" className="nav-link" onClick={logOut}>
          LogOut
        </a>
      </li>
    </>
  );
};

export default LogOut;
