import { useRef, useState } from "react";
import Layout from "../layout/Layout";
import ResumePreview from "../components/ResumePreview";
import api from "../api/axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function ResumeBuilder() {
  const resumeRef = useRef(null);

  const [generatedResume, setGeneratedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("classic");
  const [zoom, setZoom] = useState(1);

  const [form, setForm] = useState({
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    careerObjective: "",
    technicalSkills: "",
    softSkills: "",
    projects: "",
    experience: "",

    education: "",
    certifications: "",
    preferredRole: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post("/resume-builder/save", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Resume details saved successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Resume builder save failed");
    }
  };

  const generateResume = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/resume-builder/generate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Resume Builder Response:", res.data);

      setGeneratedResume(res.data.resume);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.msg || "Generation failed");
    } finally {
      setLoading(false);
    }
  };
  const downloadPDF = async () => {
    const element = resumeRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("AI_Generated_Resume.pdf");
    

  };
const printResume = () => {
  window.print();
};
  const suggestField = async (fieldName) => {
    try {
      if (!form.preferredRole) {
        alert("Please select preferred role first");
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/resume-builder/suggest",
        {
          role: form.preferredRole,
          field: fieldName,
          currentText: form[fieldName]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setForm({
        ...form,
        [fieldName]: res.data.suggestion
      });

    } catch (err) {
      alert(err.response?.data?.msg || "Suggestion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
   

      <div className="container mt-5 mb-5">
        <h2 className="mb-4">AI Resume Builder</h2>

        <form onSubmit={handleSave} className="card p-4 shadow">
          <select
            className="form-control mb-3"
            name="preferredRole"
            value={form.preferredRole}
            onChange={handleChange}
          >
            <option value="">Select Preferred Role</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="MERN Stack Developer">MERN Stack Developer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="PHP Developer">PHP Developer</option>
          </select>
          <input
            className="form-control mb-3"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="location"
            placeholder="Location"
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="linkedin"
            placeholder="LinkedIn URL"
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="github"
            placeholder="GitHub URL"
            onChange={handleChange}
          />
          <div className="mb-3">

            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold mb-0">
                Career Objective
              </label>

              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={() => suggestField("careerObjective")}
                disabled={loading}
              >
                ✨ Suggest
              </button>
            </div>

            <textarea
              className="form-control"
              rows="4"
              name="careerObjective"
              value={form.careerObjective}
              onChange={handleChange}
              placeholder="Write your career objective..."
            />

          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold mb-0">
                Technical Skills
              </label>

              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={() => suggestField("technicalSkills")}
                disabled={loading}
              >
                {form.technicalSkills ? "✨ Enhance" : "✨ Suggest"}
              </button>
            </div>

            <textarea
              className="form-control"
              rows="3"
              name="technicalSkills"
              value={form.technicalSkills}
              onChange={handleChange}
              placeholder="Technical Skills"
            />
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold mb-0">
                Soft Skills
              </label>

              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={() => suggestField("softSkills")}
                disabled={loading}
              >
                {form.softSkills ? "✨ Enhance" : "✨ Suggest"}
              </button>
            </div>

            <textarea
              className="form-control"
              rows="3"
              name="softSkills"
              value={form.softSkills}
              onChange={handleChange}
              placeholder="Soft Skills"
            />
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold mb-0">
                Projects
              </label>

              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={() => suggestField("projects")}
                disabled={loading}
              >
                {form.projects ? "✨ Enhance" : "✨ Suggest"}
              </button>
            </div>

            <textarea
              className="form-control"
              rows="3"
              name="projects"
              value={form.projects}
              onChange={handleChange}
              placeholder="Projects"
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold mb-0">
                Experience
              </label>

              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={() => suggestField("experience")}
                disabled={loading}
              >
                {form.experience ? "✨ Enhance" : "✨ Suggest"}
              </button>
            </div>

            <textarea
              className="form-control"
              rows="3"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Internship/Experience"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Education</label>

            <textarea
              className="form-control"
              rows="3"
              name="education"
              value={form.education}
              onChange={handleChange}
              placeholder="Example: M.E Computer Science and Engineering, SBM College, 2025-2027"
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold mb-0">
                Certifications
              </label>

              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={() => suggestField("certifications")}
                disabled={loading}
              >
                {form.certifications ? "✨ Enhance" : "✨ Suggest"}
              </button>
            </div>

            <textarea
              className="form-control"
              rows="3"
              name="certifications"
              value={form.certifications}
              onChange={handleChange}
              placeholder="Certifications"
            />
          </div>

          <button className="btn btn-primary w-100">
            Save Resume Details
          </button>



          <div className="mb-4">
            <label className="form-label fw-bold">Choose Resume Template</label>

            <div className="row g-3">
              {[
                { id: "classic", title: "Classic ATS", icon: "📄" },
                { id: "modern", title: "Modern Professional", icon: "💼" },
                { id: "developer", title: "Developer", icon: "💻" },
                { id: "minimal", title: "Minimal ATS", icon: "✨" }
              ].map((item) => (
                <div className="col-md-3 col-6" key={item.id}>
                  <div
                    onClick={() => setTemplate(item.id)}
                    className={`card h-100 text-center p-3 shadow-sm ${template === item.id ? "border-primary border-3" : "border"
                      }`}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ fontSize: "32px" }}>{item.icon}</div>
                    <h6 className="mt-2 mb-0">{item.title}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <button
            type="button"
            className="btn btn-success w-100 mt-3"
            onClick={generateResume}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate AI Resume"}
          </button>
        </form>

        {generatedResume && (
          <div className="d-flex justify-content-end gap-2 mt-4 mb-3">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setZoom(0.75)}
            >
              75%
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setZoom(1)}
            >
              100%
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setZoom(1.25)}
            >
              125%
            </button>
          </div>
        )}

        {generatedResume && (
          <div className="d-flex justify-content-end gap-2 mt-4 mb-3">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => alert("Use template download button for PDF")}
            >
              ⬇ Download PDF
            </button>

            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={printResume}
            >
              🖨 Print Resume
            </button>
          </div>
        )}
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center"
          }}
        >
          <ResumePreview
            resume={generatedResume}
            form={form}
            template={template}
          />
        </div>

      </div>
    </Layout>
  );
}

export default ResumeBuilder;