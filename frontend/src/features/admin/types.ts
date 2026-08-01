import type { Role } from "@/lib/types";

export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface AdminUser {
  id: string;
  email: string;
  companyName: string;
  phone?: string;
  role: Role;
  kycStatus: KycStatus;
}
