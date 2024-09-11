"use client";
import {useFormState} from "react-dom";
import {Stack, TextField, Typography} from "@mui/material";
import {requestPasswordRecoveryAction} from "@/app/auth/actions";
import {AlertResult, SubmitButton} from "@/components";


export function PasswordRecoveryForm() {
  const [formState, formAction] = useFormState(requestPasswordRecoveryAction, null);
  
  return (
    <form action={formAction}>
      <Stack direction="column" gap={3}>
        <Typography variant="h4">Password Recovery</Typography>

        <TextField name="email" label="Email" type="email" required />

        <AlertResult
          result={formState}
          successText="You will receive an email with instructions to recover your password if the email is registered in our system."
          errorText="Failed to request password recovery"
        />

        <SubmitButton variant="contained" sx={{alignSelf: "flex-start"}}>
          Recover Password
        </SubmitButton>
      </Stack>
    </form>
  );
}
