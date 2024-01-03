import React from "react";
import CoursesInfo from "./CoursesInfo";
import { Toolbar, Box } from "@mui/material";
import Link from "next/link";

const CoursesList = ({ classData }) => {
  const [isStudent, setIsStudent] = React.useState(null);
  const [newClassData, setNewClassData] = React.useState(null);

  return classData ? (
    <div className="flex flex-wrap w-full">
      {classData.map((course) => (
        <Link
          key={course.id}
          href={{
            pathname: course.role === "teacher" ? `/teacher/class/${course.id}` : `student/class/${course.id}`   
          }}

          passHref>
          <div>
            <CoursesInfo
              name={course.name}
              title={course.title}
              teacher={course.name}
              
            />
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div>You have no class</div>
  );
};

export default CoursesList;
