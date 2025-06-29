const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const csv = require("csv-parser");

// Initialize Firebase
const serviceAccount = require("../serviceAccountKey.json");
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

// Configuration
const BATCH_SIZE = 500;
let batch = db.batch();  // Initial batch
let batchCount = 0;
let totalProcessed = 0;

// Process CSV
fs.createReadStream("../employeelist.csv")
  .pipe(csv())
  .on('data', async (row) => {
    const employeeId = row.EmployeeNumber?.trim();
    if (!employeeId) return;

    // Prepare document data
    const docData = {};
    for (const [key, value] of Object.entries(row)) {
      if (key === "TerminationDate") {
        if (!value || value.trim() === "") {
          docData[key] = null;  // Store as Firestore null
        } else {
          docData[key] = value.trim();  // Store as string date
        }
      } else {
        docData[key] = isNaN(value) ? value.trim() : Number(value);
      }
    }

    // Add to batch
    batch.set(db.collection("employeelist").doc(employeeId), docData);
    batchCount++;
    totalProcessed++;

    // Commit batch when full
    if (batchCount >= BATCH_SIZE) {
      const commitBatch = batch;  // Store reference to current batch
      batch = db.batch();         // Create new batch immediately
      batchCount = 0;
      
      try {
        await commitBatch.commit();
        console.log(`Committed batch of ${BATCH_SIZE} records`);
      } catch (err) {
        console.error("Batch commit error:", err);
      }
    }
  })
  .on('end', async () => {
    // Commit final batch
    if (batchCount > 0) {
      try {
        await batch.commit();
        console.log(`Committed final batch of ${batchCount} records`);
      } catch (err) {
        console.error("Final batch commit error:", err);
      }
    }
    console.log(`✅ Successfully processed ${totalProcessed} records`);
  })
  .on('error', (err) => {
    console.error("CSV processing error:", err);
    process.exit(1);
  });