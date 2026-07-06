function SkillBadge({ text }) {
  return (
    <span
      style={{
        background: "#e5e7eb",
        padding: "5px 10px",
        borderRadius: "14px",
        fontSize: "12px",
        display: "inline-block",
        margin: "4px"
      }}
    >
      {text}
    </span>
  );
}

export default SkillBadge;