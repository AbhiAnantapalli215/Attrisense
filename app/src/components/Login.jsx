import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Firebase Auth expects email, so we use `${employeeId}@company.com` as a placeholder
      await signInWithEmailAndPassword(auth, `${employeeId}@company.com`, password);
      localStorage.setItem('employeeNumber', employeeId);
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      setError("Invalid Employee ID or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2 className="title">Login</h2>
        <p className="bg-text">welcome to attrisense</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <p className="side-title">Employee ID</p>
          <input
            type="text"
            placeholder="Enter your id"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
          <p className="side-title">Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="log-in">
            <button type="submit">Login</button>
          </div>
        </form>
        <p className="bg-text">New user? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}