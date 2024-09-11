"use client";
import {ReactNode, useEffect} from "react";
//@ts-ignore
import {SessionProvider, useSession} from "next-auth/react";
import useSWR from "swr";
import {Box,CssBaseline} from "@mui/material";
import {useOrganizationStore} from "@/core/stores";
import {ApiService} from "@/core/services";
import {useTheme} from "@/components";
import {Topbar, DrawerHeader, Sidebar} from "./components";


interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({children}: DashboardLayoutProps) {
  const theme = useTheme();

  useEffect(() => {
    theme.setCurrentTheme("dark");
  }, []);

  return (
    <Box sx={{display: "flex"}}>
      <CssBaseline />
      <SessionProvider>
        <Topbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // height: "100vh",
            // backgroundColor: "background.default",
          }}
        >
          <DrawerHeader />
          <InitOrganizationStore />
          {children}
        </Box>
      </SessionProvider>
    </Box>
  );
}

/**
 * Initialize the organization store with the user's organization data
 */
function InitOrganizationStore() {
  const {data: session} = useSession();
  const {organization, setOrganization} = useOrganizationStore();
  const userId = session?.user?.id;
  
  // Check if userId exists and organization data is not already initialized
  const shouldFetch = userId && !Object.hasOwn(organization, "id");

  const {data: result} = useSWR(shouldFetch ? "organization" : null, () => ApiService.ins.getUserOrganization(userId!));
  
  // Update the organization store when the data is fetched
  useEffect(() => {
    if (result?.success && result.data) {
      setOrganization(result.data);
      console.log("Initialized organization store", result.data);
    }
    else if (result?.error) {
      console.error("Failed to initialize organization store", result.error);
    }
  }, [result, setOrganization]);

  return null;
}
