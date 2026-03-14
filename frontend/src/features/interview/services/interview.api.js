import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/interview` : `http://localhost:3000/api/interview`,
    withCredentials: true
})

export async function generateInterviewReport({ jobdescribe, selfdescribe, resumeFile }) {
    const form = new FormData()
    form.append('jobdescribe', jobdescribe)
    form.append('resume', resumeFile)
    form.append('selfdescribe', selfdescribe)
    //NOTE - api call 
    const response = await api.post('/', form, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export async function getInterviewReportById({ interviewId }) {
    const response = await api.get(`/report/${interviewId}`)
    return response.data
}
export async function getInterviewAllReport() {
    const response = await api.get(`/`)
    return response.data
}
export async function generateResumePdf({ interviewId }) {
    const response = await api.get(`/pdf/${interviewId}`, {
        responseType: "blob"
    })
    return response.data
}

