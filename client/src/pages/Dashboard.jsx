import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import "../styles/dashboard.css";

import api from "../api/axios";

function Dashboard() {
    const navigate = useNavigate();
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await api.get("/reports", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setReport(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDashboard();
    }, []);

    if (!report) {
        return (
            <Layout>
                <div className="container text-center mt-5">
                    <h3>Loading Dashboard...</h3>
                </div>
            </Layout>
        );
    }

    return (
        <Layout name={report.fullName}>
            <div className="container">

                <div className="alert alert-success d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1">Resume Status</h5>
                        <p className="mb-0">{report.resumeStatus}</p>
                    </div>
                    <h2>✅</h2>
                </div>

                <div className="row g-4 mt-2">

                    <Card
                        icon="bi-graph-up-arrow"
                        title="ATS Score"
                        value={`${report.atsScore}%`}
                        note="Resume Performance"
                    />

                    <Card
                        icon="bi-bullseye"
                        title="JD Match"
                        value={`${report.jdMatch}%`}
                        note="Job Compatibility"
                    />

                    <Card
                        icon="bi-mic"
                        title="Interview"
                        value={`${report.interviewScore}/10`}
                        note="Practice Score"
                    />

                    <Card
                        icon="bi-rocket-takeoff"
                        title="Career Ready"
                        value={`${report.readiness}%`}
                        note="Ready to Apply"
                    />

                </div>

                <div className="card shadow-sm mt-4">
                    <div className="card-body">
                        <h5>Career Readiness</h5>

                        <div className="progress mt-3" style={{ height: "22px" }}>
                            <div
                                className="progress-bar bg-success"
                                style={{ width: `${report.readiness}%` }}
                            >
                                {report.readiness}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mt-4">
                    <div className="card-body">
                        <h4 className="mb-4">Quick Actions</h4>

                        <div className="row g-3">
                            <Action
                                icon="bi-file-earmark-person"
                                title="Resume Center"
                                subtitle="Manage your resumes"
                                click={() => navigate("/resume-center")}
                            />

                            <Action
                                icon="bi-search"
                                title="Resume Analysis"
                                subtitle="Analyze ATS score"
                                click={() => navigate("/resume-analysis")}
                            />

                            <Action
                                icon="bi-bullseye"
                                title="JD Match"
                                subtitle="Compare with Job Description"
                                click={() => navigate("/optimization")}
                            />

                            <Action
                                icon="bi-mic"
                                title="Interview"
                                subtitle="Practice interview questions"
                                click={() => navigate("/interview")}
                            />

                            <Action
                                icon="bi-bar-chart"
                                title="Reports"
                                subtitle="View career report"
                                click={() => navigate("/reports")}
                            />

                            <Action
                                icon="bi-person-circle"
                                title="Profile"
                                subtitle="Update your profile"
                                click={() => navigate("/profile")}
                            />
                            <Action
                                title="📊 Resume Analysis"
                                click={() => navigate("/resume-analysis")}
                            />

                            <Action
                                title="🎯 JD Match"
                                click={() => navigate("/optimization")}
                            />

                            <Action
                                title="🎤 Interview"
                                click={() => navigate("/interview")}
                            />

                            <Action
                                title="📈 Reports"
                                click={() => navigate("/reports")}
                            />

                            <Action
                                title="👤 Profile"
                                click={() => navigate("/profile")}
                            />
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mt-4">
                    <div className="card-body">
                        <h4>Recent Activity</h4>

                        <ul className="list-group list-group-flush mt-3">
                            <li className="list-group-item">
                                ✅ Resume Generated / Uploaded
                            </li>
                            <li className="list-group-item">
                                ✅ Resume Analysis Completed
                            </li>
                            <li className="list-group-item">
                                ✅ JD Match Completed
                            </li>
                            <li className="list-group-item">
                                ✅ Interview Practice Available
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </Layout>
    );
}

function Card({ icon, title, value, note }) {
    return (
        <div className="col-lg-3 col-md-6">
            <div className="score-card">
                <div className="score-icon">
                    <i className={`bi ${icon}`}></i>
                </div>

                <h6>{title}</h6>
                <h2>{value}</h2>
                <small>{note}</small>
            </div>
        </div>
    );
}

function Action({ icon, title, subtitle, click }) {
    return (
        <div className="col-lg-4 col-md-6">
            <div className="action-card" onClick={click}>
                <div className="action-icon">
                    <i className={`bi ${icon}`}></i>
                </div>

                <h5>{title}</h5>

                <p>{subtitle}</p>

                <div className="action-footer">
                    Open
                    <i className="bi bi-arrow-right"></i>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;