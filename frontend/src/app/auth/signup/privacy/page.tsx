import {Grid, Typography} from "@mui/material";
import {PrivacyAgreementStep} from "@/app/auth/signup/account/components";

export default function PrivacyAgreementPage() {
  return (
    <Grid container justifyContent="center">
      <Grid item md={8} xs={12}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          HIPAA Privacy Notice
        </Typography>
        <PrivacyAgreementStep />
      </Grid>
    </Grid>
  );
}
