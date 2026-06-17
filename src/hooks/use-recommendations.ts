import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import {
  getRecommendations,
  getInterests,
  setInterests,
  listSaves,
  toggleSave,
  type Recommendation,
} from "@/lib/recommend.functions";
import type { ItemType } from "@/lib/recommendation-catalog";

export function useRecommendations(surface: "library" | "trails" | "home") {
  const { user } = useAuth();
  const fn = useServerFn(getRecommendations);
  return useQuery({
    queryKey: ["recommendations", surface, user?.id ?? "anon"],
    queryFn: async () => {
      if (!user) return { recommendations: [] as Recommendation[] };
      return fn({ data: { surface } });
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useInterests() {
  const { user } = useAuth();
  const fn = useServerFn(getInterests);
  return useQuery({
    queryKey: ["interests", user?.id ?? "anon"],
    queryFn: async () => {
      if (!user) return { categories: [], regions: [], onboarded: false };
      return fn();
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}

export function useSetInterests() {
  const fn = useServerFn(setInterests);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { categories: string[]; regions: string[] }) => fn({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interests"] });
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}

export function useSaves() {
  const { user } = useAuth();
  const fn = useServerFn(listSaves);
  return useQuery({
    queryKey: ["saves", user?.id ?? "anon"],
    queryFn: async () => (user ? await fn() : []),
    enabled: !!user,
    staleTime: 30 * 1000,
  });
}

export function useToggleSave() {
  const fn = useServerFn(toggleSave);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { itemType: ItemType; itemId: string }) => fn({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saves"] });
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}
