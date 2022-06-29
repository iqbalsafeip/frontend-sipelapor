import React, { lazy } from "react";
import { CCol, CRow } from "@coreui/react";

const WidgetsDropdown = lazy(() => import("../widgets/WidgetsDropdown.js"));
const DashboardCard = lazy(() => import("../widgets/DashboardCard.js"));

const Dashboard = () => {
  return (
    <>
      <CRow className="mb-4">
        <CCol xs="12" sm="6" lg="3">
          <DashboardCard
            text="Jumlah Pengguna"
            color="warning"
            count={20}
            icon="cil-people"
          />
        </CCol>
        <CCol xs="12" sm="6" lg="3">
          <DashboardCard
            text="Pelaporan Masuk"
            color="danger"
            count={20}
            icon="cil-envelope-letter"
          />
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
