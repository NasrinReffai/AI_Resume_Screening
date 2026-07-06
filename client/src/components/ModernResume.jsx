import ResumeHeader from "../resume/ResumeHeader";
import ResumeSidebar from "../resume/ResumeSidebar";
import ResumeContent from "../resume/ResumeContent";
import { toArray, renderText } from "../utils/resumeUtils";

function ModernResume({ resume, form }) {
  const technicalSkills = toArray(resume.technicalSkills);
  const softSkills = toArray(resume.softSkills);
  const certifications = toArray(resume.certifications);
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const experience = Array.isArray(resume.experience) ? resume.experience : [];

  return (
    <div
      className="bg-white shadow mx-auto"
      style={{
        width: "794px",
        minHeight: "1123px",
        borderRadius: "15px",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
          color: "white"
        }}
      >
        <ResumeHeader resume={resume} form={form}  background="linear-gradient(90deg,#2563eb,#1d4ed8)"/>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "30% 70%"
        }}
      >
        <ResumeSidebar
          technicalSkills={technicalSkills}
          softSkills={softSkills}
          certifications={certifications}
          education={resume.education}
          renderText={renderText}
        />

        <ResumeContent
          summary={resume.summary}
          experience={experience}
          projects={projects}
          renderText={renderText}
          toArray={toArray}
        />
      </div>

      <div
        style={{
          background: "#f8fafc",
          textAlign: "center",
          padding: "12px",
          color: "#64748b",
          fontSize: "12px"
        }}
      >

      </div>
    </div>
  );
}

export default ModernResume;