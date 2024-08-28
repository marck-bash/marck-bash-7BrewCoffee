import { useState } from "react";
import { Link, useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'

export async function quizLoader({ params }) {
    const response = await fetch(`http://localhost:3000/quiz/test/${params.quizParam.toLowerCase()}`);
    
    const quiz = await response.json();
    return { quiz };
}

export default function Quiz() {
    // retrieve selected quiz data on load
    const { quiz } = useLoaderData();
    const { userInfo } = useOutletContext();

    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [hasClickedSubmit, setHasClickedSubmit] = useState(false)
    const navigate = useNavigate();

    

    async function submitQuiz(event) {
        event.preventDefault();
        setHasClickedSubmit(true);

        // only allow submit if all questions are answered
        if(quiz.length !== selectedAnswers.length) {
            // display pop up that says must answer all questions
            alert("All questions must be answered.")
            // set questions that haven't been answered
            quiz.forEach((question) => {
                question.unanswered = selectedAnswers.some((answer) => answer.question !== question.question);
            });

            return;
        }
        // calculate number correct and incorrect
        let numCorrect = 0;
        let numIncorrect = 0;
        selectedAnswers.forEach((question) => {
            if(question.isCorrect) {
                numCorrect++;
            }
            else {
                numIncorrect++;
            }
        });

        // convert answers to full answers for database
        let uploadQuestions = [];
        selectedAnswers.forEach((answer) => {
            uploadQuestions.push({
                question: answer.question,
                chosenAnswer: answer.chosenAnswerText,
                correctAnswer: answer.correctAnswerText,
                isCorrect: answer.isCorrect
            });
        });

        // calculate score 
        const score = (numCorrect / quiz.length) * 100;
        
        // get user's test results from database
        const response = await fetch("http://localhost:3000/quiz/results", {
            method: "GET",
            headers: { "Content-type": "application/json", authorization: localStorage.getItem("jwt-token") }
        });
        const testResults = await response.json();
        const sameTestResult = testResults.find((test) => test.quizParam === quiz[0].quizParam);
        
        // check if already taken quiz
        if(sameTestResult) {
            // replace with new score if higher score 
            if(score > sameTestResult.score) {
                const results = {score, numCorrect, numIncorrect, questions: uploadQuestions};
                console.log(results)

                // send updated quiz results to database
                const response = await fetch(`http://localhost:3000/quiz/${sameTestResult.resultId}`, {
                    method: "POST",
                    headers: { 
                        "Content-type": "application/json", 
                        authorization: localStorage.getItem("jwt-token") 
                    },
                    body: JSON.stringify(results)
                });

                if(!response.ok) {
                    console.log(response)
                    console.error("Failed to upload test results to database");
                    return;
                }
            }
        }
        else {
            const results = {
                user: {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    email: userInfo.email,
                    userId: userInfo.userId
                },
                quiz: {
                    quizName: quiz[0].quizName,
                    quizParam: quiz[0].quizParam
                },
                numCorrect,
                numIncorrect,
                questions: uploadQuestions,
                score
            }

            // send quiz results to database
            const response = await fetch("http://localhost:3000/quiz", {
                method: "POST",
                headers: { 
                    "Content-type": "application/json", 
                    authorization: localStorage.getItem("jwt-token") 
                },
                body: JSON.stringify(results)
            });
            const body = await response.json();

            if(!response.ok) {
                console.error(body.message);
                return;
            }
        }

        // send user back to quiz list page
        navigate("/quiz");
    }

    function gatherCheckboxAnswers(event, singleQuestion) {
        const question = singleQuestion.question;
        const correctAnswer = singleQuestion.answer;
        const chosenAnswer = event.target.value;
        const correctAnswerText = correctAnswer.map((choice) => choice = singleQuestion.answerChoices[choice]);
        let chosenAnswerText = [];
        let isCorrect;
        // if question is not already in selectedAnswers...
        if(!selectedAnswers.some((answer) => answer.question === question)) {
            chosenAnswerText.push(singleQuestion.answerChoices[chosenAnswer]);
            // set isCorrect
            isCorrect = singleQuestion.answer.every((choice) => [chosenAnswer].includes(choice));
            // add question, chosen answer, and correct answer to selectedAnswers
            setSelectedAnswers([...selectedAnswers, { question, chosenAnswer: [chosenAnswer], chosenAnswerText, correctAnswerText, isCorrect }]);
        }
        // if question is already in selectedAnswers...
        else {
            let tempAnswers = selectedAnswers;
            const answerToChangeIndex = tempAnswers.findIndex((answer) => answer.question === question);
            // if answer is already checked...
            if(tempAnswers[answerToChangeIndex].chosenAnswer.includes(chosenAnswer)) {
                const choiceIndex = tempAnswers[answerToChangeIndex].chosenAnswer.findIndex((choice) => choice === chosenAnswer);
                // remove from answer list
                tempAnswers[answerToChangeIndex].chosenAnswer.splice(choiceIndex, 1);
                tempAnswers[answerToChangeIndex].chosenAnswerText.splice(choiceIndex, 1);
            }
            // if answer is not checked yet...
            else {
                // add to answer list
                tempAnswers[answerToChangeIndex].chosenAnswer.push(chosenAnswer);
                tempAnswers[answerToChangeIndex].chosenAnswerText.push(singleQuestion.answerChoices[chosenAnswer]);
            }

            // set isCorrect
            tempAnswers[answerToChangeIndex].isCorrect = singleQuestion.answer.every((choice) => tempAnswers[answerToChangeIndex].chosenAnswer.includes(choice));
            setSelectedAnswers(tempAnswers);
        }
    }
    
    function gatherRadioAnswers(event, singleQuestion) {
        const question = singleQuestion.question;
        const correctAnswer = singleQuestion.answer;
        const chosenAnswer = event.target.value;
        const correctAnswerText = singleQuestion.answerChoices[correctAnswer];
        let chosenAnswerText;
        let isCorrect;

        // if question is not already in selectedAnswers...
        if(!selectedAnswers.some((answer) => answer.question === question)) {
            chosenAnswerText = singleQuestion.answerChoices[chosenAnswer];
            // set isCorrect
            isCorrect = (singleQuestion.answerChoices[chosenAnswer] === singleQuestion.answerChoices[correctAnswer]);
            // add question, chosen answer, and correct answer to selectedAnswers
            setSelectedAnswers([...selectedAnswers, { question, chosenAnswer, chosenAnswerText, correctAnswerText, isCorrect }]);
        }
        // if question is already in selectedAnswers...
        else {
            // update chosen answer on matching question
            let tempAnswers = selectedAnswers;
            const answerToChangeIndex = tempAnswers.findIndex((answer) => answer.question === question);
            // change chosen answer to new answer
            tempAnswers[answerToChangeIndex].chosenAnswer = chosenAnswer;
            tempAnswers.chosenAnswerText = singleQuestion.answerChoices[chosenAnswer];
            // set isCorrect
            tempAnswers[answerToChangeIndex].isCorrect = (singleQuestion.answerChoices[chosenAnswer] === singleQuestion.answerChoices[correctAnswer]);
            setSelectedAnswers(tempAnswers);
        }
    }


    return (
        <div className="flex flex-col items-center m-5">
            <div className="text-5xl m-7">{quiz[0].quizName}</div>
            <form onSubmit={submitQuiz}>
                <div className="m-5">
                    {quiz.map((singleQuestion, i) => (
                        <div key={i}>
                            <div className="flex gap-4 content-center">
                                <div className="text-2xl mt-4">{singleQuestion.question}</div>
                                {hasClickedSubmit && singleQuestion.unanswered ? (
                                    <div className="mt-5 flex gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="red" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                        </svg>
                                        Please answer all questions!
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            {singleQuestion.questionType === "selectAll" ? (
                                <>
                                    {Object.keys(singleQuestion.answerChoices).map((choice, j) => (
                                        <div key={j} className="form-control flex-row">
                                            <label className="label cursor-pointer">
                                                <input type="checkbox" name={`checkbox-${i}`} value={choice} onChange={(event) => gatherCheckboxAnswers(event, singleQuestion)} className="checkbox m-3" />
                                                <span className="text-lg">{singleQuestion.answerChoices[choice]}</span>
                                            </label>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {Object.keys(singleQuestion.answerChoices).map((choice, j) => (
                                        <div key={j} className="form-control flex-row">
                                            <label className="label cursor-pointer">
                                                <input type="radio" name={`radio-${i}`} value={choice}  onChange={(event) => gatherRadioAnswers(event, singleQuestion)} className="radio m-3" />
                                                <span>{singleQuestion.answerChoices[choice]}</span>
                                            </label>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-around w-full">
                    <button className="btn btn-neutral">
                        <Link to={"../quiz"}>Cancel</Link>
                    </button>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}