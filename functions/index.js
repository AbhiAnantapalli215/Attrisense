import functions from 'firebase-functions';
import admin from 'firebase-admin';
admin.initializeApp();

// Utility function to calculate average
const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

exports.updateDashboardMetrics = functions.firestore
  .document('employeelist/{empId}')
  .onWrite(async (change, context) => {
    const snapshot = await admin.firestore().collection('employeelist').get();
    const employees = snapshot.docs.map(doc => doc.data());

    const total = employees.length;
    const leavers = employees.filter(e => e.Attrition === 'Yes');

    // 📌 Attrition By Manager + Dept
    const mgrDeptMap = {};
    leavers.forEach(e => {
      const dept = e.Department || 'Unknown';
      const mgr = e.ManagerID || 'Unknown';

      if (!mgrDeptMap[dept]) mgrDeptMap[dept] = {};
      if (!mgrDeptMap[dept][mgr]) mgrDeptMap[dept][mgr] = 0;

      mgrDeptMap[dept][mgr] += 1;
    });

    // 📌 Other metrics (minimal example, extend as needed)
    const attritionRate = leavers.length / total;

    const avgYears = avg(employees.map(e => e.YearsAtCompany));
    const avgSatisfaction = avg(
      employees.map(e => (e.EnvironmentSatisfaction + e.JobSatisfaction) / 2)
    );
    const avgPerformance = avg(
      employees.map(e => (e.JobInvolvement + e.PerformanceRating) / 2)
    );
    const avgPromotion = avg(employees.map(e => e.YearsSinceLastPromotion));

    // Save to dashboardMetrics/global
    await admin.firestore().collection('dashboardMetrics').doc('global').set({
      attritionRate,
      avgYearsAtCompany: avgYears,
      avgSatisfaction,
      avgPerformance,
      avgYearsSinceLastPromotion: avgPromotion,
      attritionByManagerDept: mgrDeptMap
    });

    console.log('Dashboard metrics updated successfully!');
  });
