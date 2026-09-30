import { create } from "zustand";
import axios from "axios";
import { RutInputSchema } from "@/types/score.types";
import type { UserScore } from "@/types/score.types";
import { scoreService } from "@/services/score.service";
import { cleanRut } from "@/utils/rut";

interface ScoreState {
  cache: Record<string, UserScore>;
  currentScore: UserScore | null;
  isFromCache: boolean;
  isLoading: boolean;
  error: string | null;
  lastQueriedRut: string | null;

  fetchScore: (rut: string, bypassCache?: boolean) => Promise<UserScore | null>;
  clearScore: () => void;
  clearError: () => void;
  clearCache: () => void;
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  cache: {},
  currentScore: null,
  isFromCache: false,
  isLoading: false,
  error: null,
  lastQueriedRut: null,

  fetchScore: async (
    rut: string,
    bypassCache = false,
  ): Promise<UserScore | null> => {
    const validation = RutInputSchema.safeParse({ rut });
    if (!validation.success) {
      const message = validation.error.issues[0]?.message || "RUT inválido";
      set({
        error: message,
        currentScore: null,
        isLoading: false,
        isFromCache: false,
      });
      return null;
    }

    const normalizedKey = cleanRut(rut);

    const existing = get().cache[normalizedKey];
    if (existing && !bypassCache) {
      set({
        currentScore: existing,
        isFromCache: true,
        error: null,
        lastQueriedRut: rut,
        isLoading: false,
      });
      return existing;
    }

    set({
      isLoading: true,
      error: null,
      currentScore: null,
      isFromCache: false,
    });

    try {
      const score = await scoreService.getScoreByRut(rut);

      set((state) => ({
        currentScore: score,
        cache: {
          ...state.cache,
          [normalizedKey]: score,
        },
        isFromCache: false,
        error: null,
        lastQueriedRut: rut,
        isLoading: false,
      }));

      return score;
    } catch (err) {
      let message = "Error al consultar el score";

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          message =
            err.response.data?.message ||
            "Acceso denegado: No tienes permisos para consultar el score de otro RUT.";
        } else if (err.response?.status === 404) {
          message =
            err.response.data?.message ||
            "Usuario con RUT no encontrado en el sistema.";
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      set({
        error: message,
        currentScore: null,
        isFromCache: false,
        lastQueriedRut: rut,
        isLoading: false,
      });
      return null;
    }
  },

  clearScore: () => {
    set({
      currentScore: null,
      error: null,
      isFromCache: false,
      lastQueriedRut: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  clearCache: () => {
    set({ cache: {} });
  },
}));
