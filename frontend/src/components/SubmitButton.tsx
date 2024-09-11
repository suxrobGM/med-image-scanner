"use client";
import {Button, ButtonProps} from '@mui/material';
import {useFormStatus} from "react-dom";

/**
 * Submit button that disables itself when the form is pending.
 * This is useful for forms that submit data to the server.
 * @param props Button properties.
 */
export function SubmitButton(props: ButtonProps) {
  const {pending} = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending}>
      {props.children}
    </Button>
  );
}
