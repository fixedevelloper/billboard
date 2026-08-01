import type { Role } from "./types";

const DASHBOARD_PATHS: Record<Role, string> = {
  ANNONCEUR: "/annonceur",
  MEDIA_BUYER: "/media-buyer",
  REGISSEUR: "/regisseur",
  ADMIN: "/admin",
};

export function dashboardPathForRole(role: Role): string {
  return DASHBOARD_PATHS[role];
}
