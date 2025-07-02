import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState(""); // NEW: role state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phase, setPhase] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Phase 1: Check if Employee ID is whitelisted and role matches
  const checkEmployeeId = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "whitelist", employeeId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setError("Employee ID not authorized. Contact HR.");
        return;
      }

      const data = docSnap.data();
      if (data.jobRole !== role) {
        setError(`Role mismatch! Expected: ${data.jobRole}`);
        return;
      }

      setPhase(2);
      setError("");
    } catch (err) {
      setError("Firebase error: " + err.message);
    }
  };

  // Phase 2: Create account + store UID mapping
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Use empID as dummy email
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        `${employeeId}@company.com`,
        password
      );

      const uid = userCredential.user.uid;

      // Create userData doc with UID as ID
      await setDoc(doc(db, "userData", uid), {
        EmployeeNumber: parseInt(employeeId,10),
        JobRole: role,
      });

      navigate("/dashboard");
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
            <p className="side-title">Employee ID</p>
            <div className="signup-inline-group">
              <input
                type="text"
                placeholder="Enter your ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="inline-input"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="inline-select"
              >
                <option value="">-- Select role --</option>
                <option value="Manager">Manager</option>
                <option value="Human Resources">HR</option>
              </select>
            </div>

            <button type="submit">Check Details</button>
          </form>

        ) : (
          <form onSubmit={handleSignup}>
            <p className="side-title">Password</p>
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
