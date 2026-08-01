import type { KycStatus, Role } from "@/lib/types";

export type { KycStatus };

export interface AdminUser {
  id: string;
  email: string;
  companyName: string;
  phone?: string;
  role: Role;
  kycStatus: KycStatus;
}
