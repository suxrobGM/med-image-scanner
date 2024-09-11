"use client";
import {useState} from "react";
import {TabContext, TabPanel} from "@mui/lab";
import {Container, Tab, Tabs} from "@mui/material";
import {UserDto} from "@/core/models";
import {UserProfileTab} from "./UserProfileTab";
import {UserPasswordTab} from "./UserPasswordTab";

interface UserProfilePanelProps {
  user: UserDto;
}

enum TabValue {
  PROFILE = "Profile",
  PASSWORD = "Password",
}

export function UserProfilePanel(props: UserProfilePanelProps) {
  const [tabValue, setTabValue] = useState(TabValue.PROFILE);

  return (
    <TabContext value={tabValue}>
      <Container maxWidth="sm">
        <Tabs
          orientation="horizontal"
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
        >
          <Tab label={TabValue.PROFILE} value={TabValue.PROFILE} />
          <Tab label={TabValue.PASSWORD} value={TabValue.PASSWORD} />
        </Tabs>
        <TabPanel value={TabValue.PROFILE}>
          <UserProfileTab user={props.user} />
        </TabPanel>
        <TabPanel value={TabValue.PASSWORD}>
          <UserPasswordTab user={props.user} />
        </TabPanel>
      </Container>
    </TabContext>
  );
}
