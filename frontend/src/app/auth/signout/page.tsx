import {SubmitButton} from "@/components";
import {signOutUserAction} from "@/app/auth/actions";

export default async function SignOutPage() {
  return (
    <form action={signOutUserAction}>
      <SubmitButton type="submit" variant="contained">
        Logout
      </SubmitButton>
    </form>
  );
}
