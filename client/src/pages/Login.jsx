import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await api.post("/login", formData);

            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data?.msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="brand-box">
                    <h1>AI Career Platform</h1>
                    <p>
                        Optimize your resume, match job descriptions, generate ATS resumes,
                        and prepare for interviews with AI.
                    </p>

                    <div className="feature-list">
                        <span>ATS Resume Optimization</span>
                        <span>JD Match Analyzer</span>
                        <span>AI Interview Coach</span>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="login-card">
                    <h2>Welcome Back</h2>
                    <p className="login-subtitle">Login to continue your career journey</p>

                    <form onSubmit={handleLogin}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="password-box">
                            <label>Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <span
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="register-text">
                        Don't have an account? <Link to="/register">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;