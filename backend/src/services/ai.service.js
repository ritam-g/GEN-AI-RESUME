const { GoogleGenAI } = require("@google/genai");
const { z } = require('zod')
const puppeteer = require('puppeteer');
const { zodToJsonSchema } = require('zod-to-json-schema')
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
//NOTE - this schema defines the exact AI output shape we persist to MongoDB.
const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Match score between candidate and job requirements (0-100). 100 means perfect match."
        ), technicalQuestions: z.array(z.object({
            question: z.string().describe("the technical quesiton can be asked in interview"),
            intention: z.string().describe("the intention of the interview behind the question"),
            answer: z.string().describe("how to answer the question ,what points to cover,what approach to take etc."),
        }))
            .min(1)
            .describe("technical quesiton can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("the technical quesiton can be asked in interview"),
        intention: z.string().describe("the intention of the interview behind the question"),
        answer: z.string().describe("how to answer the question ,what points to cover,what approach to take etc."),
    }))
        .min(1)
        .describe("Behavioral quesiton can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("the skill which is gap in the candidate"),
        severity: z.enum(["low", "medium", "high"]).describe("the severity of the skill gap can be low, medium or high"),
    }))
        .min(1)
        .describe("list of skill gaps in the candidate along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().int().min(1).describe("the day number of the preparation plan"),
        focus: z.string().describe("the main focus of the day in the preparation plan"),
        tasks: z.array(z.string()).min(1).describe("the tasks for the day in the preparation plan"),
    }))
        .min(1)
        .describe("the preparation plan for the candidate to prepare for the interview"),
    title: z.string().describe("the title of the interview report, usually the job title")


})
//REVIEW - keep this JSON schema in sync with `interviewReport.model.js`.
const { $schema, ...interviewReportJsonSchema } = z.toJSONSchema(interviewReportSchema)

function createServiceError(message, statusCode) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

async function interviewReportByAi({ jobdescribe, resume, selfdescribe }) {
    const prompt = `
You are an expert technical interviewer and career coach.

Your task is to generate a structured interview preparation report for a candidate.

Analyze the following information carefully and produce a detailed report.

Job Description:
${jobdescribe}

Candidate Resume:
${resume}

Candidate Self Description:
${selfdescribe}

Instructions:

Return ONLY valid JSON that strictly follows the provided schema.

Generate the following information:

1. matchScore
- A number between 0 and 100.
- Represents how well the candidate matches the job description based on resume and self description.

2. technicalQuestions
- Generate 5 realistic technical interview questions related to the job.
- Each item must be an object with:
  - question
  - intention (why the interviewer asks this question)
  - answer (how the candidate should answer, what key points to cover).

3. behavioralQuestions
- Generate 5 behavioral interview questions.
- Focus on teamwork, communication, leadership, problem solving, and conflict resolution.
- Each item must include question, intention, and answer guidance.

4. skillGaps
- Identify missing or weak skills in the candidate compared to the job description.
- Each item must contain:
  - skill
  - severity (must be exactly one of: "low", "medium", "high")

5. preparationPlan
- Create a 7 day preparation plan.
- Each day must include:
  - day (number starting from 1)
  - focus (main learning goal of the day)
  - tasks (array of practical tasks the candidate should perform)

Important Rules:
- Return ONLY JSON.
- Do NOT include explanations.
- Do NOT include markdown.
- Arrays must contain objects exactly matching the schema.
- Ensure all fields exist and match the schema types.

Generate the interview report now.
`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            //NOTE - response schema enforces structured JSON from the model.
            responseMimeType: "application/json",
            responseSchema: interviewReportJsonSchema,
        },
    })

    if (!response.text) {
        throw createServiceError("Empty response from AI service", 502)
    }

    let parsedResponse
    try {
        parsedResponse = JSON.parse(response.text)
    } catch {
        throw createServiceError("AI returned non-JSON response", 502)
    }

    //REVIEW - runtime validation prevents malformed AI payloads from reaching DB writes.
    const validatedResponse = interviewReportSchema.safeParse(parsedResponse)
    if (!validatedResponse.success) {
        throw createServiceError(`AI returned invalid interview report format: ${validatedResponse.error.message}`, 502)
    }

    return validatedResponse.data

}


/**
 * Generate PDF from HTML using Puppeteer
 * @param {string} htmlContent
 * @returns {Promise<Buffer>}
 */
async function generatePdfFromHtml(htmlContent) {
    let browser;

    try {
        let exePath = process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();
        
        // Render common paths fallback
        const commonPaths = [
            "/opt/render/project/puppeteer/chrome/linux-133.0.6943.126/chrome-linux64/chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome",
            "/opt/google/chrome/chrome"
        ];
        
        const fs = require('fs');
        if (!fs.existsSync(exePath)) {
            for (const path of commonPaths) {
                if (fs.existsSync(path)) {
                    exePath = path;
                    break;
                }
            }
        }

        console.log("Launching Puppeteer with path:", exePath);
        
        browser = await puppeteer.launch({
            headless: true,
            executablePath: exePath,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--font-render-hinting=none"
            ]
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            scale: 1,
            margin: {
                top: "18mm",
                bottom: "18mm",
                left: "16mm",
                right: "16mm"
            },
            timeout: 0
        });

        return pdfBuffer;

    } catch (error) {
        console.error("PDF generation failed:", error.message, error.stack);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}
module.exports = { interviewReportByAi, generateResumePdf }
