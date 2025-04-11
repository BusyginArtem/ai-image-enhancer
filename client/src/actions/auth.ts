"use server";

import { CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { hashPassword } from "@/lib/auth-password";
import { AuthFormState } from "@/lib/definitions";
import { connectMongoDb } from "@/lib/mongodb";
import { signInFormSchema, signUpFormSchema } from "@/lib/validation";
import { signIn } from "@/lib/auth";

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

  try {
    await signIn("credentials", formData);

    return {
      success: true,
      fields: validatedFields.data,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof CredentialsSignin) {
      return {
        success: false,
        message: "Email or password is incorrect.",
      };
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
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  let conn: MongoClient | undefined;

  try {
    conn = await connectMongoDb();
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }

  if (!conn) {
    return {
      success: false,
      message: "Could not connect to database.",
    };
  }

  const db = conn.db();

  try {
    await db.collection("users").insertOne({
      email,
      password: await hashPassword(password),
    });

    await signIn("credentials", formData);

    conn.close();

    return {
      success: true,
      fields: validatedFields.data,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof MongoError && "code" in error && error.code === 11000) {
      return {
        success: false,
        errors: {
          email: ["Email is taken!"],
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong. Try again.",
    };
  } finally {
    conn.close();
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
