"use client";
import {ArrowForwardRounded} from "@mui/icons-material";
import {Button} from "@mui/material";
import {AccountDetails} from "@/core/models";
import {signInUserAction} from "@/app/auth/actions";


export function LetsGoButton() {
  const handleSignIn = async () => {
    const accountJson = sessionStorage.getItem("account");

    if (!accountJson) {
      return;
    }

    const account = JSON.parse(accountJson) as AccountDetails;
    console.log("account", account);
    
    const formData = new FormData();
    formData.append("email", account.email);
    formData.append("password", account.password);
    await signInUserAction({success: false}, formData);
    sessionStorage.removeItem("account"); // Remove account details from session storage after sign in
  }

  return (
    <Button
      onClick={handleSignIn}
      fullWidth
      size="large"
      variant="contained"
      color="primary"
      endIcon={<ArrowForwardRounded />}
    >
      Let's Go
    </Button>
  );
}
