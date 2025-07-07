import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSnackbar } from "notistack";
import { useNavigate,useSearchParams } from 'react-router-dom';

export default function Profile({ employee, employeeId }) {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(employee);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSave = async () => {
    const updates = {};
    editableFields.forEach(field => {
      updates[field] = profile[field];
    });

    try {
      const docRef = doc(db, "employeelist", String(employeeId));
      await updateDoc(docRef, updates);
      enqueueSnackbar("Profile updated successfully.", { variant: "success" });
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      enqueueSnackbar("Failed to update profile.", { variant: "error" });
    }
  };

  const formattedDate = profile.monitor?.prediction_timestamp?.split("T")[0] || "";
  const isAttritionYes = profile.Attrition === "Yes";

  const personalFields = [
    "Age",
    "Gender",
    "DistanceFromHome",
    "Education",
    "EducationField",
    "MaritalStatus",
    "RelationshipSatisfaction"
  ];

  const employeeFields = [
    "Department",
    "ManagerID",
    "BusinessTravel",
    "MonthlyIncome",
    "NumCompaniesWorked",
    "TrainingTimesLastYear",
    "YearsAtCompany",
    "YearsSinceLastPromotion"
  ];

  const editableFields = [
    "EnvironmentSatisfaction",
    "JobSatisfaction",
    "JobInvolvement",
    "PerformanceRating",
    "WorkLifeBalance",
    "StockOptionLevel",
    "OverTime"
  ];

  // Define max values for each metric
  const maxValues = {
    EnvironmentSatisfaction: 5,
    JobSatisfaction: 5,
    JobInvolvement: 5,
    PerformanceRating: 5,
    WorkLifeBalance: 5,
    StockOptionLevel: 4,
    OverTime: null // No max for OverTime
  };

  const goBackToDetails = () => {
    navigate(`/list?${searchParams.toString()}`);
  };

  return (
    <>
      <div className="profile-container">
        {isAttritionYes && <div className="left-stamp">LEFT</div>}

        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h1>
              {profile.Name} (#{profile.EmployeeNumber})
            </h1>
            <p>{profile.JobRole}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-grid">
            {personalFields.map((key) => (
              <div key={key} className="profile-field">
                <label>{key}</label>
                <span>{profile[key]?.toString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h2>Employee Details</h2>
          <div className="profile-grid">
            {employeeFields.map((key) => (
              <div key={key} className="profile-field">
                <label>{key}</label>
                <span>{profile[key]?.toString()}</span>
              </div>
            ))}
            <div className="profile-field">
              <label>Prediction</label>
              <span>{profile.monitor?.prediction}</span>
            </div>
            <div className="profile-field">
              <label>Prediction Date</label>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Monthly Metrics</h2>
          <div className="profile-grid">
            {editableFields.map((key) => (
              <div key={key} className="profile-field">
                <label>{key}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={profile[key]}
                    onChange={handleChange}
                    disabled={isAttritionYes}
                  />
                ) : (
                  <span>
                    {profile[key]?.toString()}
                    {maxValues[key] ? ` / ${maxValues[key]}` : ""}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {!isAttritionYes && (
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn save">
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn cancel"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn edit"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="back-button-container">
        <button onClick={goBackToDetails} className="back-button">
          ← Back to Details
        </button>
      </div>
    </>
  );
}
