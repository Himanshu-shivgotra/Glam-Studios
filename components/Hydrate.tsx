"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function Hydrate() {
  useEffect(() => { useStore.persist.rehydrate(); }, []);
  return null;
}
