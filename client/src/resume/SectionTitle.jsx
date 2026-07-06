function SectionTitle({ title }) {
  return (
    <h4
      style={{
        fontSize: "16px",
        fontWeight: "700",
        textTransform: "uppercase",
        borderBottom: "2px solid #111827",
        paddingBottom: "5px",
        marginTop: "20px",
        marginBottom: "12px"
      }}
    >
      {title}
    </h4>
  );
}

export default SectionTitle;