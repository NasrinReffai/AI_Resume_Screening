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
    const element = resumeRef.current;
    const scale = 2;

    const canvas = await html2canvas(element, { scale, useCORS: true });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const mmPerPx = pageWidth / canvas.width;
    const pageHeightPx = pageHeight / mmPerPx;

    // Collect safe cut points = bottom edge of each block (in canvas px)
    const containerRect = element.getBoundingClientRect();
    const blocks = element.querySelectorAll(".pdf-block");

    const candidates = Array.from(blocks)
      .map((el) => (el.getBoundingClientRect().bottom - containerRect.top) * scale)
      .filter((y) => y > 0 && y < canvas.height)
      .sort((a, b) => a - b);

    let currentY = 0;

    while (currentY < canvas.height) {
      const idealEnd = currentY + pageHeightPx;
      let sliceEnd;

      if (idealEnd >= canvas.height) {
        sliceEnd = canvas.height;
      } else {
        // pick the latest safe boundary that still fits on this page
        const best = candidates.filter((c) => c > currentY && c <= idealEnd).pop();
        // fallback: if a single block is taller than one page, force a cut
        sliceEnd = best || idealEnd;
      }

      const sliceHeightPx = sliceEnd - currentY;

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;

      pageCanvas
        .getContext("2d")
        .drawImage(
          canvas,
          0, currentY, canvas.width, sliceHeightPx,
          0, 0, canvas.width, sliceHeightPx
        );

      const sliceImg = pageCanvas.toDataURL("image/png");
      const sliceHeightMM = sliceHeightPx * mmPerPx;

      if (currentY > 0) pdf.addPage();
      pdf.addImage(sliceImg, "PNG", 0, 0, pageWidth, sliceHeightMM);

      currentY = sliceEnd;
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
              <div key={index} className="pdf-block" style={{ marginBottom: "14px" }}>
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
              <div key={index} className="pdf-block" style={{ marginBottom: "14px" }}>
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
              <div key={index} className="pdf-block" style={{ marginBottom: "8px" }}>
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
    <div className="pdf-block" style={{ marginTop: "22px" }}>
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