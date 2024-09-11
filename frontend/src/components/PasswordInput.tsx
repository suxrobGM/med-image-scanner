"use client";
import {useState} from "react";
import {
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import {VisibilityOff, Visibility} from "@mui/icons-material";


interface PasswordInputProps {
  name?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  displayShowPasswordButton?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function PasswordInput(props: PasswordInputProps) {
  const label = props.label ?? "Password";
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const name = props.name ?? `${label}__${Math.random().toString(36).substring(7)}`;

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        name={name}
        label={label}
        type={showPassword ? "text" : "password"}
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)}
        autoComplete="new-password"
        required={props.required}
        endAdornment={
          props.displayShowPasswordButton && (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }>
      </OutlinedInput>
      {props.helperText && <FormHelperText error={props.error}>{props.helperText}</FormHelperText>}
    </FormControl>
  );
}
