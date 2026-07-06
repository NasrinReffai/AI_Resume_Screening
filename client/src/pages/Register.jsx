import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPasswordStrength = () => {
    if (formData.password.length === 0) return "";
    if (formData.password.length < 6) return "Weak";
    if (formData.password.length < 10) return "Medium";
    return "Strong";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="register-page">
      <div className="register-left">
        <div>
          <div className="brand">
            <div className="brand-icon">AI</div>
            <div>
              <h2>CareerAI</h2>
              <p>Your AI Career Partner</p>
            </div>
          </div>

          <h1>
            Kickstart Your <br />
            Career Journey <br />
            <span>with AI</span>
          </h1>

          <p className="left-text">
            Create your account and get access to powerful AI tools to build,
            optimize and land your dream job.
          </p>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">📄</div>
              <div>
                <h4>AI Resume Optimization</h4>
                <p>Get ATS-friendly resume suggestions</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">🎯</div>
              <div>
                <h4>Job Match Analyzer</h4>
                <p>Find the best job matches instantly</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">💬</div>
              <div>
                <h4>Interview Coach</h4>
                <p>Practice and ace your interviews</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">📈</div>
              <div>
                <h4>Career Dashboard</h4>
                <p>Track your progress in one place</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-glow">🚀</div>
      </div>

      <div className="register-right">
        <div className="register-card">
          <div className="user-icon">👤+</div>

          <h2>Create an Account</h2>
          <p className="subtitle">Join users accelerating their careers</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-box">
                <span>👤</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-box">
                <span>✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-box">
                <span>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-box">
                <span>🔒</span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="strength-row">
              <span>Password strength:</span>
              <b className={strength.toLowerCase()}>{strength}</b>
            </div>

            <div className="strength-bars">
              <span className={strength ? "active" : ""}></span>
              <span className={strength === "Medium" || strength === "Strong" ? "active" : ""}></span>
              <span className={strength === "Strong" ? "active" : ""}></span>
            </div>

            <button className="create-btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="signin-text">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;