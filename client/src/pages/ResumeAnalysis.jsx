import Navbar from "../components/Navbar";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useState, useRef } from "react";
import { FaEnvelope, FaPhoneAlt, FaLinkedin, FaGithub, FaMapMarkerAlt } from "react-icons/fa";
import api from "../api/axios";
import html2pdf from "html2pdf.js";

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
  try {
    const input = resumeRef.current;

    if (!input) {
      alert("Resume preview not found");
      return;
    }

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 10) {
      position = position - pageHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        pageWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
    }

    pdf.save("ATS_Resume.pdf");
  } catch (err) {
    console.log("PDF Error:", err);
    alert("PDF download failed");
  }
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
                <h4 className="fw-bold mb-3">Resume Analysis Result</h4>

                <h5>ATS Score: {result.score || 0}%</h5>

                <div className="progress mb-4" style={{ height: "22px" }}>
                  <div
                    className="progress-bar"
                    style={{ width: `${result.score || 0}%` }}
                  >
                    {result.score || 0}%
                  </div>
                </div>

                {result.summary && (
                  <>
                    <h5>Summary</h5>
                    <p>{result.summary}</p>
                    <hr />
                  </>
                )}

                {result.strengths?.length > 0 && (
                  <>
                    <h5>Strengths</h5>
                    <ul>
                      {result.strengths.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <hr />
                  </>
                )}

                {result.weaknesses?.length > 0 && (
                  <>
                    <h5>Weaknesses</h5>
                    <ul>
                      {result.weaknesses.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <hr />
                  </>
                )}

                {result.missingSkills?.length > 0 && (
                  <>
                    <h5>Missing Skills</h5>
                    <div className="mb-3">
                      {result.missingSkills.map((skill, index) => (
                        <span key={index} className="badge bg-danger me-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <hr />
                  </>
                )}

                {result.suggestions?.length > 0 && (
                  <>
                    <h5>Suggestions</h5>
                    <ul>
                      {result.suggestions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <hr />
                  </>
                )}

                {result.interviewQuestions?.length > 0 && (
                  <>
                    <h5>Interview Questions</h5>
                    <ul>
                      {result.interviewQuestions.map((q, index) => (
                        <li key={index}>{typeof q === "string" ? q : q.question}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {atsResume && (
              <>
               
                <div ref={resumeRef} className="card mt-3 p-5 shadow border-0">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold mb-1">{atsResume.personalInfo?.name}</h2>
                    <h5 className="text-primary mb-3">{atsResume.targetRole}</h5>

                    <p className="text-muted small mb-0">
                      {atsResume.personalInfo?.email} | {atsResume.personalInfo?.phone} |{" "}
                      {atsResume.personalInfo?.location}
                    </p>

                    <p className="text-muted small">
                      {atsResume.personalInfo?.linkedin} | {atsResume.personalInfo?.github}
                    </p>
                  </div>

                  <hr />

                  <h5 className="fw-bold text-uppercase border-bottom pb-2">
                    Professional Summary
                  </h5>
                  <p>{atsResume.professionalSummary}</p>

                  <h5 className="fw-bold text-uppercase border-bottom pb-2 mt-4">
                    Technical Skills
                  </h5>

                  {Object.entries(atsResume.technicalSkills || {}).map(([category, skills]) => (
                    <div key={category} className="mb-2">
                      <strong>
                        {category
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (c) => c.toUpperCase())}
                        :
                      </strong>{" "}
                      {(skills || []).map((skill, i) => (
                        <span key={i} className="badge bg-light text-dark border me-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ))}

                  <h5 className="fw-bold text-uppercase border-bottom pb-2 mt-4">
                    Professional Experience
                  </h5>

                  {atsResume.experience?.map((exp, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <h6 className="fw-bold mb-1">{exp.position}</h6>
                        <span className="text-muted small">{exp.duration}</span>
                      </div>

                      <p className="mb-1">
                        <strong>{exp.company}</strong>
                      </p>

                      <ul>
                        {(exp.responsibilities || []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <h5 className="fw-bold text-uppercase border-bottom pb-2 mt-4">
                    Projects
                  </h5>

                  {atsResume.projects?.map((project, index) => (
                    <div key={index} className="mb-3">
                      <h6 className="fw-bold">{project.title}</h6>

                      <ul>
                        {(project.description || []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>

                      <div>
                        <strong>Technologies: </strong>
                        {(project.technologies || []).map((tech, i) => (
                          <span key={i} className="badge bg-light text-dark border me-2 mb-2">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <h5 className="fw-bold text-uppercase border-bottom pb-2 mt-4">
                    Education
                  </h5>

                  {atsResume.education?.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <h6 className="fw-bold mb-1">{edu.degree}</h6>
                      <p className="mb-0">{edu.institution}</p>
                      <p className="text-muted small">{edu.year}</p>
                    </div>
                  ))}

                  {atsResume.certifications?.length > 0 && (
                    <>
                      <h5 className="fw-bold text-uppercase border-bottom pb-2 mt-4">
                        Certifications
                      </h5>
                      <ul>
                        {atsResume.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {atsResume.roleSuggestions?.length > 0 && (
                  <div className="card mt-4 p-4 shadow-sm border-0">
                    <h5 className="fw-bold">Role Suggestions</h5>
                    <div>
                      {atsResume.roleSuggestions.map((item, index) => (
                        <span key={index} className="badge bg-primary me-2 mb-2">
                          {item}
                        </span>
                      ))}
                       <button
                  type="button"
                  className="btn btn-danger mt-4 mb-3"
                  onClick={downloadResume}
                >
                  Download ATS Resume PDF
                </button>

                    </div>
                    
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeAnalysis;