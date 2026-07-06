import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import ResumeHeader from "../resume/ResumeHeader";
import SectionTitle from "../resume/SectionTitle";
import SkillBadge from "../resume/SkillBadge";
import ResumeSidebar from "../resume/ResumeSidebar";
import ResumeContent from "../resume/ResumeContent";
import { toArray, renderText } from "../utils/resumeUtils";

function ClassicResume({ resume, form }) {
    const resumeRef = useRef(null);


    if (!resume) return null;

    const downloadPDF = async () => {
        const canvas = await html2canvas(resumeRef.current, {
            scale: 2,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("ATS_Resume.pdf");
    };

    const technicalSkills = toArray(resume.technicalSkills);
    const softSkills = toArray(resume.softSkills);
    const certifications = toArray(resume.certifications);
    const projects = Array.isArray(resume.projects) ? resume.projects : [];
    const experience = Array.isArray(resume.experience) ? resume.experience : [];

    return (
        <div className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">


                <button className="btn btn-danger" onClick={downloadPDF}>
                    Download PDF
                </button>
            </div>

            <div
                ref={resumeRef}
                className="bg-white shadow mx-auto"
                style={{
                    width: "794px",
                    minHeight: "1123px",
                    color: "#222",
                    fontFamily: "Arial, sans-serif",
                    overflow: "hidden"
                }}
            >
                <ResumeHeader
                    resume={resume}
                    form={form}
                />

                {/* Body */}
                <div style={{ display: "grid", gridTemplateColumns: "32% 68%" }}>
                    {/* Left Column */}
                    <ResumeSidebar
                        technicalSkills={technicalSkills}
                        softSkills={softSkills}
                        certifications={certifications}
                        education={resume.education}
                        renderText={renderText}
                    />
                    {/* Right Column */}
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
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#6b7280",
                        padding: "12px",
                        borderTop: "1px solid #e5e7eb"
                    }}
                >

                </div>
            </div>
        </div>
    );
}



export default ClassicResume;