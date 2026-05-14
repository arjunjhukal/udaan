import DashboardActiveUsers from "./components/pages/Dashboard/DashboardActiveUsers";
import DashboardAnalytics from "./components/pages/Dashboard/DashboardAnalytics";
import DashboardNoticeAndActivities from "./components/pages/Dashboard/DashboardNoticeAndActivities";
import DashboardTransaction from "./components/pages/Dashboard/DashboardTransaction";
import LiveClassAndTestFilter from "./components/pages/Dashboard/LiveClassAndTestFilter";
import CAN from "./routes/CAN";

export default function App() {
  return (
    <div className="dashboard__root h-full overflow-auto">
      <DashboardAnalytics />
      <CAN permissions={["view_transactions"]}>
        <DashboardTransaction />
      </CAN>
      <DashboardNoticeAndActivities />
      <LiveClassAndTestFilter />
      <DashboardActiveUsers />
    </div>
  )
}
