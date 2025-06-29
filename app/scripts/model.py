import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

# Load preprocessed data
X = pd.read_csv("X_processed.csv")
y = pd.read_csv("y_processed.csv").squeeze()

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, stratify=y, test_size=0.2, random_state=42
)

# Define models with class_weight='balanced' where supported
models = [
    ("lr", LogisticRegression(C=1.0, max_iter=300, random_state=42, class_weight="balanced")),
    ("rf", RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42, class_weight="balanced")),
    ("xgb", XGBClassifier(n_estimators=150, learning_rate=0.1, max_depth=5, random_state=42, scale_pos_weight=(y == 0).sum() / (y == 1).sum(), eval_metric='logloss')),
    ("gb", GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, random_state=42))
]

# Ensemble model
ensemble = VotingClassifier(estimators=models, voting='soft', weights=[1, 2, 2, 1])
ensemble.fit(X_train, y_train)

# Lower threshold for "likely to leave"
y_prob = ensemble.predict_proba(X_test)[:, 1]
y_pred = (y_prob >= 0.25).astype(int) 

with open("model.pkl", "wb") as f:
    pickle.dump(ensemble, f)