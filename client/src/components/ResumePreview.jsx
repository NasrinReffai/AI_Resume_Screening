import ClassicResume from "./ClassicResume";
import ModernResume from "./ModernResume";
import DeveloperResume from "./DeveloperResume";
import MinimalResume from "./MinimalResume";

function ResumePreview({ resume, form, template }) {
  if (!resume) return null;

  switch (template) {
    case "modern":
      return <ModernResume resume={resume} form={form} />;

    case "developer":
      return <DeveloperResume resume={resume} form={form} />;

    case "minimal":
      return <MinimalResume resume={resume} form={form} />;

    default:
      return <ClassicResume resume={resume} form={form} />;
  }
}

export default ResumePreview;