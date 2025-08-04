"use client";

import {useMemo} from "react";
import {Stack, Typography} from "@mui/material";
import {jwtDecode} from "jwt-decode";
import {useFormState} from "react-dom";
import {joinOrganizationAction} from "@/app/auth/actions";
import {AlertResult, SubmitButton} from "@/components";

interface JoinOrganizationFormProps {
  token: string;
}

interface Token {
  email: string;
  role?: string;
  organization: string;
}

export function JoinOrganizationForm({token}: JoinOrganizationFormProps) {
  const decodedToken = useMemo(() => jwtDecode<Token>(token), [token]);
  const [formState, formAction] = useFormState(joinOrganizationAction, null);

  return (
    <form action={formAction}>
      <Stack direction="column" gap={2}>
        <Typography variant="h4">Join Organization</Typography>

        <AlertResult
          result={formState}
          successText="Joined organization successfully"
          errorText="Failed to join organization"
        />

        <input type="hidden" name="token" defaultValue={token} />

        <Typography variant="body1">
          You have been invited to join the organization{" "}
          <strong>{decodedToken.organization}</strong>
        </Typography>

        {decodedToken.role && (
          <Typography variant="body1">Your role will be {decodedToken.role}</Typography>
        )}

        <SubmitButton variant="contained" sx={{alignSelf: "flex-start"}}>
          Join
        </SubmitButton>
      </Stack>
    </form>
  );
}
