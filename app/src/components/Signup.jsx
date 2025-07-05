import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // ✅ Add this!

export default function Signup() {
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ NEW
  const [phase, setPhase] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        `${employeeId}@company.com`,
        password
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "userData", uid), {
        EmployeeNumber: parseInt(employeeId, 10),
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
            <p className="bg-text">
              Already have an account?? <a href="/login">Sign in</a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
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

            <div className="password-wrapper">
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"} // ✅ Use separate toggle
                  placeholder="Re-enter your password"
                  value={confirmPassword} // ✅ Use confirmPassword state
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="toggle-password">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>

            <button type="submit">Sign Up</button>
          </form>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
