"use client";

import {useState} from "react";
import {Stack, TextField, Typography} from "@mui/material";
import {MuiTelInput} from "mui-tel-input";
import {useFormState} from "react-dom";
import {updateProfileAction} from "@/app/(dashboard)/profile/actions";
import {AlertResult, SelectCountryInput, SelectTimezoneInput, SubmitButton} from "@/components";
import {UserDto} from "@/core/models";

interface UserProfileTabProps {
  user: UserDto;
}

export function UserProfileTab({user}: UserProfileTabProps) {
  const [formState, formAction] = useFormState(updateProfileAction, null);
  const [mobilePhone, setMobilePhone] = useState(user.mobilePhone);
  const [workPhone, setWorkPhone] = useState(user.workPhone);

  return (
    <form action={formAction}>
      <Stack direction="column" gap={3}>
        <Typography variant="h4">Profile</Typography>

        <AlertResult
          result={formState}
          successText="Profile updated successfully"
          errorText="Failed to update profile"
        />

        <input name="userId" type="hidden" defaultValue={user.id} />
        <TextField name="email" label="Email" defaultValue={user.email} disabled />
        <TextField name="firstName" label="First Name" defaultValue={user.firstName} required />
        <TextField name="lastName" label="Last Name" defaultValue={user.lastName} required />

        <input type="hidden" name="mobilePhone" value={mobilePhone} />
        <MuiTelInput
          label="Mobile Phone"
          variant="outlined"
          defaultCountry="US"
          value={mobilePhone}
          onChange={(value) => setMobilePhone(value)}
        />

        <input type="hidden" name="workPhone" value={workPhone} />
        <MuiTelInput
          label="Work Phone"
          variant="outlined"
          defaultCountry="US"
          value={workPhone}
          onChange={(value) => setWorkPhone(value)}
        />

        <SelectCountryInput name="country" label="Country" defaultValue={user.country} />
        <SelectTimezoneInput name="timezone" label="Timezone" defaultValue={user.timezone} />

        <SubmitButton variant="contained" sx={{alignSelf: "flex-start"}}>
          Update Profile
        </SubmitButton>
      </Stack>
    </form>
  );
}
