// ** Types
// import {

// } from 'src/types'

export interface Service {
  getUserByEmail: ({ email }: { email: string }) => Promise<AuthUser | null>
}

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
  credits: number;
  usedCredits: number;
  subscription: string;
}

export type AuthUser = Pick<User, "id" | "email">;
