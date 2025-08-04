"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {useTranslations} from "next-intl";
import {useFormState, useFormStatus} from "react-dom";
import {signInUserAction} from "@/app/auth/actions";
import {ChooseLanguageButtons} from "./ChooseLanguageButtons";

export function LoginForm() {
  const t = useTranslations();
  const [state, formAction] = useFormState(signInUserAction, {success: false});
  const {pending} = useFormStatus();

  return (
    <form action={formAction}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4">{t("signInPage.signIn")}</Typography>
          <Box mb={1} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="email"
            fullWidth={true}
            label={t("common.email")}
            variant="outlined"
            required={true}
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="password"
            fullWidth={true}
            label={t("common.password")}
            type="password"
            variant="outlined"
            autoComplete="password"
            required={true}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="error">
            {state?.error}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <FormControlLabel
              control={<Checkbox />}
              label={t("signInPage.rememberMe")}
              sx={{mb: 0}}
            />
            <Button href="/auth/password-recovery" variant="text" color="error">
              {t("signInPage.forgotPassword")}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" disabled={pending} fullWidth>
            {t("signInPage.signIn")}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ChooseLanguageButtons />
        </Grid>
      </Grid>
    </form>
  );
}
