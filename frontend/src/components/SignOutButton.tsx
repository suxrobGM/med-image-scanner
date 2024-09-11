import {Button} from "@mui/material";
import {signOutUserAction} from "@/app/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutUserAction}>
      <Button type="submit" variant="text">
        Logout
      </Button>
    </form>
  );
}
