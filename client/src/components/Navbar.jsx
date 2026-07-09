import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/profile">
        AI Resume System
      </Link>

      <div className="ms-auto">
        <Link className="btn btn-outline-light me-2" to="/profile">
          Profile
        </Link>
        <button
          className="btn btn-outline-light me-2"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <Link className="btn btn-outline-light me-2" to="/resume-center">
          Resume Center
        </Link>

        <Link className="btn btn-outline-light me-2" to="/resume-analysis">
          Analysis
        </Link>

        <Link className="btn btn-outline-light me-2" to="/optimization">
          JD Match
        </Link>

        <Link className="btn btn-outline-light me-2" to="/interview">
          Interview
        </Link>
        <Link className="btn btn-outline-light me-2" to="/reports">
          Reports
        </Link>

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;