export type Role = "ADMIN" | "USER";

export const PERMISSIONS = {
  ADMIN: { create: true, cancel: true, reverse: true, report: true },
  USER:  { create: true, cancel: false, reverse: false, report: true }
} as const;

export function canCancel(role: Role, status: "ACTIVE"|"CANCELLED"|"REVERSED") {
  return PERMISSIONS[role].cancel && status === "ACTIVE";
}
export function canReverse(role: Role, status: "ACTIVE"|"CANCELLED"|"REVERSED") {
  return PERMISSIONS[role].reverse && status === "ACTIVE";
}
export function canReport(role: Role) {
  return PERMISSIONS[role].report;
}
