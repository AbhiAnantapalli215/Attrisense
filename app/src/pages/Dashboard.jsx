import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth,db } from "../firebase"; // Adjust path if needed

import useDashboardMetrics from "../hooks/useDashboardMetrics";
import AttritionByDepartment from "../components/charts/AttritionByDepartment";
import AttritionByJobRole from "../components/charts/AttritionByJobRole";
import AttritionByManagerDeptChart from "../components/charts/AttritionByManagerDeptChart";
import AttritionByMonth from "../components/charts/AttritionByMonth";
import AvgsalbyJobRole from "../components/charts/AvgsalbyJobRole";
import GenderPie from "../components/charts/GenderPie";
import KPICards from "../components/charts/KPICards";
import { updateDashboardMetrics } from "../hooks/updateDashboardMetrics";

export default function Dashboard() {
  const { metrics, loading } = useDashboardMetrics();
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const checkManager = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.log("No user is logged in");
        setIsManager(false);
        return;
      }

      try {
        const docRef = doc(db, "userData", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();

          if (userData.JobRole === "Manager") {
            setIsManager(true);
          } else {
            setIsManager(false);
          }
        } else {
          console.log("No userData found for this user");
          setIsManager(false);
        }
      } catch (error) {
        console.error("Error checking manager role:", error);
        setIsManager(false);
      }
    };

    checkManager();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!metrics) return <div>No data available</div>;

  return (
    <div className="dashboard">
      <div className="dash-title">
        <h1>HR Dashboard</h1>
      </div>
      <div className="chart-grid">
        <AttritionByDepartment data={metrics.attritionByDepartment} />
        <div className="kpi-cards">
          <KPICards data={metrics?.kpis} />
        </div>
        <GenderPie data={metrics.genderBreakdown} />
        <AttritionByMonth data={metrics.attritionByMonth} />
        <AttritionByManagerDeptChart data={metrics.attritionByManagerDept} />
        <AttritionByJobRole data={metrics.attritionByJobRole} />
        <AvgsalbyJobRole data={metrics.averageSalaryByJobRole} />
      </div>
      {isManager && (
        <button className="update-metrics-btn" onClick={updateDashboardMetrics}>
          Refresh
        </button>
      )}
    </div>
  );
}
