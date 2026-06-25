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
                <Link className="btn btn-outline-light me-2" to="/resume">
                    Resume
                </Link>

                <Link
                    className="btn btn-outline-light me-2"
                    to="/resume-analysis"
                >
                    Analysis
                </Link>
               
                <Link to="/interview">
                    <button>Interview</button>
                </Link>

                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>

            </div>
        </nav>
    );
}

export default Navbar;