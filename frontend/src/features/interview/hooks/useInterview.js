import { useContext } from "react";
import { generateInterviewReport, getInterviewReportById, getInterviewAllReport } from "../services/interview.api";
import { Context } from "../context/interviewContext";

export function useInterview() {
    const context = useContext(Context)
    const { loading, setLoading, report, setReport, reports, setReports } = context
    async function generateReport({ jobdescribe, selfdescribe, resumeFile }) {
        setLoading(true)
        try {

            const res = await generateInterviewReport({ jobdescribe, selfdescribe, resumeFile })
            setReport(res.interviewReport)
        } catch (err) {
            console.log(err);
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

            const res = await getInterviewAllReport()
            setReports(res.interviewReport)
        } catch (err) {
            console.log(err);
            throw err

        } finally {
            setLoading(false)
        }

    }
    return { generateReport, getUserAllReports, generateReportById, loading, report, reports }
}