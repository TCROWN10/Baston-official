"use client";

import { useCallback, useEffect, useState } from "react";
import type { VerificationStatus } from "./types";

const KEY = "myapp_gov_verifications";

type MapT = Record<string, VerificationStatus>;

function read(): MapT {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as MapT;
  } catch {
    return {};
  }
}

function write(map: MapT) {
  localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("gov-registry-updated"));
}

export function useVerificationMap() {
  const [map, setMap] = useState<MapT>({});

  useEffect(() => {
    const refresh = () => setMap(read());
    refresh();
    window.addEventListener("gov-registry-updated", refresh);
    return () => window.removeEventListener("gov-registry-updated", refresh);
  }, []);

  const setStatus = useCallback((id: string, status: VerificationStatus) => {
    const next = { ...read(), [id]: status };
    write(next);
    setMap(next);
  }, []);

  const statusOf = useCallback(
    (id: string, fallback: VerificationStatus) => map[id] ?? fallback,
    [map],
  );

  return { map, setStatus, statusOf };
}
