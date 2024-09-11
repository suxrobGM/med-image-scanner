"use client";
import {PasswordValidator} from "@/components";

interface PasswordStepProps {
  onValid?: (password: string) => void;
  onInvalid?: () => void;
}

export function PasswordStep(props: PasswordStepProps) {
  return <PasswordValidator 
    onValid={props.onValid}
    onInvalid={props.onInvalid}
  />;
}
