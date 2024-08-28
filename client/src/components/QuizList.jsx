import { Link, useLoaderData, useOutletContext } from "react-router-dom";

export async function quizListLoader() {
    const quizListesponse = await fetch("http://localhost:3000/quiz");
    const testResultResponse = await fetch("http://localhost:3000/quiz/results", {
        method: "GET",
        headers: { "Content-type": "application/json", authorization: localStorage.getItem("jwt-token") }
    });

    const quizList = await quizListesponse.json();
    const testResults = await testResultResponse.json();

    // add relevant testResult data to quizList
    quizList.forEach((quiz) => {
        const resultIndex = testResults.findIndex((result) => result.quizParam === quiz.quizParam);
        if(resultIndex >= 0) {
            quiz.score = testResults[resultIndex].score;
            quiz.isPassing = testResults[resultIndex].isPassing;
        }
        else {
            quiz.score = undefined;
            quiz.isPassing = undefined;
        }
    });

    return { quizList };
}

export default function QuizList() {
    const { quizList } = useLoaderData();

    // set values for radial progress bar
    const totalPossibleScore = quizList.length * 100;
    let userTotalScore = 0;
    quizList.forEach((quiz) => {
        if(quiz.score) {
            userTotalScore += quiz.score;
        }
    });
    const radialProgressAmount = Math.trunc((userTotalScore/totalPossibleScore) * 100);

    return (
        <div className="flex flex-col items-center m-5">
            <div className="flex w-8/12 justify-around items-center">
                <div className="text-6xl mb-7">Quizzes</div>
                <div className="flex gap-3 items-center">
                    <div className="text-xl">Total Progress:</div>
                    <div className="radial-progress text-primary text-2xl m-4" style={{"--value": radialProgressAmount, "--size": "12rem", "--thickness": "1rem"}} role="progressbar">{radialProgressAmount}%</div>
                </div>
            </div>
            <ul className="menu flex flex-col bg-base-200 w-3/5 h-full rounded-box items-center">
                {quizList.map((quiz, i) => (
                    <div key={i} className="m-4 w-11/12 flex justify-between overflow-visible">
                        <Link to={`${quiz.quizParam}`} className="p-2 text-2xl rounded-lg hover:bg-neutral-300">{quiz.quizName}</Link>
                        <div className="w-1/5 flex justify-between items-center">
                            {quiz.score ? (
                                <>
                                    <div>{quiz.score}%</div>
                                    {quiz.isPassing ? (
                                        <>
                                            {quiz.score === 100 ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="size-10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="darkorange" className="size-10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            )}
                                        </>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div>-%</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                    </svg>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    )
}