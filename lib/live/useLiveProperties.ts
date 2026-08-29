"use client";

import { useCallback, useEffect, useState } from "react";
import type { Property } from "@/lib/types";
import type { SearchTab } from "@/lib/types";

type Result = {
  items: Property[];
  loading: boolean;
  source: string;
  liveCount: number;
  error: string | null;
  refresh: () => void;
};

export function useLiveProperties(tab?: SearchTab): Result {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("loading");
  const [liveCount, setLiveCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (refresh = false) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        if (refresh) qs.set("refresh", "1");
        if (tab) qs.set("tab", tab);
        const res = await fetch(`/api/live/properties?${qs}`);
        const json = (await res.json()) as {
          data: Property[];
          source: string;
          liveCount: number;
        };
        setItems(json.data ?? []);
        setSource(json.source ?? "unknown");
        setLiveCount(json.liveCount ?? 0);
      } catch {
        setError("Could not load live properties. Try again shortly.");
      } finally {
        setLoading(false);
      }
    },
    [tab],
  );

  useEffect(() => {
    load(false);
  }, [load]);

  return {
    items,
    loading,
    source,
    liveCount,
    error,
    refresh: () => load(true),
  };
}

export async function fetchLiveProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`/api/live/properties?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { property: Property };
    return json.property ?? null;
  } catch {
    return null;
  }
}

export async function fetchLiveHotel(id: string) {
  try {
    const res = await fetch(`/api/live/hotels?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { hotel: import("@/lib/civic/types").HotelRecord };
    return json.hotel ?? null;
  } catch {
    return null;
  }
}
