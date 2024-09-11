import {Box} from "@mui/material";
import {PatientSearchForm} from "./components";

export default function PatientSearchPage() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "60vh",
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100vh",
        minWidth: "100vw",
        width: "100%",
        backgroundImage: "url(/img/patient-search-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <PatientSearchForm />
    </Box>
  );
}
