"use client";

import {FormControl, FormHelperText, Stack, TextField, Typography} from "@mui/material";
import {useFormState} from "react-dom";
import {createOrganizationAction} from "@/app/(dashboard)/admin/actions";
import {AlertResult, LowercaseTextField, SubmitButton} from "@/components";

export function AddOrganizationForm() {
  const [result, formAction] = useFormState(createOrganizationAction, null);

  return (
    <form action={formAction}>
      <Stack direction="column" gap={2}>
        <AlertResult
          result={result}
          successText="Organization has been created successfully!"
          errorText="Error creating the organization"
        />

        <FormControl>
          <LowercaseTextField name="name" label="Name" required />
          <FormHelperText>
            <Typography variant="caption">Organization name rules:</Typography> <br />
            <Typography variant="caption">- Must be at least 4 characters long</Typography> <br />
            <Typography variant="caption">
              - Must contain only lowercase letters, numbers, and underscore
            </Typography>
            <br />
            <Typography variant="caption">- Must not start with a number</Typography> <br />
            <Typography variant="caption">
              - Must not start or end with an underscore
            </Typography>{" "}
            <br />
          </FormHelperText>
        </FormControl>

        <TextField name="displayName" label="Display Name" />
        <TextField name="dicomUrl" type="url" label="DICOM URL" required />
        <TextField name="website" type="url" label="Website" />
        <TextField name="email" type="email" label="Email" />
        <TextField name="address" label="Address" />

        <SubmitButton variant="contained" color="primary" sx={{alignSelf: "flex-start"}}>
          Create
        </SubmitButton>
      </Stack>
    </form>
  );
}
