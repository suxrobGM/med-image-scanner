"use client";
import {useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import {
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {MuiTelInput} from "mui-tel-input";
import {CountryCode} from "libphonenumber-js";
import {AccountDetails} from "@/core/models";
import {IPInfoService} from "@/core/services";
import {DateUtils} from "@/core/utils";
import {SelectCountryInput, SelectTimezoneInput} from "@/components";

interface AccountDetailsStepProps {
  account?: AccountDetails;
  onValid?: (account: AccountDetails) => void;
  onInvalid?: () => void;
}

export function AccountDetailsStep(props: AccountDetailsStepProps) {
  const {data: ipInfo} = useSWR("/ipinfo", () => IPInfoService.ins.getIPInfo());
  const defaultCountry = useMemo(() => ipInfo?.country ?? "US", []);
  const defaultTimezone = useMemo(() => DateUtils.getTimezoneString(), []);
  
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    email: props.account?.email ?? "",
    firstName: props.account?.firstName ?? "",
    lastName: props.account?.lastName ?? "",
    country: props.account?.country ?? defaultCountry,
    timezone: props.account?.timezone ?? defaultTimezone,
    workPhone: props.account?.workPhone ?? "",
    mobilePhone: props.account?.mobilePhone ?? "",
    password: props.account?.password ?? "",
    role: props.account?.role,
  });

  const [phoneType, setPhoneType] = useState<"mobile" | "work">("mobile"); 

  const canContinue = useMemo(
    () => accountDetails.firstName !== "" && accountDetails.lastName !== "",
    [accountDetails.firstName, accountDetails.lastName]
  );

  useEffect(() => {
    if (canContinue) {
      props.onValid?.(accountDetails);
    }
    else {
      props.onInvalid?.();
    }
  }, [canContinue, accountDetails]);

  const handlePhoneNumber = (e: string) => {
    setAccountDetails((prevDetails) => ({...prevDetails, [phoneType === "mobile" ? "mobilePhone" : "workPhone"]: e}));
  };

  const handleInputChange = (field: keyof AccountDetails, value: any) => {
    setAccountDetails((prevDetails) => ({...prevDetails, [field]: value}));
  };

  return (
    <Grid maxWidth={550} container spacing={3} alignItems="center" justifyContent="center" mt={3}>
      <Grid item xs={12} md={6}>
        <TextField
          value={accountDetails.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          label="First Name"
          variant="outlined"
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          value={accountDetails.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          label="Last Name"
          variant="outlined"
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField value={accountDetails.email} label="Email" variant="outlined" fullWidth disabled />
      </Grid>
      
      {accountDetails.role && (
        <Grid item xs={12}>
          <TextField value={accountDetails.role} label="Role" variant="outlined" fullWidth disabled />
        </Grid>
      )}

      {accountDetails.organization && (
        <Grid item xs={12}>
          <TextField value={accountDetails.organization} label="Organization" variant="outlined" fullWidth disabled />
        </Grid>
      )}
      
      <Grid item xs={12}>
        <FormGroup>
          <MuiTelInput
            value={phoneType === "mobile" ? accountDetails.mobilePhone : accountDetails.workPhone}
            onChange={handlePhoneNumber}
            variant="outlined"
            defaultCountry={defaultCountry as CountryCode}
            label="Best contact number"
            fullWidth
          />

          <RadioGroup
            name="phone-number-type"
            defaultValue="mobile"
            value={phoneType}
            onChange={(e) => setPhoneType(e.target.value as "mobile" | "work")}
            sx={{flexDirection: "row"}}
          >
            <FormControlLabel value="mobile" control={<Radio />} label="Mobile" />
            <FormControlLabel value="work" control={<Radio />} label="Work" />
          </RadioGroup>
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <SelectCountryInput
          defaultValue={defaultCountry}
          value={accountDetails.country}
          onChange={(e) => handleInputChange("country", e)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <SelectTimezoneInput
          defaultValue={defaultTimezone}
          value={accountDetails.timezone}
          onChange={(e) => handleInputChange("timezone", e)}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
