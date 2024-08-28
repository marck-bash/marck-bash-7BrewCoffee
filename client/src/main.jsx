import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Flashcards from './components/Flashcards.jsx'
import EmpCreation from './components/auth/EmpCreation.jsx'
import AdminSignUp from './components/auth/AdminSignUp.jsx'
import Quiz, { quizLoader } from './components/Quiz.jsx'
import QuizList, { quizListLoader } from './components/QuizList.jsx'
import Email from './components/auth/Password-Reset-Email-Page.jsx'
import Password from './components/auth/Password-Reset-Password-Page.jsx'
import Auth from './components/auth/Auth.jsx'
import ViewAllUsers from './components/auth/ViewAllUsers.jsx'
import EditProfileCard from './components/auth/EditProfileCard.jsx'
import Recipes from './components/Recipes.jsx'
import DisplayRecipes from './components/Display-Recipes.jsx'
import PasswordReset from './components/auth/Password- Reset-Rendering.jsx'
import ReactCSV, { csvLoader } from './components/ReactCSV.jsx'
import DailyNews, { dailyNewsLoader } from './components/DailyNews.jsx'
import ErrorPage from './components/ErrorPage.jsx'

// router for when regular employee is logged in
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <DailyNews />,
				loader: dailyNewsLoader
			},
			{
				path: "/flashcards",
				element: <Flashcards />
			},
			{
				path: "/quiz",
				element: <QuizList />,
				loader: quizListLoader
			},
			{
				path: "/quiz/:quizParam",
				element: <Quiz />,
				loader: quizLoader
			},
			{
				path: "/email",
				element: <Email />
			},
			{
				path: "/newPassword/:_id",
				element: <Password />
			},
			{
				path: "/allusers",
				element: <ViewAllUsers />
			},
			{
				path: "/addAdmin",
				element: <AdminSignUp />
			},
			{
				path: "/addEmployee",
				element: <EmpCreation />
			},
			{
				path: "/edit",
				element: <EditProfileCard />
			},
			{
				path: "/recipes",
				element: <Recipes />
			},
			{
				path: "/allRecipes",
				element: <DisplayRecipes />
			},
			{
				path: "/testResults",
				element: <ReactCSV />,
				loader: csvLoader
			}
		]
	},
	{
		path: "/user",
		element: <PasswordReset />,
		children: [
			{
				path: "/user/email",
				element: <Email />
			},
			{
				path: "/user/newPassword/:_id",
				element: <Password />
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById('root')).render(

	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>,

)
