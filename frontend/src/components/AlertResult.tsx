"use client";
import {useEffect, useState} from "react";
import {Alert} from "@mui/material";
import {Result} from "@/core/models";


interface AlertResultProps {
  result: Result | null;
  successText?: string;
  errorText?: string;
}

/**
 * Displays Alert based on the result of an action.
 * If the prop resul is null, the component will not render.
 */
export function AlertResult(props: AlertResultProps) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (props.result) {
      setShowAlert(true);
    }
  }, [props.result]);

  if (!showAlert || !props.result) {
    return null;
  }

  const successText = props.successText || "Success!";
  const errorText = `${props.errorText || "Error"}: ${props.result.error ?? ""}`;
  
  return (
    <Alert 
      severity={props.result.success ? "success" : "error"}
      onClose={() => setShowAlert(false)}>
      {props.result.success ? successText : errorText}
    </Alert>
  );
}
