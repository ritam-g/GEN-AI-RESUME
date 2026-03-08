const express = require('express');
const authUser = require('../middleware/auth.middleware');
const { generateInterviewController, interviewRepoerByIdController, getAllInterviewReports, genereateJobReadyPdfController } = require('../controller/interview.controller');
const upload = require('../middleware/file.middleware');


const interviewRoute = express.Router()
//NOTE - wrap multer to return clean API errors from this route.
const uploadResume = (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        //REVIEW - keep this wrapper if no global express error middleware is configured.
        next()
    })
}
/**
 * @route POST /api/interview/
 * @description it will take resume desc,job dec and user self intro 
 * @acess private
 */

interviewRoute.post('/', authUser, uploadResume, generateInterviewController)
/**
 * @route get /api/interview/report/:interviewId
 * @description it will take interview id and return the interview report
 * @acess private
 */

interviewRoute.get('/report/:interviewId', authUser, interviewRepoerByIdController)
/**
 * @route get /api/interview/
 * @description it will return all the interview report of the user
 * @acess private
 */

interviewRoute.get('/', authUser, getAllInterviewReports)
/**
 * @route get /api/interview/pdf/:interviewId
 * @description it will pdf of based ono job friendly 
 * @acess private
 */

interviewRoute.get('/pdf/:interviewId', authUser, genereateJobReadyPdfController)

module.exports = interviewRoute
