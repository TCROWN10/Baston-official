"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/Footer";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useAuth } from "@/lib/auth";
import { lgasForState, NIGERIA_STATES } from "@/lib/civic/nigeria-admin";
import { dashboardPath } from "@/lib/ussap/rbac";
import type { UssapRole } from "@/lib/ussap/types";
import type { UserRole } from "@/lib/types";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function roleLabel(role: UserRole) {
  switch (role) {
    case "agent":
      return "Individual agent";
    case "company":
      return "Organisation";
    case "project_manager":
      return "Project manager";
    case "field_agent":
      return "Field agent";
    case "government":
      return "Government";
    case "education":
      return "Education";
    case "telecom":
      return "Telecom";
    case "citizen":
      return "Citizen";
    case "admin":
      return "Administrator";
    case "guest":
      return "Guest";
    default:
      return role;
  }
}

export default function AccountPage() {
  const { user, loading, updateProfile, changePassword, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    state: "",
    lga: "",
    companyName: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    setProfile({
      fullName: user.fullName || "",
      phone: user.phone || "",
      state: user.state || "",
      lga: user.lga || "",
      companyName: user.companyName || "",
    });
  }, [user]);

  const stateOptions = useMemo(
    () => [
      { value: "", label: "Select state" },
      ...NIGERIA_STATES.map((state) => ({ value: state, label: state })),
    ],
    [],
  );

  const lgaOptions = useMemo(() => {
    const lgas = profile.state ? lgasForState(profile.state) : [];
    return [
      { value: "", label: "Select local government" },
      ...lgas.map((lga) => ({ value: lga, label: lga })),
    ];
  }, [profile.state]);

  if (loading || !user) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-sm text-slate-500">Loading profile…</p>
        </section>
      </SiteShell>
    );
  }

  const dashHref = dashboardPath(user.role as UssapRole);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    const result = await updateProfile(profile);
    setSavingProfile(false);
    if (!result.success) {
      setProfileMsg({ type: "err", text: result.message || "Could not save profile." });
      return;
    }
    setProfileMsg({ type: "ok", text: "Profile updated successfully." });
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    setSavingPassword(true);
    const result = await changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setSavingPassword(false);
    if (!result.success) {
      setPasswordMsg({ type: "err", text: result.message || "Could not change password." });
      return;
    }
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordMsg({ type: "ok", text: "Password changed successfully." });
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-lg font-semibold text-white shadow-sm"
              aria-hidden
            >
              {initials(user.fullName)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Profile</h1>
              <p className="mt-0.5 text-sm text-slate-600">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#1e3a5f]/10 px-2 py-0.5 text-xs font-medium text-[#1e3a5f]">
                  {roleLabel(user.role)}
                </span>
                {memberSince ? (
                  <span className="text-xs text-slate-500">Joined {memberSince}</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={dashHref}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <Link
              href="/account/trips"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              My trips
            </Link>
          </div>
        </div>

        <form
          onSubmit={onSaveProfile}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-base font-semibold text-slate-900">Personal details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update how your name and contact details appear across USSAP.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">Full name</span>
              <input
                name="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#3d7ea6] focus:ring-2 focus:ring-[#3d7ea6]/20"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">Email</span>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
              />
              <span className="mt-1 block text-xs text-slate-400">Email cannot be changed here.</span>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">Phone</span>
              <input
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+234 …"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#3d7ea6] focus:ring-2 focus:ring-[#3d7ea6]/20"
              />
            </label>

            {user.role === "company" ? (
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-slate-600">
                  Organisation name
                </span>
                <input
                  name="companyName"
                  value={profile.companyName}
                  onChange={(e) => setProfile((p) => ({ ...p, companyName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#3d7ea6] focus:ring-2 focus:ring-[#3d7ea6]/20"
                />
              </label>
            ) : null}

            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-600">State</span>
              <CustomSelect
                value={profile.state}
                onChange={(value) => setProfile((p) => ({ ...p, state: value, lga: "" }))}
                options={stateOptions}
                placeholder="Select state"
              />
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-600">
                Local government (LGA)
              </span>
              <CustomSelect
                value={profile.lga}
                onChange={(value) => setProfile((p) => ({ ...p, lga: value }))}
                options={lgaOptions}
                placeholder={profile.state ? "Select LGA" : "Select state first"}
              />
            </div>
          </div>

          {profileMsg ? (
            <p
              className={`mt-4 text-sm ${
                profileMsg.type === "ok" ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {profileMsg.text}
            </p>
          ) : null}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#152a45] disabled:opacity-60"
            >
              {savingProfile ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>

        <form
          onSubmit={onChangePassword}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-base font-semibold text-slate-900">Password</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password you do not use elsewhere.
          </p>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">
                Current password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
                }
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#3d7ea6] focus:ring-2 focus:ring-[#3d7ea6]/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">New password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#3d7ea6] focus:ring-2 focus:ring-[#3d7ea6]/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">
                Confirm new password
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#3d7ea6] focus:ring-2 focus:ring-[#3d7ea6]/20"
              />
            </label>
          </div>

          {passwordMsg ? (
            <p
              className={`mt-4 text-sm ${
                passwordMsg.type === "ok" ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {passwordMsg.text}
            </p>
          ) : null}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60"
            >
              {savingPassword ? "Updating…" : "Change password"}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-red-100 bg-white p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Sign out</h2>
          <p className="mt-1 text-sm text-slate-500">
            End your session on this device. You can sign back in anytime.
          </p>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="cursor-pointer mt-4 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </section>
    </SiteShell>
  );
}
