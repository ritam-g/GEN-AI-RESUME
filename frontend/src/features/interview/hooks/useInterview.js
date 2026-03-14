import { useContext } from "react";
import { generateInterviewReport, getInterviewReportById, getInterviewAllReport, generateResumePdf } from "../services/interview.api";
import { Context } from "../context/interviewContext";
import toast from "react-hot-toast";

export function useInterview() {
    const context = useContext(Context)
    const { loading, setLoading, report, setReport, reports, setReports } = context
    async function generateReport({ jobdescribe, selfdescribe, resumeFile }) {
        setLoading(true)
        try {

            const res = await generateInterviewReport({ jobdescribe, selfdescribe, resumeFile })
            setReport(res.interviewReport)
            toast.success("Intelligence report generated!")
            return res.interviewReport
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to generate report")
            throw err

        } finally {
            setLoading(false)
        }

    }
    async function generateReportById({ interviewId }) {
        setLoading(true)
        try {

            const res = await getInterviewReportById({ interviewId })
            setReport(res.interviewReport)
            return res.interviewReport
        } catch (err) {
            console.log(err);
            throw err

        } finally {
            setLoading(false)
        }
    }
    async function getUserAllReports() {
        setLoading(true)
        try {
            // FIX: Backend returns userAllReports, not interviewReport
            const res = await getInterviewAllReport()
            setReports(res.userAllReports)
            return res.userAllReports
        } catch (err) {
            console.log(err);
            throw err
        } finally {
            setLoading(false)
        }
    }
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewId: interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            toast.success("PDF Downloaded successfully")
        }
        catch (error) {
            console.log("PDF Download Error:", error)
            if (error.response && error.response.data) {
                // If it's a blob error, we need to read it as text
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        toast.error(`Download Failed: ${errorData.message}`);
                    } catch {
                        toast.error("Download Failed: Something went wrong with PDF generation");
                    }
                };
                reader.readAsText(error.response.data);
            } else {
                toast.error("Download Failed: Network Error or Server down");
            }
        } finally {
            setLoading(false)
        }
    }
    return { generateReport, getUserAllReports, generateReportById, loading, report, reports, getResumePdf }
}