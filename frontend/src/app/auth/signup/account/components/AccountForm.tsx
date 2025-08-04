"use client";

import {useMemo, useRef, useState} from "react";
import {Button, Link, Stack, Typography} from "@mui/material";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {registerUserAction} from "@/app/auth/actions";
import {AccountDetails} from "@/core/models";
import {AccountDetailsStep} from "./AccountDetailsStep";
import {PasswordStep} from "./PasswordStep";
import {PrivacyAgreementStep} from "./PrivacyAgreementStep";
import {TermsAgreementStep} from "./TermsAgreementStep";

interface AccountFormProps {
  token: string;
}

interface Token {
  email: string;
  exp: number;
  role?: string;
  organization?: string;
}

// Form steps, enum values used to navigate between steps
enum FormStep {
  ACCOUNT_DETAILS,
  PASSWORD,
  TERMS_AGREEMENT,
  PRIVACY_AGREEMENT,
}

// Initial state of the form steps, ordered by the form steps enum
const stepsStateInitial = [
  {
    step: FormStep.ACCOUNT_DETAILS,
    isValid: false,
  },
  {
    step: FormStep.PASSWORD,
    isValid: false,
  },
  {
    step: FormStep.TERMS_AGREEMENT,
    isValid: false,
  },
  {
    step: FormStep.PRIVACY_AGREEMENT,
    isValid: false,
  },
];

const emptyAccount: AccountDetails = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export function AccountForm({token}: AccountFormProps) {
  const router = useRouter();
  const decodedToken = useMemo(() => jwtDecode<Token>(token), [token]);

  const account = useRef<AccountDetails>({
    ...emptyAccount,
    email: decodedToken.email,
    role: decodedToken.role,
    organization: decodedToken.organization,
  });

  const [currentStep, setCurrentStep] = useState(FormStep.ACCOUNT_DETAILS);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepsState, setStepsState] = useState(stepsStateInitial);
  const canSubmit = useMemo(() => stepsState.every((step) => step.isValid), [stepsState]);

  const updateStepValidity = (step: FormStep, isValid: boolean) => {
    if (stepsState[step].isValid === isValid) {
      // No need to update if the value is the same
      return;
    }

    setStepsState((prevState) =>
      prevState.map((obj) => (obj.step === step ? {...obj, isValid} : obj))
    );
  };

  const handleAccountDetailsValid = (details: AccountDetails) => {
    account.current = {...account.current, ...details};
    updateStepValidity(FormStep.ACCOUNT_DETAILS, true);
  };

  const handleAccountDetailsInvalid = () => {
    updateStepValidity(FormStep.ACCOUNT_DETAILS, false);
  };

  const handlePasswordValid = (password: string) => {
    account.current = {...account.current, password};
    updateStepValidity(FormStep.PASSWORD, true);
  };

  const handlePasswordInvalid = () => {
    updateStepValidity(FormStep.PASSWORD, false);
  };

  const handleTermsAgreement = () => {
    updateStepValidity(FormStep.TERMS_AGREEMENT, true);
  };

  const handlePrivacyAgreement = () => {
    updateStepValidity(FormStep.PRIVACY_AGREEMENT, true);
  };

  const handleBack = () => {
    if (currentStep > FormStep.ACCOUNT_DETAILS) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleNext = () => {
    if (
      currentStep >= FormStep.ACCOUNT_DETAILS &&
      currentStep < FormStep.PRIVACY_AGREEMENT &&
      stepsState[currentStep].isValid
    ) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const result = await registerUserAction({...account.current, token});

    if (result.success) {
      sessionStorage.setItem("account", JSON.stringify(account.current)); // Save account details to session storage for success page
      router.push(`/auth/signup/success?name=${account.current.firstName}`);
    } else if (result.error) {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <Stack direction="column" alignItems="center" gap={1}>
      <Typography variant="h4" color="black" textAlign="left" gutterBottom>
        {currentStep === FormStep.ACCOUNT_DETAILS && "Let's configure your account"}
        {currentStep === FormStep.PASSWORD && "Choose Your Password"}
        {currentStep === FormStep.TERMS_AGREEMENT && "Terms & Conditions"}
        {currentStep === FormStep.PRIVACY_AGREEMENT && "Privacy Policy"}
      </Typography>

      <Typography color="error">{error}</Typography>

      <form action={handleSubmit} style={{width: "100%"}}>
        {currentStep === FormStep.ACCOUNT_DETAILS && (
          <AccountDetailsStep
            account={account.current}
            onValid={handleAccountDetailsValid}
            onInvalid={handleAccountDetailsInvalid}
          />
        )}
        {currentStep === FormStep.PASSWORD && (
          <PasswordStep onValid={handlePasswordValid} onInvalid={handlePasswordInvalid} />
        )}
        {currentStep === FormStep.TERMS_AGREEMENT && (
          <TermsAgreementStep onValid={handleTermsAgreement} />
        )}
        {currentStep === FormStep.PRIVACY_AGREEMENT && (
          <PrivacyAgreementStep onValid={handlePrivacyAgreement} />
        )}

        <Stack mt={2} direction="row" spacing={2}>
          {currentStep > FormStep.ACCOUNT_DETAILS && (
            <Button variant="contained" onClick={handleBack} disabled={isSubmitting}>
              Back
            </Button>
          )}
          {currentStep < FormStep.PRIVACY_AGREEMENT && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting || !stepsState[currentStep].isValid}
            >
              Continue
            </Button>
          )}
          {currentStep === FormStep.PRIVACY_AGREEMENT && (
            <Button type="submit" variant="contained" disabled={isSubmitting || !canSubmit}>
              Create Account
            </Button>
          )}
        </Stack>
      </form>
    </Stack>
  );
}
