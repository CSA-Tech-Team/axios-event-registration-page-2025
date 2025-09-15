import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LocalStorageEnum } from "../constants/enum";

type AuthStoreType = {
  authToken: string | null;
  user: object | null;
  isProfileCompleted: boolean;
  teams: object[] | null;
  ownedTeams: object[] | null;
  events: object[] | null;
  registeredEvents: object[] | null;
  accommodation: object | null;

  setAuthToken: (token: string) => void;
  setUser: (token: object) => void;
  setIsProfileCompleted: (token: boolean) => void;
  setTeams: (token: object[]) => void;
  setEvents: (token: object[]) => void;
  setOwnedTeams: (token: object[]) => void;
  setRegisteredEvents: (token: object[]) => void;
  setAccommodation: (token: object) => void;

  isAuthenticated: () => boolean;
  clearTokens: () => void;

  getAuthToken: () => string | null;
  getUser: () => any | null;
  getIsProfileCompleted: () => boolean;
  getTeams: () => object[] | null;
  getOwnedTeams: () => object[] | null;
  getEvents: () => object[] | null;
  getRegisteredEvents: () => object[] | null;
  getAccommodation: () => any | null;
};

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      authToken: null,
      user: null,
      isProfileCompleted: false,
      teams: [],
      ownedTeams: [],
      events: [],
      registeredEvents: [],
      accommodation: null,

      setAuthToken: (token: string) => set({ authToken: token }),
      setUser: (token: object) => set({ user: token }),
      setEvents: (token: object[]) => set({ events: token }),
      setIsProfileCompleted: (token: boolean) =>
        set({ isProfileCompleted: token }),
      setTeams: (token: object[]) => set({ teams: token }),
      setOwnedTeams: (token: object[]) => set({ ownedTeams: token }),
      setRegisteredEvents: (token: object[]) =>
        set({ registeredEvents: token }),
      setAccommodation: (token: object) => set({ accommodation: token }),

      clearTokens: () =>
        set({
          authToken: null,
          user: null,
          isProfileCompleted: false,
          teams: [],
          ownedTeams: [],
          events: [],
          registeredEvents: [],
          accommodation: null,
        }),

      isAuthenticated: () => !!get().authToken,

      getAuthToken: () => get().authToken,
      getUser: () => get().user,
      getIsProfileCompleted: () => get().isProfileCompleted,
      getTeams: () => get().teams,
      getOwnedTeams: () => get().ownedTeams,
      getEvents: () => get().events,
      getRegisteredEvents: () => get().registeredEvents,
      getAccommodation: () => get().accommodation,
    }),
    {
      name: LocalStorageEnum.API_STORE,
    }
  )
);
