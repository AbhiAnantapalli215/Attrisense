import pandas as pd
import pickle
from sklearn.preprocessing import LabelEncoder, StandardScaler
import os

# Load your dataset
df = pd.read_csv("../employeelist.csv")

# Target column (if present)
target_col = "Attrition"
has_target = target_col in df.columns

# Define features to use
selected_features = [
    'Age', 'BusinessTravel', 'Department', 'DistanceFromHome', 'EducationField',
    'EnvironmentSatisfaction', 'Gender','JobInvolvement', 'JobRole', 'JobSatisfaction', 
    'MaritalStatus', 'MonthlyIncome', 'NumCompaniesWorked', 'OverTime', 
    'RelationshipSatisfaction', 'StockOptionLevel', 'TrainingTimesLastYear', 
    'WorkLifeBalance', 'YearsAtCompany', 'YearsSinceLastPromotion','ManagerID',
]

# Keep only required features
df = df[selected_features + ([target_col] if has_target else [])].copy()

# Encode categorical variables
encoder = {}
cat_cols = df.select_dtypes(include=["object"]).columns
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    encoder[col] = le

# Scale numerical features
scaler = StandardScaler()
num_cols = df.select_dtypes(include=["int64", "float64"]).columns
num_cols = [col for col in num_cols if col != target_col]
df[num_cols] = scaler.fit_transform(df[num_cols])

# Save encoders and scaler
with open("encoder.pkl", "wb") as f:
    pickle.dump(encoder, f)

with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

# Save processed data
X = df.drop(columns=[target_col]) if has_target else df
X.to_csv("X_processed.csv", index=False)

if has_target:
    y = df[target_col].apply(lambda x: 1 if x in [1, "Yes", "yes"] else 0)
    y.to_csv("y_processed.csv", index=False)

print("✅ Preprocessing complete. Files saved: encoder.pkl, scaler.pkl, X_processed.csv", end="")
if has_target:
    print(", y_processed.csv")
