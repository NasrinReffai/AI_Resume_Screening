function ResumeHeader({ resume, form ,background = "#1f2937"}) {

  return (
    <div
      style={{
        background,
        color: "white",
        padding: "35px 45px",
        textAlign: "center"
      }}
    >
      <h1
        style={{
          fontWeight: "700",
          letterSpacing: "1px",
          margin: 0,
          textTransform: "uppercase"
        }}
      >
        {resume.fullName || "Your Name"}
      </h1>

      <h4
        style={{
          fontWeight: "400",
          marginTop: "8px",
          color: "#d1d5db"
        }}
      >
        {resume.preferredRole || form?.preferredRole || ""}
      </h4>

      <div
        style={{
          marginTop: "18px",
          fontSize: "14px",
          lineHeight: "1.8",
          color: "#f3f4f6"
        }}
      >
        <div>
          📧 {resume.email || ""} &nbsp; | &nbsp;
          📞 {resume.phone || form?.phone || ""} &nbsp; | &nbsp;
          📍 {resume.location || form?.location || ""}
        </div>

        <div>
          🔗 {resume.linkedin || form?.linkedin || ""} &nbsp; | &nbsp;
          💻 {resume.github || form?.github || ""}
        </div>
      </div>
    </div>
  );
}

export default ResumeHeader;