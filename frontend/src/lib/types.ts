export type Role = "ANNONCEUR" | "MEDIA_BUYER" | "REGISSEUR" | "ADMIN";

export interface AuthUser {
  userId: string;
  email: string;
  companyName: string;
  role: Role;
}

export interface AuthResponse extends AuthUser {
  token: string;
}
