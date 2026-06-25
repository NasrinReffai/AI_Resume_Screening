import Navbar from "../components/Navbar";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useState, useRef } from "react";
import api from "../api/axios";

function ResumeAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [atsLoading, setAtsLoading] = useState(false);
  const [jobRole, setJobRole] = useState("MERN Developer");
  const [atsResume, setATSResume] = useState(null);
  const resumeRef = useRef();


  const analyzeResume = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/resume/analyze",
        { jobRole },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResult(res.data.analysis);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.msg || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const generateATSResume = async () => {
    try {
      setAtsLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/resume/generate-ats",
        { jobRole },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setATSResume(res.data.atsResume);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.msg || "ATS Resume Generation Failed");
    } finally {
      setAtsLoading(false);
    }
  };

  const downloadResume = async () => {
    const input = resumeRef.current;

    const canvas = await html2canvas(input, {
      scale: 2
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save("ATS_Resume.pdf");
  };

  return (
    <>
      <Navbar />

      <div className="min-vh-100 bg-light py-5">
        <div className="container">
          <div className="card shadow p-4 border-0 rounded-4">
            <h2 className="mb-4 fw-bold">AI Resume Analysis</h2>

            <label className="form-label fw-bold">Select Job Role</label>
            <select
              className="form-select mb-3"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            >
              <option>MERN Developer</option>
              <option>Java Developer</option>
              <option>Data Analyst</option>
              <option>Python Developer</option>
              <option>Frontend Developer</option>
              <option>Fullstack Developer</option>
              <option>PHP Developer</option>
            </select>

            <button
              className="btn btn-primary w-100"
              onClick={analyzeResume}
              disabled={loading}
            >
              {loading ? "Analyzing..." : `Analyze for ${jobRole}`}
            </button>

            <button
              className="btn btn-success w-100 mt-3"
              onClick={generateATSResume}
              disabled={atsLoading}
            >
              {atsLoading ? "Generating ATS Resume..." : "Generate ATS Resume"}
            </button>

            {result && (
              <div className="mt-4">
                <h4>Score: {result.score}%</h4>

                <div className="progress mb-4" style={{ height: "22px" }}>
                  <div
                    className="progress-bar"
                    style={{ width: `${result.score}%` }}
                  >
                    {result.score}%
                  </div>
                </div>

                <h5>Summary</h5>
                <p>{result.summary}</p>

                <hr />

                <h5>Strengths</h5>
                <ul>
                  {result.strengths?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <hr />

                <h5>Weaknesses</h5>
                <ul>
                  {result.weaknesses?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <hr />

                <h5>Missing Skills</h5>
                <div>
                  {result.missingSkills?.map((skill, index) => (
                    <span key={index} className="badge bg-danger me-2 mb-2">
                      {skill}
                    </span>
                  ))}
                </div>

                <hr />

                <h5>Suggestions</h5>
                <ul>
                  {result.suggestions?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <hr />

                <h5>Interview Questions</h5>
                <ul>
                  {result.interviewQuestions?.map((q, index) => (
                    <li key={index}>
                      {typeof q === "string" ? q : q.question}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {atsResume && (
              <>
                <div
                  ref={resumeRef}
                  className="mt-5 bg-white border rounded-4 shadow-sm"
                  style={{
                    maxWidth: "850px",
                    margin: "0 auto",
                    padding: "45px",
                    color: "#222",
                    fontFamily: "Arial, sans-serif"
                  }}
                >
                  <div className="text-center border-bottom pb-3 mb-4">
                    <h1 style={{ fontSize: "30px", fontWeight: "700", letterSpacing: "1px" }}>
                      {atsResume.personalInfo.name}
                    </h1>

                    <h5 style={{ color: "#555", fontWeight: "500" }}>
                      {jobRole}
                    </h5>

                    <p style={{ fontSize: "14px", marginBottom: "0" }}>
                      {atsResume.personalInfo.email} | {atsResume.personalInfo.phone}
                    </p>
                  </div>

                  <section className="mb-4">
                    <h4 className="resume-heading">Professional Summary</h4>
                    <p>{atsResume.professionalSummary}</p>
                  </section>

                  <section className="mb-4">
                    <h4 className="resume-heading">Technical Skills</h4>

                    <div className="mb-3">
                      <b>Programming Languages</b>
                      <p>
                        {atsResume.technicalSkills?.programmingLanguages?.join(", ")}
                      </p>
                    </div>

                    <div className="mb-3">
                      <b>Frontend</b>
                      <p>
                        {atsResume.technicalSkills?.frontend?.join(", ")}
                      </p>
                    </div>

                    <div className="mb-3">
                      <b>Backend</b>
                      <p>
                        {atsResume.technicalSkills?.backend?.join(", ")}
                      </p>
                    </div>

                    <div className="mb-3">
                      <b>Database</b>
                      <p>
                        {atsResume.technicalSkills?.database?.join(", ")}
                      </p>
                    </div>

                    <div className="mb-3">
                      <b>Tools</b>
                      <p>
                        {atsResume.technicalSkills?.tools?.join(", ")}
                      </p>
                    </div>
                  </section>

                  {atsResume.experience?.length > 0 && (
                    <section className="mb-4">
                      <h4 className="resume-heading">Professional Experience</h4>

                      {atsResume.experience.map((exp, index) => (
                        <div key={index} className="mb-3">
                          <h6 className="fw-bold mb-1">
                            {exp.position} - {exp.company}
                          </h6>

                          <p className="mb-1 text-muted">
                            {exp.duration}
                          </p>

                          <ul>
                            {exp.responsibilities?.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </section>
                  )}

                  {atsResume.projects?.length > 0 && (
                    <section className="mb-4">
                      <h4 className="resume-heading">Projects</h4>

                      {atsResume.projects.map((project, index) => (
                        <div key={index} className="mb-3">
                          <h6 className="fw-bold mb-1">{project.title}</h6>

                          <ul>
                            {project.description?.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </section>
                  )}

                  {atsResume.education?.length > 0 && (
                    <section className="mb-4">
                      <h4 className="resume-heading">Education</h4>

                      {atsResume.education.map((edu, index) => (
                        <p key={index} className="mb-1">
                          <b>{edu.degree}</b> - {edu.institution} ({edu.year})
                        </p>
                      ))}
                    </section>
                  )}

                  {atsResume.certifications?.length > 0 && (
                    <section className="mb-4">
                      <h4 className="resume-heading">Certifications</h4>
                      <ul>
                        {atsResume.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {atsResume.achievements?.length > 0 && (
                    <section>
                      <h4 className="resume-heading">Achievements</h4>
                      <ul>
                        {atsResume.achievements.map((ach, index) => (
                          <li key={index}>{ach}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                <button
                  className="btn btn-danger w-100 mt-3"
                  onClick={downloadResume}
                >
                  Download ATS Resume PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeAnalysis;