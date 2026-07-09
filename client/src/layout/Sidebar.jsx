import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import logo from "../assets/logo5.png";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        className="toggle-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i
          className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}
        ></i>
      </button>

      <div>
        <div className="logo-section">
          <img
            src={logo}
            alt="CareerWeave AI"
            className="sidebar-logo"
          />

          {!collapsed && (
            <p className="logo-tagline">
              AI Career Platform
            </p>
          )}
        </div>

        <div className="menu">
          <NavLink to="/dashboard" className="menu-item">
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/resume-center" className="menu-item">
            <i className="bi bi-file-earmark-person"></i>
            <span>Resume Center</span>
          </NavLink>

          <NavLink to="/resume-analysis" className="menu-item">
            <i className="bi bi-search"></i>
            <span>Resume Analysis</span>
          </NavLink>

          <NavLink to="/optimization" className="menu-item">
            <i className="bi bi-bullseye"></i>
            <span>JD Match</span>
          </NavLink>

          <NavLink to="/interview" className="menu-item">
            <i className="bi bi-mic"></i>
            <span>Interview</span>
          </NavLink>

          <NavLink to="/reports" className="menu-item">
            <i className="bi bi-bar-chart"></i>
            <span>Reports</span>
          </NavLink>

          <NavLink to="/profile" className="menu-item">
            <i className="bi bi-person-circle"></i>
            <span>Profile</span>
          </NavLink>
        </div>
      </div>

      <button className="logout-item" onClick={logout}>
        <i className="bi bi-box-arrow-right"></i>
        <span>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;