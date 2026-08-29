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
    password: string;
    role: "agent" | "company";
    companyName?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublic(user: User): PublicUser {
  const { password: _password, ...rest } = user;
  return rest;
}

function seedUsers() {
  const seeds: User[] = [
    {
      id: "admin-1",
      email: "admin@ussap.ng",
      fullName: "USSAP Admin",
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
    // legacy demos
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
  const users = readUsers();
  let next = users;
  for (const seed of seeds) {
    if (!next.some((u) => u.email === seed.email)) next = [seed, ...next];
  }
  writeUsers(next);
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
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, roleHint?: UserRole) => {
    const users = readUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        (!roleHint || u.role === roleHint || (roleHint === "admin" && u.role === "admin")),
    );
    if (!found) {
      return { success: false, message: "Login failed. Please try again." };
    }
    const publicUser = toPublic(found);
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
    return { success: true, role: found.role };
  }, []);

  const register = useCallback(
    async (input: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
      role: "agent" | "company";
      companyName?: string;
    }) => {
      const users = readUsers();
      if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
        return { success: false, message: "An account with this email already exists." };
      }
      const user: User = {
        id: `user-${Date.now()}`,
        email: input.email,
        fullName: input.fullName,
        phone: input.phone,
        role: input.role,
        companyName: input.companyName,
        password: input.password,
      };
      writeUsers([user, ...users]);
      const publicUser = toPublic(user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      setUser(publicUser);
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
