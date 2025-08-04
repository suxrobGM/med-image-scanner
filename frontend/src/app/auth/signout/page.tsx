import {signOutUserAction} from "@/app/auth/actions";
import {SubmitButton} from "@/components";

export default async function SignOutPage() {
  return (
    <form action={signOutUserAction}>
      <SubmitButton type="submit" variant="contained">
        Logout
      </SubmitButton>
    </form>
  );
}
