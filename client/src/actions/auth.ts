"use server";

import { Timestamp } from "firebase-admin/firestore";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn } from "@/lib/auth";
import { hashPassword, verifyPasswords } from "@/lib/auth-password";
import { AuthFormState } from "@/lib/definitions";
import { adminDb } from "@/lib/firebase.admin";
import { signInFormSchema, signUpFormSchema } from "@/lib/validation";

export async function signInAction(_state: AuthFormState, formData: FormData) {
  const validatedFields = signInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // const oauthUserSnapshot = await adminDb
    //   .collection("users")
    //   .where("email", "==", email)
    //   .get();

    // if (!oauthUserSnapshot.empty) {
    //   return {
    //     success: false,
    //     message: "You've already registered with OAth Provider.",
    //   };
    // }

    const userSnapshot = await adminDb
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return {
        success: false,
        message: "Email or password is incorrect.",
      };
    }

    const user = userSnapshot.docs[0].data();

    const isMatch = await verifyPasswords(password as string, user.password);

    if (!isMatch) {
      return {
        success: false,
        message: "Email or password is incorrect.",
      };
    }

    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });

    return {
      success: true,
      fields: validatedFields.data,
    };
  } catch (error) {
    console.log("[signInAction error]:", error);
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { success: false, error: "Invalid credentials" };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Something went wrong. Try again.",
    };
  }
}

export async function signUpAction(_state: AuthFormState, formData: FormData) {
  const validatedFields = signUpFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, password_confirmation } = validatedFields.data;

  if (password !== password_confirmation) {
    return {
      success: false,
      errors: {
        password_confirmation: ["Passwords don't match"],
      },
    };
  }

  try {
    const existingUserSnapshot = await adminDb
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existingUserSnapshot.empty) {
      return {
        success: false,
        message: "You've already registered. Log in.",
      };
    }

    const newUser = {
      email: email,
      password: await hashPassword(password as string),
      createdAt: Timestamp.now(),
      name: "",
      emailVerified: null,
      image: "",
    };

    adminDb.collection("users").add(newUser);

    // await signIn("credentials", {
    //   email: validatedFields.data.email,
    //   password: validatedFields.data.password,
    //   redirect: false,
    // });

    return {
      success: true,
      fields: validatedFields.data,
      message: "You've signed up successfully.",
    };
  } catch (error) {
    console.log("[signUpAction error]:", error);
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Something went wrong. Try again.",
    };
  }
}

// export const signOutAction = async () => {
//   try {
//     const session = await auth();

//     if (session) {
//       await update({
//         user: null,
//       });
//     }

//     await signOut({ redirect: false });
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error;
//     }
//     console.log("[Error]:", error);
//   }
// };

export const signInGitHub = async () => {
  try {
    await signIn("github");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log("[Error]:", error);
  }
};
