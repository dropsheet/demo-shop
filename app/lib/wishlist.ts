"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "fernwood:wishlist:v1";
const EMPTY: string[] = [];

let cache: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function parse(raw: string | null): string[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    const ids = data.filter((x): x is string => typeof x === "string" && x.length > 0);
    return Array.from(new Set(ids));
  } catch {
    return EMPTY;
  }
}

function read(): string[] {
  if (!loaded) {
    loaded = true;
    try {
      cache = parse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable or full: keep the in-memory list
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      loaded = false;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export type Wishlist = {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  count: number;
  addMany: (ids: string[]) => void;
};

export function useWishlist(): Wishlist {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);

  const addMany = useCallback((more: string[]) => {
    const current = read();
    const fresh = more.filter((id, i) => typeof id === "string" && id && !current.includes(id) && more.indexOf(id) === i);
    if (fresh.length) write([...current, ...fresh]);
  }, []);
  const add = useCallback((id: string) => addMany([id]), [addMany]);
  const remove = useCallback((id: string) => {
    const current = read();
    if (current.includes(id)) write(current.filter((x) => x !== id));
  }, []);
  const toggle = useCallback(
    (id: string) => {
      if (read().includes(id)) remove(id);
      else add(id);
    },
    [add, remove],
  );
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return useMemo(
    () => ({ ids, add, remove, toggle, has, count: ids.length, addMany }),
    [ids, add, remove, toggle, has, addMany],
  );
}
