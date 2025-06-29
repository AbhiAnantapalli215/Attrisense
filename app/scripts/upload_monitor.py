import firebase_admin # type: ignore
from firebase_admin import credentials, firestore # type: ignore
from datetime import datetime, timezone
import pandas as pd
import pickle

# === Step 1: Initialize Firebase Admin ===
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# === Step 2: Load Model, Encoder, Scaler ===
with open("./model.pkl", "rb") as f:
    model = pickle.load(f)

with open("./encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

with open("./scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# === Step 3: Setup Feature Lists ===
selected_features = [
    'Age', 'BusinessTravel', 'Department', 'DistanceFromHome', 'EducationField',
    'EnvironmentSatisfaction', 'Gender', 'JobInvolvement', 'JobRole', 'JobSatisfaction',
    'MaritalStatus', 'MonthlyIncome', 'NumCompaniesWorked', 'OverTime',
    'RelationshipSatisfaction', 'StockOptionLevel', 'TrainingTimesLastYear',
    'WorkLifeBalance', 'YearsAtCompany', 'YearsSinceLastPromotion','ManagerID'
]

categorical_features = list(encoder.keys())
numeric_features = scaler.feature_names_in_.tolist()

# === Step 4: Prediction Function ===
def preprocess_and_predict(raw_data: dict):
    data = {k: raw_data.get(k, 0) for k in selected_features}
    df = pd.DataFrame([data])

    # Encode categorical fields
    for col in categorical_features:
        try:
            df[col] = encoder[col].transform([df[col][0]])
        except:
            df[col] = 0  # fallback for unseen category

    # Scale numeric fields
    df[numeric_features] = scaler.transform(df[numeric_features])

    df = df[selected_features]
    return float(model.predict_proba(df)[0][1])

# === Step 5: Update Firestore Employees ===
def update_firestore_employees():
    now = datetime.now(timezone.utc).isoformat()
    employees_ref = db.collection("employeelist")  # Change to "employeelist" if needed
    docs = employees_ref.stream()

    for doc in docs:
        data = doc.to_dict()
        emp_id = doc.id

        try:
            score = preprocess_and_predict(data)

            employees_ref.document(emp_id).update({
                "monitor": {
                    "prediction": round(score, 2),
                    "prediction_timestamp": now
                }
            })

            print(f"✅ Updated {emp_id} with score: {round(score, 3)}")
        except Exception as e:
            print(f"❌ Failed to process {emp_id}: {e}")

# === Run ===
if __name__ == "__main__":
    update_firestore_employees()
