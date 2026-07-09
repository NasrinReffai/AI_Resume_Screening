import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import logo from "../assets/logo.png";

function Header({ name }) {
  const navigate = useNavigate();

  return (
    <header className="header">

      {/* Left */}
      <div className="header-left">
        <img
          src={logo}
          alt="CareerWeave AI"
          className="header-logo"
        />
      </div>

      {/* Center */}
      <div className="header-center">
        <div className="search-box">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search resumes, interviews, reports..."
          />
        </div>
      </div>

      {/* Right */}
      <div className="header-right">

        <button className="header-btn">
          <i className="bi bi-bell"></i>
        </button>

        <button
          className="profile-btn"
          onClick={() => navigate("/profile")}
        >
          <i className="bi bi-person-circle"></i>

          <span>{name || "Nasrin"}</span>

          <i className="bi bi-chevron-down"></i>
        </button>

      </div>

    </header>
  );
}

export default Header;