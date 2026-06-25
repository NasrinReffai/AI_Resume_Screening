import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function ResumeUpload() {
  const [resume, setResume] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please choose resume file");
      return;
    }

    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("resume", resume);

    try {
  const res = await api.put("/resume", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  alert(`${res.data.user.resumeName} uploaded successfully`);
} catch (err) {
  alert(err.response?.data?.msg || "Upload failed");
}
  };

  return (
    <>
      <Navbar />

      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="card shadow p-4" style={{ width: "450px" }}>
          <h3 className="text-center mb-4">Upload Resume</h3>

          <form onSubmit={handleUpload}>
            <input
              type="file"
              className="form-control mb-4"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
            />

            <button className="btn btn-primary w-100">
              Upload Resume
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResumeUpload;