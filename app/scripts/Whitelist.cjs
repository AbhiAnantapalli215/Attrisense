const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const csv = require("csv-parser");

// 1. Track all promises
const uploadPromises = [];

// 2. Enhanced error handling
process.on('unhandledRejection', (err) => {
  console.error('‼️ Unhandled Rejection:', err);
  process.exit(1);
});

console.log('🚀 1 - Starting whitelist upload process');

// 3. Initialize Firebase
let db;
try {
  const serviceAccount = require("../serviceAccountKey.json");
  console.log('✅ 2 - Service account loaded');
  
  const app = initializeApp({
    credential: cert(serviceAccount),
  });
  db = getFirestore(app);
  console.log('🔥 3 - Firebase initialized');
} catch (error) {
  console.error('❌ Initialization failed:', error);
  process.exit(1);
}

// 4. Process CSV
console.log('📂 4 - Starting CSV processing');
fs.createReadStream("../whitelist.csv")
  .pipe(csv())
  .on('data', (row) => {
    const employeeId = row.EmployeeNumber?.trim();
    if (!employeeId) {
      console.warn('⚠️ Skipping row with missing EmployeeNumber');
      return;
    }

    // 5. Track each upload promise
    const uploadPromise = (async () => {
      try {
        const employeeData = {
          name: row.Name?.trim(),
          department: row.Department?.trim(),
          jobRole: row.JobRole?.trim(),
          createdAt: new Date().toISOString()
        };

        console.log(`⏳ Attempting upload for ${employeeId}`);
        await db.collection("whitelist").doc(employeeId).set(employeeData);
        console.log(`✅ Success: ${employeeId}`);
        return { success: true, id: employeeId };
      } catch (error) {
        console.error(`❌ Failed ${employeeId}:`, error.message);
        return { success: false, id: employeeId, error: error.message };
      }
    })();

    uploadPromises.push(uploadPromise);
  })
  .on('end', async () => {
    console.log('🔄 Waiting for all uploads to complete...');
    
    try {
      // 6. Wait for all promises to settle
      const results = await Promise.allSettled(uploadPromises);
      
      const successCount = results.filter(r => r.value?.success).length;
      const errorCount = results.filter(r => !r.value?.success).length;
      
      console.log('\n📊 Final Results:');
      console.log(`✅ Successful: ${successCount}`);
      console.log(`❌ Failed: ${errorCount}`);
      
      if (errorCount > 0) {
        console.log('\nFailed IDs:');
        results.filter(r => !r.value?.success)
          .forEach(r => console.log(`- ${r.value.id}`));
        process.exit(1);
      } else {
        console.log('🏁 All records processed successfully');
        process.exit(0);
      }
    } catch (error) {
      console.error('💥 Final processing error:', error);
      process.exit(1);
    }
  })
  .on('error', (error) => {
    console.error('📛 CSV read error:', error);
    process.exit(1);
  });