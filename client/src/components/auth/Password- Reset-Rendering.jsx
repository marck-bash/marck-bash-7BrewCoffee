import { Route, Routes } from "react-router-dom";
import Email from "./Password-Reset-Email-Page";
import Password from "./Password-Reset-Password-Page";

export default function PasswordReset() {
	
	return (
		<>
        <Routes>
            <Route
            path='/email'
            element={<Email />}
            />
            <Route
            path='/newPassword/:_id'
            element={<Password />}
            />
        </Routes>
		</>
	)
}