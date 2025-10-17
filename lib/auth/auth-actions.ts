"use server";

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function signInWithEmail(email: string, password: string) {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (result.user) {
    redirect("/");
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  username: string
) {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      username,
    },
  });

  if (result.user) {
    redirect("/");
  }
}

export async function signInWithGoogle() {
  const result = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/",
    },
  });

  if (result.url) {
    redirect(result.url);
  }
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (result.success) {
    redirect("/sign-in");
  }
}

export async function getSession() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  return result;
}
