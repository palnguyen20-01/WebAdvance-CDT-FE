import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ParticipantContent from "./ParticipantContent";
import InfoContent from "./InfoContent";
import { Container, Grid, Paper, Typography } from "@mui/material";
import Post from "./Post";
import Exercise from "./Exercise";
import SettingsContent from "./SettingsContent";

export default function LabTabs() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": { textTransform: "none" },
          }}>
          <TabList
            onChange={handleChange}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "green", // indicatorColor
              },
              "& button": { fontWeight: "bold" },
              "& button:hover": { color: "black", backgroundColor: "#eeeeee" },
              "& button:active": { color: "green" },
              "& button:focus": { color: "green" },
            }}>
            <Tab label="Information" value="1" />
            <Tab label="Exercise" value="2" />
            <Tab label="Participant" value="3" />
            <Tab label="Settings" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <InfoContent />
        </TabPanel>
        <TabPanel value="2"><Exercise/></TabPanel>
        <TabPanel value="3">
          <ParticipantContent/>
        </TabPanel>
        <TabPanel value="4"><SettingsContent/></TabPanel>
      </TabContext>
    </Box>
  );
}