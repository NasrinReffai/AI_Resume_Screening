import SectionTitle from "./SectionTitle";

function ResumeContent({ summary, experience = [], projects = [], renderText, toArray }) {
  return (
    <div style={{ padding: "30px 35px" }}>
      <SectionTitle title="Professional Summary" />

      <p style={{ fontSize: "14px", lineHeight: "1.7" }}>
        {renderText(summary)}
      </p>

      {experience.length > 0 && (
        <>
          <SectionTitle title="Experience" />

          {experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h5 style={{ marginBottom: "3px", fontWeight: "700" }}>
                  {exp.role || exp.title || exp.position || "Experience"}
                </h5>

                <span style={{ fontSize: "13px" }}>
                  {exp.duration || exp.dates || ""}
                </span>
              </div>

              <p style={{ marginBottom: "4px", fontSize: "14px" }}>
                <b>{exp.company || ""}</b>
              </p>

              <ul style={{ fontSize: "14px", paddingLeft: "18px" }}>
                {toArray(exp.points || exp.description || exp.responsibilities).map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  )
                )}
              </ul>
            </div>
          ))}
        </>
      )}

      <SectionTitle title="Projects" />

      {projects.map((project, index) => (
        <div key={index} style={{ marginBottom: "18px" }}>
          <h5 style={{ marginBottom: "4px", fontWeight: "700" }}>
            {project.title || project.name || `Project ${index + 1}`}
          </h5>

          <p style={{ fontSize: "14px", marginBottom: "4px" }}>
            {renderText(project.description)}
          </p>

          {project.technologies && (
            <p style={{ fontSize: "13px" }}>
              <b>Technologies:</b> {toArray(project.technologies).join(", ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ResumeContent;