"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User, UserRole } from "./types";

const USERS_KEY = "myapp_users";
const SESSION_KEY = "myapp_session";

type PublicUser = Omit<User, "password">;

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    roleHint?: UserRole,
  ) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  register: (input: {
    fullName: string;
    email: string;
    phone: string;
    state: string;
    lga: string;
    password: string;
    role: "agent" | "company";
    companyName?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (input: {
    fullName: string;
    phone: string;
    state: string;
    lga: string;
    companyName?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  changePassword: (input: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // localStorage blocked (private mode, etc.)
  }
}

function writeSession(user: PublicUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

const DEMO_SEEDS: User[] = [
  {
    id: "admin-1",
    email: "admin@ussap.ng",
    fullName: "Bastion Admin",
    phone: "+234 800 000 0000",
    role: "admin",
    password: "admin123",
  },
  {
    id: "gov-1",
    email: "gov@ussap.ng",
    fullName: "Municipal Planner",
    phone: "+234 809 000 0001",
    role: "government",
    password: "gov123",
  },
  {
    id: "telecom-1",
    email: "telecom@ussap.ng",
    fullName: "Telecom Operator",
    phone: "+234 803 000 0002",
    role: "telecom",
    password: "telecom123",
  },
  {
    id: "pm-1",
    email: "pm@ussap.ng",
    fullName: "Project Manager",
    phone: "+234 804 000 0003",
    role: "project_manager",
    password: "pm123",
  },
  {
    id: "edu-1",
    email: "school@ussap.ng",
    fullName: "School Admin",
    phone: "+234 805 000 0004",
    role: "education",
    password: "school123",
  },
  {
    id: "citizen-1",
    email: "citizen@ussap.ng",
    fullName: "Homeowner",
    phone: "+234 806 000 0005",
    role: "citizen",
    password: "citizen123",
  },
  {
    id: "field-1",
    email: "field@ussap.ng",
    fullName: "Field Agent",
    phone: "+234 807 000 0006",
    role: "field_agent",
    password: "field123",
  },
  {
    id: "admin-legacy",
    email: "admin@myapp.ng",
    fullName: "Admin User",
    phone: "+234 800 000 0000",
    role: "admin",
    password: "admin123",
  },
  {
    id: "gov-legacy",
    email: "gov@myapp.ng",
    fullName: "Government Officer",
    phone: "+234 809 000 0001",
    role: "government",
    password: "gov123",
  },
  {
    id: "agent-1",
    email: "agent@myapp.ng",
    fullName: "Demo Agent",
    phone: "+234 801 111 1111",
    role: "agent",
    password: "agent123",
  },
];

/** Ensure demo accounts exist and always have the correct passwords. */
function seedUsers() {
  const users = readUsers();
  const byEmail = new Map(users.map((u) => [u.email.toLowerCase(), u]));

  for (const seed of DEMO_SEEDS) {
    byEmail.set(seed.email.toLowerCase(), { ...seed });
  }

  writeUsers(Array.from(byEmail.values()));
}

function toPublic(user: User): PublicUser {
  const { password: _password, ...rest } = user;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedUsers();
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as PublicUser);
    } catch {
      writeSession(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, roleHint?: UserRole) => {
    seedUsers();
    const users = readUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) {
      return { success: false, message: "Invalid email or password." };
    }
    if (
      roleHint &&
      found.role !== roleHint &&
      !(roleHint === "admin" && found.role === "admin")
    ) {
      // Credentials are valid but the wrong account type was selected — still sign in
      // and route to the account's actual workspace.
    }
    const publicUser = toPublic(found);
    writeSession(publicUser);
    setUser(publicUser);
    return { success: true, role: found.role };
  }, []);

  const register = useCallback(
    async (input: {
      fullName: string;
      email: string;
      phone: string;
      state: string;
      lga: string;
      password: string;
      role: "agent" | "company";
      companyName?: string;
    }) => {
      seedUsers();
      const users = readUsers();
      if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
        return { success: false, message: "An account with this email already exists." };
      }
      const user: User = {
        id: `user-${Date.now()}`,
        email: input.email,
        fullName: input.fullName,
        phone: input.phone,
        state: input.state,
        lga: input.lga,
        role: input.role,
        companyName: input.companyName,
        password: input.password,
        createdAt: new Date().toISOString(),
      };
      writeUsers([user, ...users]);
      const publicUser = toPublic(user);
      writeSession(publicUser);
      setUser(publicUser);
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (input: {
      fullName: string;
      phone: string;
      state: string;
      lga: string;
      companyName?: string;
    }) => {
      if (!user) return { success: false, message: "You must be signed in." };
      const fullName = input.fullName.trim();
      if (!fullName) return { success: false, message: "Full name is required." };
      if (!input.state || !input.lga) {
        return { success: false, message: "Please select your state and LGA." };
      }

      const users = readUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx < 0) return { success: false, message: "Account not found." };

      const next: User = {
        ...users[idx],
        fullName,
        phone: input.phone.trim(),
        state: input.state,
        lga: input.lga,
        companyName:
          users[idx].role === "company"
            ? (input.companyName?.trim() || users[idx].companyName)
            : users[idx].companyName,
      };
      users[idx] = next;
      writeUsers(users);
      const publicUser = toPublic(next);
      writeSession(publicUser);
      setUser(publicUser);
      return { success: true };
    },
    [user],
  );

  const changePassword = useCallback(
    async (input: { currentPassword: string; newPassword: string }) => {
      if (!user) return { success: false, message: "You must be signed in." };
      if (input.newPassword.length < 6) {
        return { success: false, message: "New password must be at least 6 characters." };
      }
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx < 0) return { success: false, message: "Account not found." };
      if (users[idx].password !== input.currentPassword) {
        return { success: false, message: "Current password is incorrect." };
      }
      users[idx] = { ...users[idx], password: input.newPassword };
      writeUsers(users);
      return { success: true };
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, login, register, updateProfile, changePassword, logout }),
    [user, loading, login, register, updateProfile, changePassword, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
