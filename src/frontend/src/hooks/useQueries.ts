import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MCQResult, TypingResult } from "../backend";
import { useActor } from "./useActor";

export function usePassagesByExamAndLanguage(
  examCategory: string,
  language: string,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["passages", examCategory, language],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPassagesByExamAndLanguage(examCategory, language);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePassagesByExam(examCategory: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["passages", examCategory],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPassagesByExam(examCategory);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMCQsByExam(examCategory: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["mcqs", examCategory],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMCQsByExam(examCategory);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveTypingResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (result: TypingResult) => {
      if (!actor) return;
      return actor.saveTypingResult(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useSaveMCQResult() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (result: MCQResult) => {
      if (!actor) return;
      return actor.saveMCQResult(result);
    },
  });
}
