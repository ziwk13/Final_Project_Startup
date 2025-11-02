// src/views/organization/OrganizationPage.jsx
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import OrganizationTree from "./OrganizationTree";
import EmployeeList from "./EmployeeList";
import EmployeeDetail from "./EmployeeDetail";

export default function OrganizationPage() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <OrganizationTree setSelectedDept={setSelectedDept} />
      </Grid>
      <Grid item xs={4}>
        <EmployeeList
          selectedDept={selectedDept}
          setSelectedEmployee={setSelectedEmployee}
        />
      </Grid>
      <Grid item xs={5}>
        <EmployeeDetail selectedEmployee={selectedEmployee} />
      </Grid>
    </Grid>
  );
}
