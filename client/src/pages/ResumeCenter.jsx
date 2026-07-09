import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import api from "../api/axios";

function ResumeCenter() {
    const [resumeInfo, setResumeInfo] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await api.get("/resume-center", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setResumeInfo(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchResume();
    }, []);

    return (
        <Layout>
          

            <div className="container mt-5">
                <h2 className="mb-2">Resume Center</h2>

                <p className="text-muted mb-4">
                    Upload your existing resume or create a new ATS-friendly resume using AI.
                </p>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card shadow h-100 p-4">
                            <h3>📤 Upload Existing Resume</h3>
                            <p className="text-muted">
                                Already have a resume? Upload it for ATS analysis, JD match, and interview preparation.
                            </p>

                            <Link to="/resume" className="btn btn-primary mt-auto">
                                Upload Resume
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow h-100 p-4">
                            <h3>✨ Build Resume with AI</h3>
                            <p className="text-muted">
                                Don't have a resume? Enter your details and generate a professional ATS-friendly resume.
                            </p>

                            <Link to="/resume-builder" className="btn btn-success mt-auto">
                                Create Resume
                            </Link>
                        </div>
                    </div>
                </div>

                {resumeInfo?.hasResume ? (
                    <div className="card shadow mt-5 p-4">
                        <h3>📄 My Resume</h3>
                        <hr />

                        <p>
                            <b>Name:</b> {resumeInfo.fullName}
                        </p>

                        <p>
                            <b>Email:</b> {resumeInfo.email}
                        </p>

                        <p>
                            <b>Resume:</b> {resumeInfo.resumeName}
                        </p>

                        <p>
                            <b>Source:</b> {resumeInfo.resumeSource || "Uploaded Resume"}
                        </p>

                        <div className="d-flex gap-3 flex-wrap mt-3">
                            <Link to="/resume-preview" className="btn btn-primary">
                                👁 Preview
                            </Link>
                            <a
                                href={resumeInfo.resumeUrl}
                                download={resumeInfo.resumeName}
                                className="btn btn-success"
                            >
                                ⬇ Download
                            </a>
                            <Link to="/resume-analysis" className="btn btn-outline-primary">
                                Analyze Resume
                            </Link>

                            <Link to="/optimization" className="btn btn-outline-warning">
                                JD Match
                            </Link>

                            <Link to="/interview" className="btn btn-outline-success">
                                Start Interview
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="card mt-5 shadow p-4">





                        <h6>After creating your resume, you can continue with:</h6>

                        <div className="d-flex gap-2 flex-wrap mt-3">

                            <button className="btn btn-outline-primary" disabled>
                                Resume Analysis
                            </button>

                            <button className="btn btn-outline-default" disabled>
                                JD Match
                            </button>

                            <button className="btn btn-outline-success" disabled>
                                AI Interview
                            </button>

                        </div>

                    </div>
                )}
            </div>
        </Layout>
    );
}

export default ResumeCenter;