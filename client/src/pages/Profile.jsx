import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import api from "../api/axios";

function Profile() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await api.get("/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data);
            } catch (err) {
      console.log("PROFILE ERROR:", err.response?.data || err.message);
      localStorage.removeItem("token");
      navigate("/login");         }
        };

        fetchProfile();
    }, []);

    return (
        <Layout>
         

            <div className="min-vh-100 bg-light py-5">
                <div className="container d-flex justify-content-center">
                    <div
                        className="card shadow-lg p-5 border-0 rounded-4"
                        style={{ width: "900px" }}
                    >
                        <div className="d-flex align-items-center gap-4 mb-4">
                            <img
                                src={
                                    user.profileImage ||
                                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt="profile"
                                className="rounded-circle border shadow"
                                style={{
                                    width: "170px",
                                    height: "170px",
                                    objectFit: "cover"
                                }}
                            />

                            <div>
                               <h1 className="fw-bold">{user.fullName || user.username}</h1>
                                <h5 className="text-muted">{user.email}</h5>

                                <p className="mt-3 fs-5">
                                    <strong>Education :</strong> {user.education}
                                </p>
                            </div>
                        </div>

                        <hr />
                        <h4 className="mb-3">Skills</h4>

                        <div className="d-flex flex-wrap gap-2 mb-5">
                            {user.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="badge bg-primary p-3 fs-6"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                        {user.resumeUrl && (
                            <a
                                href={user.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-success mt-3 mb-4 w-25 d-flex"
                            >
                                Download Resume
                            </a>
                        )}

                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate("/edit-profile")} >
                            Edit Profile
                        </button>

                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;