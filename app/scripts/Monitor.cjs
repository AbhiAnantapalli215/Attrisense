const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("../serviceAccountKey.json");

// Initialize Firebase Admin
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

async function createMonitorCollection() {
  const employeelistSnapshot = await db.collection("employeelist").get();

  const now = new Date().toISOString(); // Current timestamp

  const batch = db.batch();

  employeelistSnapshot.forEach((doc) => {
    const data = doc.data();

    // Apply filters: RiskScore > 0.5 and Attrition === "No"
    if (data.monitor.prediction >= 0.5 && data.Attrition === "No") {
      const employeeId = String(data.EmployeeNumber); // Ensure it's a string

      const monitorRef = db.collection("monitor").doc(employeeId);

      const monitorData = {
        EmployeeNumber: data.EmployeeNumber,
        Name: data.Name,
        RiskScore: data.monitor.prediction,
        Department: data.Department,
        addedBy: 0,
        addedAt: now,
        status: "active",
        remarks: "",
      };

      batch.set(monitorRef, monitorData);
    }
  });

  await batch.commit();
  console.log("Monitor collection created for high-risk, non-attrition employees.");
}

createMonitorCollection().catch(console.error);
