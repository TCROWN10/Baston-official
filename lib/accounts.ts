import type { User, UserRole } from "./types";
import { countPropertiesForUser } from "./ussap/user-properties";

const USERS_KEY = "myapp_users";

export type AccountRecord = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  state?: string;
  lga?: string;
  role: UserRole;
  companyName?: string;
  createdAt?: string;
  propertyCount: number;
  isDemo: boolean;
};

function readUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function isDemoAccount(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.endsWith("@ussap.ng") || lower.endsWith("@myapp.ng");
}

/** All registered accounts — for admin and government oversight (no passwords). */
export function listAllAccounts(): AccountRecord[] {
  return readUsers()
    .map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      state: user.state,
      lga: user.lga,
      role: user.role,
      companyName: user.companyName,
      createdAt: user.createdAt,
      propertyCount: countPropertiesForUser(user.id, user.email),
      isDemo: isDemoAccount(user.email),
    }))
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    });
}

export function accountStats(accounts: AccountRecord[]) {
  const byRole: Record<string, number> = {};
  let withLocation = 0;
  let withProperty = 0;
  let personal = 0;

  for (const account of accounts) {
    byRole[account.role] = (byRole[account.role] || 0) + 1;
    if (account.state) withLocation += 1;
    if (account.propertyCount > 0) withProperty += 1;
    if (!account.isDemo) personal += 1;
  }

  return {
    total: accounts.length,
    personal,
    demo: accounts.length - personal,
    withLocation,
    withProperty,
    byRole,
  };
}
