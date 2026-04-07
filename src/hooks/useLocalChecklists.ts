"use client";

import { useState, useCallback, useEffect } from "react";

interface LocalChecklist {
  token: string;
  title: string;
  updatedAt: string;
}

const STORAGE_KEY = "vacacheck-recent";
const MAX_ENTRIES = 10;

export function useLocalChecklists() {
  const [checklists, setChecklists] = useState<LocalChecklist[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setChecklists(JSON.parse(stored));
    }
  }, []);

  const save = useCallback((token: string, title: string) => {
    setChecklists((prev) => {
      const filtered = prev.filter((c) => c.token !== token);
      const updated = [
        { token, title, updatedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { checklists, save };
}
