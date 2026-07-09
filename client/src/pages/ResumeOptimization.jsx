import { useState, useRef } from "react";
import Layout from "../layout/Layout";
import api from "../api/axios";
import html2pdf from "html2pdf.js";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

function ResumeOptimization() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const optimizedResumeRef = useRef(null);

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste job description first");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/optimization/optimize",
        { jobDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data.optimization);
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Optimization Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateOptimizedResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste job description first");
      return;
    }

    try {
      setResumeLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/optimization/generate-resume",
        { jobDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOptimizedResume(res.data.optimizedResume);
    } catch (err) {
      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.error ||
          err.response?.data?.msg ||
          "Resume Generation Failed"
      );
    } finally {
      setResumeLoading(false);
    }
  };

  const downloadOptimizedResume = () => {
    const element = optimizedResumeRef.current;

    if (!element) {
      alert("Optimized resume not found");
      return;
    }

    const options = {
      margin: [8, 8, 8, 8],
      filename: "Optimized_ATS_Resume.pdf",
      image: {
        type: "jpeg",
        quality: 1,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
        avoid: [".section"],
      },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <Layout>


      <div className="container mt-5">
        <h2 className="fw-bold mb-4">AI Job Match Analyzer</h2>

        <textarea
          className="form-control mb-3"
          rows="10"
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            setResult(null);
            setOptimizedResume(null);
          }}
          placeholder="Paste Job Description Here..."
        />

        <button
          className="btn btn-primary w-100"
          onClick={analyzeResume}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume Match"}
        </button>

        {result && (
          <div className="mt-5">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="mb-3">📊 Resume Match</h3>

                <div className="progress" style={{ height: "28px" }}>
                  <div
                    className="progress-bar bg-primary fw-bold"
                    style={{ width: `${result.matchScore || 0}%` }}
                  >
                    {result.matchScore || 0}%
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3>✅ Matched Skills</h3>

                {result.matchedSkills?.map((skill, index) => (
                  <span key={index} className="badge bg-success me-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3>❌ Missing Skills</h3>

                {result.missingSkills?.map((skill, index) => (
                  <span key={index} className="badge bg-danger me-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3>⭐ Strengths</h3>

                <ul>
                  {result.strengths?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3>⚠ Weaknesses</h3>

                <ul>
                  {result.weaknesses?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3>💡 Suggestions</h3>

                <ul>
                  {result.suggestions?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={generateOptimizedResume}
                  disabled={resumeLoading}
                >
                  {resumeLoading
                    ? "Generating..."
                    : "Generate Optimized Resume"}
                </button>
              </div>
            </div>

            {optimizedResume && (
              <>
                {/* PDF CONTENT ONLY */}
                <div
                  ref={optimizedResumeRef}
                  className="card shadow-lg mt-5 border-0 resume-card"
                >
                  <div className="card-body p-5">
                    {/* Header */}
                    <div className="text-center">
                      <h2 className="fw-bold mb-2">
                        {optimizedResume.personalInfo?.name}
                      </h2>

                      <div className="d-flex justify-content-center flex-wrap gap-4 mt-3 small">
                        {optimizedResume.personalInfo?.email && (
                          <span>
                            <FaEnvelope className="me-1 text-primary" />
                            {optimizedResume.personalInfo.email}
                          </span>
                        )}

                        {optimizedResume.personalInfo?.phone && (
                          <span>
                            <FaPhoneAlt className="me-1 text-success" />
                            {optimizedResume.personalInfo.phone}
                          </span>
                        )}

                        {optimizedResume.personalInfo?.location && (
                          <span>
                            <FaMapMarkerAlt className="me-1 text-danger" />
                            {optimizedResume.personalInfo.location}
                          </span>
                        )}

                        {optimizedResume.personalInfo?.linkedin && (
                          <a
                            href={optimizedResume.personalInfo.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            <FaLinkedin className="me-1 text-primary" />
                            LinkedIn
                          </a>
                        )}

                        {optimizedResume.personalInfo?.github && (
                          <a
                            href={optimizedResume.personalInfo.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            <FaGithub className="me-1 text-dark" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>

                    <hr />

                    {/* Summary */}
                    <div>
                      <h4 className="text-primary">Professional Summary</h4>
                      <p>{optimizedResume.optimizedSummary}</p>
                    </div>

                    <hr />

                    {/* Skills */}
                    <div>
                      <h4 className="text-primary">Technical Skills</h4>

                      <p>
                        <b>Programming Languages:</b>{" "}
                        {optimizedResume.technicalSkills?.programmingLanguages?.join(
                          ", "
                        ) || "Not mentioned"}
                      </p>

                      <p>
                        <b>Frontend:</b>{" "}
                        {optimizedResume.technicalSkills?.frontend?.join(
                          ", "
                        ) || "Not mentioned"}
                      </p>

                      <p>
                        <b>Backend:</b>{" "}
                        {optimizedResume.technicalSkills?.backend?.join(
                          ", "
                        ) || "Not mentioned"}
                      </p>

                      <p>
                        <b>Database:</b>{" "}
                        {optimizedResume.technicalSkills?.database?.join(
                          ", "
                        ) || "Not mentioned"}
                      </p>

                      <p>
                        <b>Tools:</b>{" "}
                        {optimizedResume.technicalSkills?.tools?.join(", ") ||
                          "Not mentioned"}
                      </p>
                    </div>

                    <hr />

                    {/* Experience */}
                    <div>
                      <h4 className="text-primary">Experience/Internship</h4>

                      {optimizedResume.experience?.length > 0 ? (
                        optimizedResume.experience.map((exp, index) => (
                          <div key={index} className="mb-4">
                            <h5>{exp.position}</h5>

                            <p>
                              <b>{exp.company}</b> | {exp.duration}
                            </p>

                            <ul>
                              {exp.responsibilities?.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No experience found</p>
                      )}
                    </div>

                    <hr />

                    {/* Projects */}
                    <div className="section">
                      <h4 className="text-primary">Projects</h4>

                      {optimizedResume.projects?.length > 0 ? (
                        optimizedResume.projects.map((project, index) => (
                          <div key={index} className="mb-4">
                            <h5>{project.title}</h5>

                            <p>
                              <b>Technologies:</b>{" "}
                              {project.technologies?.join(", ") ||
                                "Not mentioned"}
                            </p>

                            <ul>
                              {project.description?.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No projects found</p>
                      )}
                    </div>

                    <hr />

                    {/* Education */}
                    <div className="section">
                      <h4 className="text-primary">Education</h4>

                      {optimizedResume.education?.length > 0 ? (
                        optimizedResume.education.map((edu, index) => (
                          <div key={index} className="mb-3">
                            <b>{edu.degree}</b>
                            <p className="mb-1">{edu.institution}</p>
                            <p>{edu.year}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No education found</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* PREVIEW ONLY - NOT IN PDF */}
                <div className="card shadow-sm mt-4">
                  <div className="card-body">
                    <h4 className="text-danger">Missing Skills</h4>

                    {optimizedResume.missingSkills?.length > 0 ? (
                      optimizedResume.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-danger me-2 mb-2"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-muted">No missing skills</p>
                    )}
                  </div>
                </div>

                <div className="card shadow-sm mt-4">
                  <div className="card-body">
                    <h4 className="text-success">Optimization Notes</h4>

                    {optimizedResume.optimizationNotes?.length > 0 ? (
                      <ul>
                        {optimizedResume.optimizationNotes.map(
                          (note, index) => (
                            <li key={index}>{note}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-muted">No optimization notes</p>
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-danger w-100 mt-3 mb-5"
                  onClick={downloadOptimizedResume}
                >
                  Download Optimized Resume PDF
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ResumeOptimization;