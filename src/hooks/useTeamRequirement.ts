/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

import { ApiPaths } from "@/constants/enum";
import useAxios from "@/hooks/useAxios";
import { useIsSignedIn } from "@/hooks/useIsSignedIn";
import { useAuthStore } from "@/store/ApiStates";

export type TeamRequirement =
  | { status: "n/a" }
  | { status: "ok" }
  | { status: "no-team"; min: number; max: number }
  | { status: "too-small"; min: number; max: number; biggest: number }
  | { status: "too-big"; min: number; max: number; smallest: number };

/**
 * Whether the signed-in person has a team that fits a team event's size.
 *
 * Events pages are public, so they are not wrapped in ProtectedRoute and
 * nothing else loads the person's teams or profile there — reading the store
 * alone gave an empty or stale answer. Both are fetched here (same query keys
 * the rest of the app uses, so the cache is shared).
 */
export function useTeamRequirement(events: any[]): Record<string, TeamRequirement> {
  const signedIn = useIsSignedIn();
  const { getWithAuth } = useAxios();
  const { setTeams, setUser } = useAuthStore();

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.TEAM);
      setTeams(response?.data);
      return response?.data ?? [];
    },
    enabled: signedIn === true,
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.USER);
      setUser(response?.data);
      return response?.data;
    },
    enabled: signedIn === true,
  });

  const result: Record<string, TeamRequirement> = {};
  for (const event of events ?? []) {
    if (!event?.id) continue;
    result[event.id] = check(event, signedIn === true, user, teams);
  }
  return result;
}

function check(event: any, signedIn: boolean, user: any, teams: any[] | undefined): TeamRequirement {
  const max = event?.teamMaxSize ?? 1;
  const min = event?.teamMinSize ?? 1;
  // Solo events, signed-out visitors, alumni, and "still loading" never warn.
  if (!signedIn || !user || user?.role === "ALUMNI" || !(max > 1) || !teams) {
    return { status: "n/a" };
  }

  const sizes = teams.map((team: any) => team?.members?.length ?? 0);
  if (sizes.some((size) => size >= min && size <= max)) return { status: "ok" };
  if (sizes.length === 0) return { status: "no-team", min, max };

  const biggest = Math.max(...sizes);
  if (biggest < min) return { status: "too-small", min, max, biggest };
  return { status: "too-big", min, max, smallest: Math.min(...sizes) };
}

export function teamRequirementMessage(req: TeamRequirement): string | null {
  switch (req.status) {
    case "no-team":
      return `This event is played in teams of ${req.min} to ${req.max}. You are not in a team yet.`;
    case "too-small":
      return `This event needs at least ${req.min} members. Your largest team has ${req.biggest}.`;
    case "too-big":
      return `This event allows at most ${req.max} members. Your smallest team has ${req.smallest}.`;
    default:
      return null;
  }
}
