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
      await signInWithEmailAndPassword(
        auth,
        `${employeeId}@company.com`,
        password
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid Employee ID or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2 className="title">Login</h2>
        <p className="bg-text">Welcome to Attrisense</p>
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
        <p className="bg-text">
          New user? <a href="/signup">Sign up</a>
        </p>
      </div>
      <div className="white-conatainer">
        <p className="demo-text">Came for demo? Use this</p>
        <div className="demo-section">
          <button
            className="demo-button"
            onClick={async (e) => {
              e.preventDefault();
              try {
                await signInWithEmailAndPassword(
                  auth,
                  "1289@company.com",
                  "employee@1289"
                );
                alert("Welcome!! Logging in as Demo User.");
                navigate("/dashboard");
              } catch (err) {
                setError("Failed to log in as Demo User");
              }
            }}
          >
            Demo User
          </button>
        </div>
      </div>

    </div>
  );
}
