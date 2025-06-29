import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phase, setPhase] = useState(1); // 1 = ID check, 2 = password setup
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Phase 1: Check if Employee ID is whitelisted
  const checkEmployeeId = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "whitelist", employeeId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setError("Employee ID not authorized. Contact HR.");
      } else {
        setPhase(2); // Move to password phase
        setError("");
      }
    } catch (err) {
      setError("Firebase error: " + err.message);
    }
  };

  // Phase 2: Create account
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      // Use `${employeeId}@company.com` as email placeholder
      await createUserWithEmailAndPassword(auth, `${employeeId}@company.com`, password);
      localStorage.setItem('employeeNumber', employeeId);
      navigate("/dashboard"); // Redirect after signup
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This employee is already registered.");
      } else {
      setError("Signup failed: " + err.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup">
          <h2 className="title">Signup</h2>
          {phase === 1 ? (
            <form onSubmit={checkEmployeeId}>
              <p className="side-tile">Employee ID</p>
              <input
                type="text"
                placeholder="Enter your id"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
              <button type="submit">Check Employee ID</button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <p className="side-tile">Password</p>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit">Sign Up</button>
            </form>
          )}
          {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}