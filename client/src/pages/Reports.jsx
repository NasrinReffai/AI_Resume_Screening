import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
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
      <Layout>
      
        <div className="container mt-5 text-center">
          <h4>Loading Career Report...</h4>
        </div>
      </Layout>
    );
  }

  if (!report) {
    return (
      <Layout>
       
        <div className="container mt-5 text-center">
          <h4>No report data found</h4>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
 

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Career Report</h2>
          <p className="text-muted">
            Detailed AI recommendations based on your resume, JD match, and interview performance.
          </p>
        </div>

        <div className="card shadow-sm p-4 mb-4">
          <h5>Resume Status</h5>
          <p className="mb-0">✅ {report.resumeStatus}</p>
        </div>

        <div className="row mt-4">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-4 h-100">
              <h5>Strong Skills</h5>

              {report.strongSkills?.length > 0 ? (
                <ul>
                  {report.strongSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">No strong skills found yet.</p>
              )}
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-4 h-100">
              <h5>Skills to Improve</h5>

              {report.improveSkills?.length > 0 ? (
                <ul>
                  {report.improveSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">No improvement skills found yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="card shadow-sm p-4 mb-4">
          <h5>Recommended Roles</h5>

          {report.recommendedRoles?.length > 0 ? (
            <div>
              {report.recommendedRoles.map((role, i) => (
                <span key={i} className="badge bg-primary me-2 mb-2">
                  {role}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted mb-0">No role recommendations yet.</p>
          )}
        </div>

        <div className="card shadow-sm p-4">
          <h5>AI Recommendations</h5>

          {report.recommendations?.length > 0 ? (
            <ul>
              {report.recommendations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mb-0">No recommendations found yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Reports;