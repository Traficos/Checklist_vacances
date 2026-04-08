"use client";

import { useState, useCallback } from "react";

interface LocalChecklist {
  token: string;
  title: string;
  updatedAt: string;
}

const STORAGE_KEY = "vacacheck-recent";
const MAX_ENTRIES = 10;

function getStored(): LocalChecklist[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function useLocalChecklists() {
  const [checklists, setChecklists] = useState<LocalChecklist[]>(getStored);

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
