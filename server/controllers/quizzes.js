import { Router } from "express";
import allQuizzes from "../quiz-data/quiz-all.json" with { type: "json" }
import TestResult from "../models/testResults.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import adminPermissionMiddleware from "../middleware/permissionsMiddleware.js";

const router = Router();

// return single quiz based on param
router.get("/quiz/test/:quizParam", (request, response) => { // !! will need user validation middleware 
    try {
        // find quiz questions that match quizParam
        const quizQuestions = allQuizzes.filter((quiz) => quiz.quizParam.toLowerCase() === request.params.quizParam.toLowerCase());

        // send quiz data as response
        response.send(quizQuestions);
    }
    catch(err) {
        response.status(500).send({
            message: err.message
        });
    }
});

// send quiz reults to database
router.post("/quiz", validationMiddleware, async (request, response) => { // need to add validationMiddleware once log in works
    if(request.user) {
        try {
            const quizResults = new TestResult({
                user: request.body.user,
                quiz: request.body.quiz,
                numCorrect: request.body.numCorrect,
                numIncorrect: request.body.numIncorrect,
                questions: request.body.questions,
                score: request.body.score
            })
            await quizResults.save();

            response.send({
                message: "Quiz results successfully added to database."
            });
        }
        catch(err) {
            response.status(500).send({
                message: err.message
            });
        }
    }
    else {
        response.status(500).send({
            message: "You must be logged in to submit a quiz."
        })
    }
});

// update quiz data
router.post("/quiz/:quizResultId", validationMiddleware, async (request, response) => { // need to add validationMiddleware once log in works
    if(request.user) {
        try {
            // find quiz to edit
            const quizToEdit = await TestResult.findById(request.params.quizResultId);
            
            // loop through request.body and assign values to quizToEdit
            Object.keys(request.body).forEach((key) => {
                if(Object.keys(quizToEdit._doc).includes(key)) {
                    quizToEdit[key] = request.body[key];
                }
            });
            quizToEdit.save();
            response.send({
                message: "Quiz results successfully updated in database."
            });
        }
        catch(err) {
            response.status(500).send({
                message: err.message
            });
        }
    }
    else {
        response.status(500).send({
            message: "You must be logged in to submit a quiz."
        })
    }
});

// return list of quiz names
router.get("/quiz", (request, response) => {
    try {
        // make array of different quiz names
        let quizParams = [];
        let quizList = [];
        allQuizzes.forEach((quiz) => {
            if(!quizParams.includes(quiz.quizParam)) {
                quizParams.push(quiz.quizParam);
                quizList.push({quizName: quiz.quizName, quizParam: quiz.quizParam});
            }
        });
        
        // send quiz names as array
        response.send(quizList)
    }
    catch(err) {
        response.status(500).send({
            message: err.message
        });
    }
});

// get list of test results for specified user
router.get("/quiz/results", validationMiddleware, async (request, response) => {
    try {
        const testResults = await TestResult.find({ "user.userId": request.user._id.toString() });
        let testPassFail = []
        testResults.forEach((test) => {
            if(test.score >= 80) {
                testPassFail.push({quizParam: test.quiz.quizParam, resultId: test._id, score: test.score, isPassing: true});
            }
            else {
                testPassFail.push({quizParam: test.quiz.quizParam, resultId: test._id, score: test.score, isPassing: false});
            }
        });

        response.send(testPassFail);
    }
    catch(err) {
        response.status(500).send({
            message: err.message,
        });
    }
});

// get list of test results for all users
router.get("/quiz/results/all", adminPermissionMiddleware, async (request, response) => {
    try {
        const testResults = await TestResult.find({});
        response.send(testResults)
    }
    catch(err) {
        response.status(500).send({
            message: err.message,
        });
    }
});

export default router;