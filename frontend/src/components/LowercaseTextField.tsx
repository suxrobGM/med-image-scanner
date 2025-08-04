"use client";

import {ChangeEvent, useState} from "react";
import {TextField, TextFieldProps} from "@mui/material";

/**
 * A text field that converts all input to lowercase.
 */
export function LowercaseTextField(props: TextFieldProps) {
  const [value, setValue] = useState(props.value);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.toLowerCase());
    props.onChange?.(e);
  };

  return <TextField {...props} value={value} onChange={handleOnChange} />;
}
