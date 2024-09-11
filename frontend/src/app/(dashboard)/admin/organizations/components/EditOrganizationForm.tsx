"use client"
import {useFormState} from "react-dom";
import {
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {DEFAULT_ORGANIZATION} from "@/core/consts";
import {OrganizationDto} from "@/core/models";
import {AlertResult, LowercaseTextField, SubmitButton} from "@/components";
import {updateOrganizationAction} from "@/app/(dashboard)/admin/actions";


interface EditOrganizationFormProps {
  organization: OrganizationDto;
}

export function EditOrganizationForm({organization}: EditOrganizationFormProps) {
  const [result, formAction] = useFormState(updateOrganizationAction, null);

  return (
    <form action={formAction}>
      <Stack direction="column" gap={2}>
        <AlertResult
          result={result}
          successText="Organization has been updated successfully!"
          errorText="Error updating the organization"
        />

        <input type="hidden" name="id" defaultValue={organization.id} />
        <FormControl>
          <LowercaseTextField
            name="name"
            label="Name"
            required
            value={organization.name}
            disabled={organization.name === DEFAULT_ORGANIZATION}
          />
          <FormHelperText>
            <Typography variant="caption">Organization name rules:</Typography> <br />
            <Typography variant="caption">- Must be at least 4 characters long</Typography> <br />
            <Typography variant="caption">- Must contain only lowercase letters, numbers, and underscore</Typography>
            <br />
            <Typography variant="caption">- Must not start with a number</Typography> <br />
            <Typography variant="caption">- Must not start or end with an underscore</Typography> <br />
          </FormHelperText>
        </FormControl>

        <TextField name="displayName" label="Display Name" defaultValue={organization.displayName} />
        <TextField name="dicomUrl" type="url" label="DICOM URL" defaultValue={organization.dicomUrl} required />
        <TextField name="website" type="url" label="Website" defaultValue={organization.website} />
        <TextField name="email" type="email" label="Email" defaultValue={organization.email} />
        <TextField name="address" label="Address" defaultValue={organization.address} />

        <SubmitButton variant="contained" color="primary" sx={{alignSelf: "flex-start"}}>
          Update
        </SubmitButton>
      </Stack>
    </form>
  );
}
