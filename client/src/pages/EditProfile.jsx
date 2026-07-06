import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    education: "",
    skills: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const data = new FormData();

      if (formData.username.trim()) {
        data.append("username", formData.username);
      }

      if (formData.education.trim()) {
        data.append("education", formData.education);
      }

      if (formData.skills.trim()) {
        data.append("skills", formData.skills);
      }

      if (image) {
        data.append("profile_images", image);
      }

      await api.put("/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.msg || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
        <div
          className="card shadow border-0 rounded-4 p-4"
          style={{ maxWidth: "520px", width: "100%" }}
        >
          <h2 className="text-center fw-bold mb-2">Edit Profile</h2>
          <p className="text-center text-muted mb-4">
            Update only the fields you want to change
          </p>

          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label fw-semibold">full Name</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter new username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Education</label>
              <input
                type="text"
                name="education"
                className="form-control"
                placeholder="Example: BCA / ME CSE"
                value={formData.education}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Skills</label>
              <input
                type="text"
                name="skills"
                className="form-control"
                placeholder="Example: React, Node.js, MongoDB"
                value={formData.skills}
                onChange={handleChange}
              />
              <small className="text-muted">
                Separate skills using comma
              </small>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Profile Image
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <small className="text-muted">
                Leave empty if you don't want to change image
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;