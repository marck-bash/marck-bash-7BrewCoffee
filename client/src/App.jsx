import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Auth from './components/auth/Auth'
import Header from './components/Header';
import Footer from './components/Footer';
import Email from './components/auth/Password-Reset-Email-Page';
import imageFile from "./images/sevenBrew_Secondary.png"

export default function App() {
	const [token, setToken] = useState(localStorage.getItem("jwt-token"));
	const [userInfo, setUserInfo] = useState({});

	async function getUserInfo() {
		const response = await fetch("http://localhost:3000/user", {
			method: "GET",
			headers: { "Content-type": "application/json", authorization: token }
		});
		const body = await response.json();
		setUserInfo(body.userInfo);
	}
	if(token && Object.keys(userInfo).length === 0) {
		getUserInfo();
	}
	
	return (
		<>
			{token ? (
				<>
					<div className='flex flex-col h-screen overflow-y-auto'>
						<Header />
						<div className='flex flex-col h-full overflow-y-auto'>
							{/* <img src={imageFile} alt='7 brew coffee logo' className='absolute' /> */}
							<Outlet context={{userInfo}} />
						</div>
						<Footer />
					</div>
				</>
			) : (
				<>
					<Auth setToken={setToken} />
				</>
			)}
		</>
	)
}