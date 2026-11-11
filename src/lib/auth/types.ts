export type UserRole = "apprenant" | "formateur" | "consultant" | "expert" | "admin";

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  subscription?: {
    status: "free" | "active";
    planId: string | null;
  };
  emailVerified?: boolean;
}

export class AuthenticationError extends Error {
  constructor(
    readonly status: 401 | 403,
    message: string,
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}
