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
    profile_images: null
  });

  const handleChange = (e) => {
    if (e.target.name === "profile_images") {
      setFormData({ ...formData, profile_images: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!formData.username || !formData.education || !formData.skills || !formData.profile_images) {
      alert("All fields are required");
      return;
    }
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("username", formData.username);
    data.append("education", formData.education);
    data.append("skills", formData.skills);

    if (formData.profile_images) {
      data.append("profile_images", formData.profile_images);
    }


    try {
      await api.put("/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Profile updated");
      navigate("/profile");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.error || err.response?.data?.msg || "Update failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center py-5">
        <div className="card shadow p-4" style={{ width: "450px" }}>
          <h3 className="text-center mb-4">Edit Profile</h3>

          <form onSubmit={handleSubmit}>
            <input className="form-control mb-3" name="username" placeholder="Username" onChange={handleChange} />

            <input className="form-control mb-3" name="education" placeholder="Education" onChange={handleChange} />

            <input className="form-control mb-3" name="skills" placeholder="React,Node.js,MongoDB" onChange={handleChange} />

            <input className="form-control mb-4" type="file" name="profile_images" onChange={handleChange} />


            <button className="btn btn-primary w-100">Update Profile</button>
            
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;