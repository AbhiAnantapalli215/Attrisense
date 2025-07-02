// scripts/updateDashboardMetrics.cjs

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

// ✅ Load your service account key
const serviceAccount = require(path.resolve(__dirname, "../serviceAccountKey.json"));

// ✅ Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function updateDashboardMetrics() {
  console.log("⏳ Fetching employee data...");

  const snapshot = await db.collection("employeelist").get();
  const employees = snapshot.docs.map((doc) => doc.data());

  console.log(`✅ Loaded ${employees.length} employees.`);

  // ✅ Always safe numbers
  const totalEmployees = employees.length || 1;

  // 📊 KPIs
  const attritionCount = employees.filter((e) => e.Attrition === "Yes").length;
  const attritionRate = (attritionCount / totalEmployees) * 100;

  const avgYears = employees.reduce((sum, e) => sum + (e.YearsAtCompany || 0), 0) / totalEmployees;
  const avgSatisfaction = employees.reduce((sum, e) => sum + (e.JobSatisfaction || 0), 0) / totalEmployees;
  const avgPerformance = employees.reduce((sum, e) => sum + (e.PerformanceRating || 0), 0) / totalEmployees;
  const avgYearsSinceLastPromotion = employees.reduce((sum, e) => sum + (e.YearsSinceLastPromotion || 0), 0) / totalEmployees;

  // ✅ Group: attrition by department
  const attritionByDepartment = {};
  employees.forEach((e) => {
    const dept = e.Department || "Unknown";
    if (!attritionByDepartment[dept]) attritionByDepartment[dept] = 0;
    if (e.Attrition === "Yes") attritionByDepartment[dept]++;
  });

  // ✅ Group: attrition by job role
  const attritionByJobRole = {};
  employees.forEach((e) => {
    const role = e.JobRole || "Unknown";
    if (!attritionByJobRole[role]) attritionByJobRole[role] = 0;
    if (e.Attrition === "Yes") attritionByJobRole[role]++;
  });

  // ✅ Group: attrition by manager dept
  const attritionByManagerDept = {};
  employees.forEach((e) => {
    const mgrId = e.ManagerID || "Unknown";
    const dept = e.Department || "Unknown";
    if (!attritionByManagerDept[dept]) attritionByManagerDept[dept] = {};
    if (!attritionByManagerDept[dept][mgrId]) attritionByManagerDept[dept][mgrId] = 0;
    if (e.Attrition === "Yes") attritionByManagerDept[dept][mgrId]++;
  });

  // ✅ Group: attrition by year & month
  const attritionByMonth = {};
  employees.forEach((e) => {
    if (e.Attrition === "Yes" && e.TerminationDate) {
      const date = new Date(e.TerminationDate);
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "short" });

      if (!attritionByMonth[year]) {
        attritionByMonth[year] = {};
      }
      if (!attritionByMonth[year][month]) {
        attritionByMonth[year][month] = 0;
      }
      attritionByMonth[year][month]++;
    }
  });


  // ✅ Group: average salary by job role
  const salarySum = {};
  const salaryCount = {};
  employees.forEach((e) => {
    const role = e.JobRole || "Unknown";
    if (!salarySum[role]) {
      salarySum[role] = 0;
      salaryCount[role] = 0;
    }
    salarySum[role] += e.MonthlyIncome || 0;
    salaryCount[role]++;
  });

  const averageSalaryByJobRole = {};
  for (const role in salarySum) {
    averageSalaryByJobRole[role] = salaryCount[role]
      ? parseFloat((salarySum[role] / salaryCount[role]).toFixed(2))
      : 0;
  }

  // ✅ Group: gender breakdown
  const genderBreakdown = {};
  employees.forEach((e) => {
    if (e.Attrition === "No") {
      const gender = e.Gender || "Unknown";
      genderBreakdown[gender] = (genderBreakdown[gender] || 0) + 1;
    }
  });

  // ✅ Final safe metrics
  const dashboardMetrics = {
    kpis: {
      attritionRate: parseFloat(attritionRate.toFixed(2)),
      averageYears: parseFloat(avgYears.toFixed(2)),
      avgSatisfaction: parseFloat(avgSatisfaction.toFixed(2)),
      avgPerformance: parseFloat(avgPerformance.toFixed(2)),
      avgYearsSinceLastPromotion: parseFloat(avgYearsSinceLastPromotion.toFixed(2)),
    },
    attritionByDepartment,
    attritionByJobRole,
    attritionByManagerDept,
    attritionByMonth,
    averageSalaryByJobRole,
    genderBreakdown,
    updatedAt: new Date().toISOString(),
  };

  console.log("📊 Final metrics:", dashboardMetrics);

  await db.collection("dashboardMetrics").doc("main").set(dashboardMetrics);

  console.log("✅ Dashboard metrics saved!");
}

updateDashboardMetrics()
  .then(() => {
    console.log("🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
