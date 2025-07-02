// useDashboardMetrics.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function useDashboardMetrics() {
  const [metrics, setMetrics] = useState({
    kpis: {
      attritionRate: 0,
      averageYears: 0,
      avgSatisfaction: 0,
      avgPerformance: 0,
      avgYearsSinceLastPromotion: 0,
    },
    attritionByDepartment: {},
    attritionByJobRole: {},
    attritionByManagerDept: {},
    attritionByMonth: {},
    averageSalaryByJobRole: {},
    genderBreakdown: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const docRef = doc(db, "dashboardMetrics", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMetrics(docSnap.data());
      }
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  return { metrics, loading };
}
