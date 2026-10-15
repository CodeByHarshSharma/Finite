import React from "react";
import "../global.css";
import 'remixicon/fonts/remixicon.css'
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.jsx";

const Nav = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="nav-bar">
      <p>Finite</p>

      <div className="nav-actions">
        <button
          onClick={() => navigate("/create-post")}
          className="button primary-button">
          <i className="ri-add-line"></i>
          New post
        </button>

        <button
          onClick={onLogout}
          className="button secondary-button">
          <i className="ri-logout-box-r-line"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Nav;