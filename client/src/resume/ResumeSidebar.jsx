import SectionTitle from "./SectionTitle";
import SkillBadge from "./SkillBadge";

function ResumeSidebar({
  technicalSkills,
  softSkills,
  certifications,
  education,
  renderText
}) {
  return (
    <div
      style={{
        background: "#f3f4f6",
        padding: "30px 25px",
        minHeight: "900px",
        borderRight: "1px solid #e5e7eb"
      }}
    >
      <SectionTitle title="Technical Skills" />

      <div>
        {technicalSkills.map((skill, index) => (
          <SkillBadge
            key={index}
            text={skill}
          />
        ))}
      </div>

      <SectionTitle title="Soft Skills" />

      <ul style={{ paddingLeft: "18px", fontSize: "14px" }}>
        {softSkills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>

      <SectionTitle title="Education" />

      <p style={{ fontSize: "14px" }}>
        {renderText(education)}
      </p>

      <SectionTitle title="Certifications" />

      <ul style={{ paddingLeft: "18px", fontSize: "14px" }}>
        {certifications.map((cert, index) => (
          <li key={index}>
            {renderText(cert)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResumeSidebar;