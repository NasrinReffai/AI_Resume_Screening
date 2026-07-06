import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
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
        alert(err.response?.data?.msg || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h4>Loading Career Report...</h4>
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h4>No report data found</h4>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center">Career Report</h2>

        <div className="alert alert-success mt-4">
          ✅ {report.resumeStatus}
        </div>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm p-3">
              <h6>ATS Score</h6>
              <h2>{report.atsScore}%</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm p-3">
              <h6>JD Match</h6>
              <h2>{report.jdMatch}%</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm p-3">
              <h6>Interview</h6>
              <h2>{report.interviewScore}/10</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm p-3">
              <h6>Readiness</h6>
              <h2>{report.readiness}%</h2>
            </div>
          </div>
        </div>

        <div className="card shadow mt-4 p-4">
          <h5>Career Readiness</h5>
          <div className="progress" style={{ height: "25px" }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${report.readiness}%` }}
            >
              {report.readiness}%
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              <h5>Strong Skills</h5>
              <ul>
                {report.strongSkills?.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              <h5>Skills to Improve</h5>
              <ul>
                {report.improveSkills?.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="card shadow mt-4 p-4">
          <h5>AI Recommendations</h5>
          <ul>
            {report.recommendations?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Reports;