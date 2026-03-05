const { GoogleGenAI } = require("@google/genai");
const { z } = require('zod')
const { zodToJsonSchema } = require("zod-to-json-schema");
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
const interviewReportSchema = z.object({
     matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Match score between candidate and job requirements (0-100). 100 means perfect match."
    ),technicalQuestions: z.array(z.object({
        question: z.string().describe("the technical quesiton can be asked in interview"),
        intention: z.string().describe("the intention of the interview behind the question"),
        answer: z.string().describe("how to answer the question ,what points to cover,what approach to take etc."),
    })).describe("technical quesiton can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("the technical quesiton can be asked in interview"),
        intention: z.string().describe("the intention of the interview behind the question"),
        answer: z.string().describe("how to answer the question ,what points to cover,what approach to take etc."),
    })).describe("Behavioral quesiton can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("the skill which is gap in the candidate"),
        severity: z.string().describe("the severity of the skill gap can be low, medium or high"),
    })).describe("list of skill gaps in the candidate along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.string().describe("the day number of the preparation plan"),
        focus: z.string().describe("the main focus of the day in the preparation plan"),
        tasks: z.string().describe("the tasks for the day in the preparation plan"),
    })).describe("the preparation plan for the candidate to prepare for the interview"),


})
async function invoke({jobdescribe, resume, selfdescribe }) {
    const prompt =
        `generate an interview report for a candidate based on the job description, resume and self description of the candidate.
        The job description is ${jobdescribe},
        the resume of the candidate is ${resume} and
        the self description of the candidate is ${selfdescribe}.
        The response should be in json format and should follow the schema defined in zod.`
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        },
    })
  
    console.log(response.text);

}

module.exports = invoke
