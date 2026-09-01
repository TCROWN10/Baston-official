import type { User } from "@/lib/types";

export type DashboardUser = Omit<User, "password">;
