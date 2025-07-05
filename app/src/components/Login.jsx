import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 new
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
            placeholder="Enter your ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
          <p className="side-title">Password</p>
          <div className="password-wrapper">
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="toggle-password">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>

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
