import {Grid, Typography} from "@mui/material";
import {TermsAgreementStep} from "@/app/auth/signup/account/components";

export default function TermsAgreementPage() {
  return (
    <Grid container justifyContent="center">
      <Grid item md={8} xs={12}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Terms & Conditions
        </Typography>
        <TermsAgreementStep />
      </Grid>
    </Grid>
  );
}
