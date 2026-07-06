import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function DeveloperResume({ resume, form }) {
  const resumeRef = useRef(null);

  if (!resume) return null;

  const name = resume.fullName || resume.personalInfo?.name;
  const role = resume.preferredRole || resume.targetRole || form?.preferredRole;
  const summary = resume.summary || resume.professionalSummary;

  const skills = resume.technicalSkills || {};
  const experience = resume.experience || [];
  const projects = resume.projects || [];
  const education = resume.education || [];
  const certifications = resume.certifications || [];

  const toArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return data.split("\n").filter(Boolean);
    return [];
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(resumeRef.current, {
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
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Developer_Resume.pdf");
  };

  return (
    <>
      <button className="btn btn-info mb-3" onClick={downloadPDF}>
        Download Developer Resume
      </button>

      <div
        ref={resumeRef}
        className="shadow mt-4"
        style={{
          maxWidth: "850px",
          margin: "auto",
          background: "#0f172a",
          color: "#f8fafc",
          padding: "42px",
          borderRadius: "14px",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ borderBottom: "2px solid #38bdf8", paddingBottom: "18px" }}>
          <h1 style={{ margin: 0, fontWeight: "800" }}>{name || "Name"}</h1>
          <h4 style={{ color: "#38bdf8", marginTop: "8px" }}>{role}</h4>
          <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
            {resume.email || resume.personalInfo?.email} |{" "}
            {resume.phone || resume.personalInfo?.phone} |{" "}
            {resume.location || resume.personalInfo?.location}
          </p>
          <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
            {resume.linkedin || resume.personalInfo?.linkedin} |{" "}
            {resume.github || resume.personalInfo?.github}
          </p>
        </div>

        <h3 style={{ color: "#38bdf8", marginTop: "25px" }}>Summary</h3>
        <p style={{ lineHeight: "1.7" }}>{summary}</p>

        <h3 style={{ color: "#38bdf8" }}>Skills</h3>

        {Array.isArray(skills) ? (
          skills.map((skill, i) => (
            <span key={i} style={badgeStyle}>{skill}</span>
          ))
        ) : (
          Object.entries(skills).map(([key, values]) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <b style={{ color: "#e2e8f0" }}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase())}
              </b>
              <div style={{ marginTop: "6px" }}>
                {toArray(values).map((skill, i) => (
                  <span key={i} style={badgeStyle}>{skill}</span>
                ))}
              </div>
            </div>
          ))
        )}

        {experience.length > 0 && (
          <>
            <h3 style={{ color: "#38bdf8", marginTop: "25px" }}>Experience</h3>
            {experience.map((exp, index) => (
              <div key={index} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4>{exp.role || exp.position || exp.title}</h4>
                  <span style={{ color: "#94a3b8" }}>
                    {exp.duration || exp.dates}
                  </span>
                </div>
                <p style={{ color: "#cbd5e1" }}>{exp.company}</p>
                <ul>
                  {toArray(exp.points || exp.responsibilities || exp.description).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {projects.length > 0 && (
          <>
            <h3 style={{ color: "#38bdf8", marginTop: "25px" }}>Projects</h3>
            {projects.map((project, index) => (
              <div key={index} style={cardStyle}>
                <h4>{project.title || project.name}</h4>
                <ul>
                  {toArray(project.description).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {toArray(project.technologies).map((tech, i) => (
                  <span key={i} style={badgeStyle}>{tech}</span>
                ))}
              </div>
            ))}
          </>
        )}

        {education.length > 0 && (
          <>
            <h3 style={{ color: "#38bdf8", marginTop: "25px" }}>Education</h3>
            {education.map((edu, index) => (
              <div key={index} style={cardStyle}>
                <h4>{edu.degree}</h4>
                <p>{edu.institution || edu.college}</p>
                <span style={{ color: "#94a3b8" }}>
                  {edu.year || edu.duration}
                </span>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <h3 style={{ color: "#38bdf8", marginTop: "25px" }}>Certifications</h3>
            <ul>
              {toArray(certifications).map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

const badgeStyle = {
  display: "inline-block",
  background: "#1e293b",
  color: "#38bdf8",
  padding: "6px 12px",
  margin: "4px",
  borderRadius: "20px",
  border: "1px solid #38bdf8",
  fontSize: "13px"
};

const cardStyle = {
  background: "#1e293b",
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "16px",
  border: "1px solid #334155"
};

export default DeveloperResume;