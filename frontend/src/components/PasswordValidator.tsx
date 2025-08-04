"use client";

import {useEffect, useMemo, useState} from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import {Stack, Typography} from "@mui/material";
import {PasswordInput} from "@/components";

interface PasswordValidatorProps {
  name?: string;
  label?: string;
  onValid?: (password: string) => void;
  onInvalid?: () => void;
  required?: boolean;
}

const initialRequirements = [
  {
    label: "Must be at least 8 characters",
    valid: (password: string) => password.length >= 8,
  },
  {
    label: "Must contain one special character (!@#$%^&*)",
    valid: (password: string) => /[!@#$%^&*]/.test(password),
  },
  {
    label: "Must contain a lower case letter",
    valid: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "Must contain an upper case letter",
    valid: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "Must contain a number",
    valid: (password: string) => /\d/.test(password),
  },
];

/**
 * Password inputs with validation requirements.
 * It has two password inputs, one for the password and one for the confirmation.
 * It will call `onValid` when all requirements are met.
 */
export function PasswordValidator(props: PasswordValidatorProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const label = props.label ?? "Choose a password";
  const name = props.name ?? "password";

  const passwordRequirements = useMemo(
    () => initialRequirements.map((req) => ({...req, valid: req.valid(password)})),
    [password]
  );

  const passwordsMatch = useMemo(() => password === confirmPassword, [password, confirmPassword]);

  const canContinue = useMemo(
    () => passwordsMatch && passwordRequirements.every((req) => req.valid),
    [passwordsMatch, passwordRequirements]
  );

  useEffect(() => {
    if (canContinue) {
      props.onValid?.(password);
    } else {
      props.onInvalid?.();
    }
  }, [canContinue]);

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="column" spacing={1}>
        {passwordRequirements.map((req) => (
          <Stack direction="row" spacing={1} key={req.label}>
            <CheckCircleOutlinedIcon color={req.valid ? "success" : "disabled"} />
            <Typography variant="body1" color={req.valid ? "green" : "disabled"}>
              {req.label}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <PasswordInput
        name={name}
        label={label}
        value={password}
        onChange={setPassword}
        required={props.required}
        displayShowPasswordButton
      />

      <PasswordInput
        label="Confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={!passwordsMatch}
        helperText={!passwordsMatch ? "Passwords do not match" : ""}
      />
    </Stack>
  );
}
