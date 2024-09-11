//@ts-ignore
import NextAuth from "next-auth";

//@ts-ignore
import CredentialsProvider from "next-auth/providers/credentials";
import {SignInResult} from "@/core/models";

//@ts-ignore
declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    firstName: string;
    lastName: string;
    role?: string;
    accessToken: string;
    organization?: string;
  }
}

export const {auth, handlers, signIn, signOut} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {label: "email", type: "text"},
        password: {label: "password", type: "password"},
      },
      authorize: async (credentials) => {
        const authUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;

        const body = new URLSearchParams({
          username: credentials.username as string,
          password: credentials.password as string,
        });

        try {
          const res = await fetch(`${authUrl}/auth/login`, {
            method: "POST",
            body: body.toString(),
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
          });

          const result = (await res.json()) as SignInResult;

          if (res.ok && result.user) {
            return {
              ...result.user,
              name: `${result.user.firstName} ${result.user.lastName}`,
              accessToken: result.access_token,
            };
          }

          return null;
        } 
        catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
  jwt: {
    maxAge: 60 * 60 * 24, // 24 hours
  },
  callbacks: {
    jwt: ({user, token}) => {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.raw = user.accessToken; // Expose the access token to the client session in order to use it in API requests
        token.role = user.role;
        token.organization = user.organization;
      }
      return token;
    },
    session: ({session, token}) => {
      //@ts-ignore
      session.user = {
        id: token.id as string,
        name: token.name,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        email: token.email as string,
        role: token.role as string,
        organization: token.organization as string,
        accessToken: token.raw as string,
      };
      return session;
    },
  },
});
