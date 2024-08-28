import { CSVLink } from "react-csv";
import { useLoaderData } from "react-router-dom";

export async function csvLoader() {
    const response = await fetch("http://localhost:3000/quiz/results/all", {
        method: "GET",
        headers: { "Content-type": "application/json", authorization: localStorage.getItem("jwt-token") }
    });
    const resultsBody = await response.json();
    let resultsData = [];
    resultsBody.forEach((result) => {
        resultsData.push({
            user: {
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                email: result.user.email
            },
            quizName: result.quiz.quizName,
            totalQuestions: Object.keys(result.questions).length,
            numCorrect: result.numCorrect,
            score: result.score,
            date: result.date
        });
    });
    return { resultsData };
}

export default function ReactCSV() {
    const { resultsData } = useLoaderData();

    const date = new Date()
    const csvFileName = "Test-Results_" + date.getTime()
    const headers = [
        {label: "Quiz Name", key: "quizName"},
        {label: "First Name", key: "user.firstName"},
        {label: "Last Name", key: "user.lastName"},
        {label: "Email", key: "user.email"},
        {label: "Total Questions", key: "totalQuestions"},
        {label: "Correct Questions", key: "numCorrect"},
        {label: "Score", key: "score"},
        {label: "Test Date", key: "date"}
    ];

    return (
        <div className="m-5 self-center flex gap-8 h-full">
            <div className="overflow-x-auto border-2">
                <table className="table table-zebra">
                    {/* headers */}
                    <thead>
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i} className="text-2xl text-primary text-center sticky top-0 bg-zinc-500">{header.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                            {resultsData.map((result, i) => (
                                <tr key={i} className="text-base text-center">
                                    <td>{result.quizName}</td>
                                    <td>{result.user.firstName}</td>
                                    <td>{result.user.lastName}</td>
                                    <td>{result.user.email}</td>
                                    <td>{result.totalQuestions}</td>
                                    <td>{result.numCorrect}</td>
                                    <td>{result.score}</td>
                                    <td>{result.date}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <CSVLink
                data={resultsData}
                headers={headers}
                filename={csvFileName}
                className="btn btn-primary"
                target="_blank"
            >
                Download
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </CSVLink>
        </div>
    )
}