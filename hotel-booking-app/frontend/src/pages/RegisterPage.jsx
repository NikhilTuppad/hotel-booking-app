import { Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api/authApi.js";
import { showSuccess, showError } from "../utils/toast.js";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function register(ev) {
    ev.preventDefault();

    try {
      const response = await registerUser({
        name,
        email,
        password,
      });

      console.log("REGISTER RESPONSE:", response.data);

      showSuccess('Registration successful! Now you can log in.');
    } catch (e) {
      console.error("REGISTER ERROR:", e.response?.data || e.message);
      showError('Registration failed. Please check your information.');
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>

        <form className="max-w-md mx-auto" onSubmit={register}>
          
          <input
            type="text"
            placeholder="Vivek Panchal"
            value={name}
            onChange={ev => setName(ev.target.value)}
          />

          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />

          <button className="primary">Register</button>

          <div className="text-center py-2 text-gray-500">
            Already a member?{" "}
            <Link className="underline text-blue-600" to={'/login'}>
              Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}