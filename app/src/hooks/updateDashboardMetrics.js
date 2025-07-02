import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function updateDashboardMetrics() {
  try {
    const querySnapshot = await getDocs(collection(db, "employeelist"));
    const employees = querySnapshot.docs.map(doc => doc.data());

    const totalEmployees = employees.length;
    const attritionEmployees = employees.filter(emp => emp.Attrition === "Yes");
    const attritionCount = attritionEmployees.length;

    const attritionRate = ((attritionCount / totalEmployees) * 100).toFixed(2);
    const now = new Date().toISOString();

    // ------------------------------
    // Attrition by Department
    const attritionByDepartment = {};
    attritionEmployees.forEach(emp => {
      const dept = emp.Department;
      attritionByDepartment[dept] = (attritionByDepartment[dept] || 0) + 1;
    });

    // ------------------------------
    // Attrition by JobRole
    const attritionByJobRole = {};
    attritionEmployees.forEach(emp => {
      const role = emp.JobRole;
      attritionByJobRole[role] = (attritionByJobRole[role] || 0) + 1;
    });

    // ------------------------------
    // Attrition by ManagerID + Department
    const attritionByManagerDept = {};
    attritionEmployees.forEach(emp => {
      const dept = emp.Department;
      const mgrId = emp.ManagerID?.toString() || "Unknown";

      if (!attritionByManagerDept[dept]) {
        attritionByManagerDept[dept] = {};
      }
      attritionByManagerDept[dept][mgrId] = (attritionByManagerDept[dept][mgrId] || 0) + 1;
    });

    // ------------------------------
    // Attrition by Month
    const attritionByMonth = {};
    employees.forEach(e => {
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

    // ------------------------------
    // Average Salary by JobRole
    const salariesByJobRole = {};
    const countsByJobRole = {};
    employees.forEach(emp => {
      const role = emp.JobRole;
      const salary = parseFloat(emp.MonthlyIncome);
      if (!isNaN(salary)) {
        salariesByJobRole[role] = (salariesByJobRole[role] || 0) + salary;
        countsByJobRole[role] = (countsByJobRole[role] || 0) + 1;
      }
    });
    const averageSalaryByJobRole = {};
    Object.keys(salariesByJobRole).forEach(role => {
      averageSalaryByJobRole[role] = parseFloat(
        (salariesByJobRole[role] / countsByJobRole[role]).toFixed(2)
      );
    });

    // ------------------------------
    // ✅ NEW: Average Salary by Department
    const salariesByDepartment = {};
    const countsByDepartment = {};
    employees.forEach(emp => {
      const dept = emp.Department;
      const salary = parseFloat(emp.MonthlyIncome);
      if (!isNaN(salary)) {
        salariesByDepartment[dept] = (salariesByDepartment[dept] || 0) + salary;
        countsByDepartment[dept] = (countsByDepartment[dept] || 0) + 1;
      }
    });
    const averageSalaryByDepartment = {};
    Object.keys(salariesByDepartment).forEach(dept => {
      averageSalaryByDepartment[dept] = parseFloat(
        (salariesByDepartment[dept] / countsByDepartment[dept]).toFixed(2)
      );
    });

    // ------------------------------
    // ✅ NEW: Average Salary by Education Level
    const salariesByEducation = {};
    const countsByEducation = {};
    employees.forEach(emp => {
      const edu = emp.Education?.toString() || "Unknown";
      const salary = parseFloat(emp.MonthlyIncome);
      if (!isNaN(salary)) {
        salariesByEducation[edu] = (salariesByEducation[edu] || 0) + salary;
        countsByEducation[edu] = (countsByEducation[edu] || 0) + 1;
      }
    });
    const averageSalaryByEducation = {};
    Object.keys(salariesByEducation).forEach(edu => {
      averageSalaryByEducation[edu] = parseFloat(
        (salariesByEducation[edu] / countsByEducation[edu]).toFixed(2)
      );
    });

    // ------------------------------
    // ✅ NEW: Average Training Times by Department
    const trainingByDepartment = {};
    const trainingCountsByDepartment = {};
    employees.forEach(emp => {
      const dept = emp.Department;
      const training = parseFloat(emp.TrainingTimesLastYear || 0);
      trainingByDepartment[dept] = (trainingByDepartment[dept] || 0) + training;
      trainingCountsByDepartment[dept] = (trainingCountsByDepartment[dept] || 0) + 1;
    });
    const averageTrainingByDepartment = {};
    Object.keys(trainingByDepartment).forEach(dept => {
      averageTrainingByDepartment[dept] = parseFloat(
        (trainingByDepartment[dept] / trainingCountsByDepartment[dept]).toFixed(2)
      );
    });

    // ------------------------------
    // Gender Breakdown
    const genderBreakdown = {};
    employees.forEach(emp => {
      if (emp.Attrition === "No") {
        const gender = emp.Gender;
        genderBreakdown[gender] = (genderBreakdown[gender] || 0) + 1;
      }
    });

    // ------------------------------
    // KPIs
    const avgYears = (
      employees.reduce((sum, emp) => sum + parseFloat(emp.YearsAtCompany || 0), 0) / totalEmployees
    ).toFixed(2);

    const avgSatisfaction = (
      employees.reduce(
        (sum, emp) =>
          sum +
          (parseFloat(emp.EnvironmentSatisfaction || 0) +
            parseFloat(emp.JobSatisfaction || 0)) / 2,
        0
      ) / totalEmployees
    ).toFixed(2);

    const avgPerformance = (
      employees.reduce(
        (sum, emp) =>
          sum +
          (parseFloat(emp.JobInvolvement || 0) +
            parseFloat(emp.PerformanceRating || 0)) / 2,
        0
      ) / totalEmployees
    ).toFixed(2);

    const avgYearsSinceLastPromotion = (
      employees.reduce(
        (sum, emp) => sum + parseFloat(emp.YearsSinceLastPromotion || 0),
        0
      ) / totalEmployees
    ).toFixed(2);

    const dashboardMetrics = {
      kpis: {
        attritionRate: parseFloat(attritionRate),
        averageYears: parseFloat(avgYears),
        avgSatisfaction: parseFloat(avgSatisfaction),
        avgPerformance: parseFloat(avgPerformance),
        avgYearsSinceLastPromotion: parseFloat(avgYearsSinceLastPromotion),
      },
      attritionByDepartment,
      attritionByJobRole,
      attritionByManagerDept,
      attritionByMonth,
      averageSalaryByJobRole,
      averageSalaryByDepartment,       // ✅ NEW
      averageSalaryByEducation,        // ✅ NEW
      averageTrainingByDepartment,     // ✅ NEW
      genderBreakdown,
      updatedAt: now
    };

    await setDoc(doc(db, "dashboardMetrics", "main"), dashboardMetrics);

    alert("✅ Dashboard metrics updated successfully!");
  } catch (error) {
    console.error("Error updating dashboard metrics:", error);
    alert("❌ Failed to update metrics.");
  }
}
