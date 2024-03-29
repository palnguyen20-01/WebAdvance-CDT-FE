import NestedList from "@/components/dashboard-page/NestedList";
import CoursesList from "@/components/dashboard-page/CoursesList";

import Tabs from "@/components/class/student/StudentTabs";
import { Box, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

const StudentClass = ({
  currentSelection,
  studentClass,
  teacherClass,
  id,
  role,
  tabs,
}) => {
  return (
    <Box sx={{ marginLeft: "240px", backgroundColor: "white", height: "100%" }}>
      {currentSelection === "Tabs" && (
        <Tabs classId={id} role={role} tabs={tabs} />
      )}
      {currentSelection === "MapID" && <StudentIdDataTable />}
    </Box>
  );
};

export default StudentClass;
