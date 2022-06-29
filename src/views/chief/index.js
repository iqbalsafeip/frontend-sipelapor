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
            text="Jumlah Pelaporan"
            color="warning"
            count={20}
            icon="cil-envelope-closed"
          />
        </CCol>
        <CCol xs="12" sm="6" lg="3">
          <DashboardCard
            text="Laporan Belum diassign"
            color="danger"
            count={2}
            icon="cil-envelope-letter"
          />
        </CCol>
        <CCol xs="12" sm="6" lg="3">
          <DashboardCard
            text="Jumlah Teknisi"
            color="primary"
            count={2}
            icon="cil-people"
          />
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
