"use client";

import type { SavedHome } from "./types";

const KEY = "tanAdvertSavedHomes";

function read(): SavedHome[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedHome[]) : [];
  } catch {
    return [];
  }
}

function write(homes: SavedHome[]) {
  localStorage.setItem(KEY, JSON.stringify(homes));
  window.dispatchEvent(new Event("saved-homes-updated"));
}

export function getSavedHomes(): SavedHome[] {
  return read();
}

export function isSaved(id: string): boolean {
  return read().some((h) => h.id === id);
}

export function removeSavedHome(id: string) {
  write(read().filter((h) => h.id !== id));
}

export function toggleSavedHome(home: SavedHome): boolean {
  const current = read();
  const exists = current.some((h) => h.id === home.id);
  if (exists) {
    write(current.filter((h) => h.id !== home.id));
    return false;
  }
  write([home, ...current]);
  return true;
}
