"use client";

import { useCallback, useEffect, useState } from "react";
import type { HotelRecord } from "@/lib/civic/types";

type Result = {
  items: HotelRecord[];
  loading: boolean;
  source: string;
  liveCount: number;
  error: string | null;
  refresh: () => void;
};

export function useLiveHotels(): Result {
  const [items, setItems] = useState<HotelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("loading");
  const [liveCount, setLiveCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/live/hotels${refresh ? "?refresh=1" : ""}`);
      const json = (await res.json()) as {
        data: HotelRecord[];
        source: string;
        liveCount: number;
      };
      setItems(json.data ?? []);
      setSource(json.source ?? "unknown");
      setLiveCount(json.liveCount ?? 0);
    } catch {
      setError("Could not load live hotels. Try again shortly.");
    } finally {
      setLoading(false);
    }
  }, []);

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
