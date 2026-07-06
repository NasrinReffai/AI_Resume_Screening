import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function MinimalResume({ resume, form }) {
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

    pdf.save("Minimal_ATS_Resume.pdf");
  };

  return (
    <>
      <button className="btn btn-dark mb-3" onClick={downloadPDF}>
        Download Minimal Resume
      </button>

      <div
        ref={resumeRef}
        style={{
          maxWidth: "800px",
          margin: "auto",
          background: "#ffffff",
          color: "#111827",
          padding: "45px",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6"
        }}
      >
        <div style={{ textAlign: "center", borderBottom: "1px solid #111", paddingBottom: "14px" }}>
          <h1 style={{ margin: 0, fontSize: "30px", letterSpacing: "1px" }}>
            {name || "Name"}
          </h1>

          <p style={{ margin: "6px 0", fontSize: "15px", fontWeight: "bold" }}>
            {role}
          </p>

          <p style={{ margin: 0, fontSize: "13px" }}>
            {resume.email || resume.personalInfo?.email} |{" "}
            {resume.phone || resume.personalInfo?.phone} |{" "}
            {resume.location || resume.personalInfo?.location}
          </p>

          <p style={{ margin: 0, fontSize: "13px" }}>
            {resume.linkedin || resume.personalInfo?.linkedin} |{" "}
            {resume.github || resume.personalInfo?.github}
          </p>
        </div>

        <Section title="Professional Summary">
          <p>{summary}</p>
        </Section>

        <Section title="Technical Skills">
          {Array.isArray(skills) ? (
            <ul>
              {skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          ) : (
            Object.entries(skills).map(([key, values]) => (
              <div key={key} style={{ marginBottom: "8px" }}>
                <strong>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase())}
                </strong>
                <ul style={{ marginTop: "4px" }}>
                  {toArray(values).map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </Section>

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{exp.role || exp.position || exp.title}</strong>
                  <span>{exp.duration || exp.dates}</span>
                </div>

                <p style={{ margin: "3px 0" }}>
                  {exp.company}
                </p>

                <ul>
                  {toArray(exp.points || exp.responsibilities || exp.description).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((project, index) => (
              <div key={index} style={{ marginBottom: "14px" }}>
                <strong>{project.title || project.name}</strong>

                <ul>
                  {toArray(project.description).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                {toArray(project.technologies).length > 0 && (
                  <p>
                    <strong>Technologies:</strong>{" "}
                    {toArray(project.technologies).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <strong>{edu.degree}</strong>
                <p style={{ margin: "2px 0" }}>{edu.institution || edu.college}</p>
                <p style={{ margin: 0 }}>{edu.year || edu.duration}</p>
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications">
            <ul>
              {toArray(certifications).map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: "22px" }}>
      <h3
        style={{
          fontSize: "15px",
          textTransform: "uppercase",
          borderBottom: "1px solid #111",
          paddingBottom: "4px",
          marginBottom: "10px",
          letterSpacing: "0.8px"
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export default MinimalResume;