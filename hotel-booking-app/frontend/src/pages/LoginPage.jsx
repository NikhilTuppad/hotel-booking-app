import {Link, Navigate} from "react-router-dom";
import {useContext, useState} from "react";
import { loginUser } from "../api/authApi.js";
import {UserContext} from "../context/UserContext.jsx";
import { showSuccess, showError } from "../utils/toast.js";

export default function LoginPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);
    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
          const {data} = await loginUser({ email, password });
            setUser(data);
            showSuccess('Login successful!');
            setRedirect(true);
        } catch (e) {
            showError('Login failed. Please check your credentials.');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input type="email"
                        placeholder="your@email.com"
                        value={email}
                 onChange={ev => setEmail(ev.target.value)}/>
                    <input type="password"
                        placeholder="password"
                        value={password}
                 onChange={ev => setPassword(ev.target.value)} />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                    Don't have an account yet? <Link className="underline text-blue-600" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}