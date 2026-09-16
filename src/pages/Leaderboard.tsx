import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths } from "@/constants/enum";
import lead1 from "@/assets/lead1.svg";
import lead2 from "@/assets/lead2.svg";
import lead3 from "@/assets/lead3.svg";
import crown from "@/assets/crown.svg";

// Matches the server cache window, so polling never asks for work the API has
// not redone yet. React Query pauses this while the tab is in the background.
const REFRESH_INTERVAL_MS = 30_000;

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string | null;
  collegeName: string | null;
  totalScore: number;
  eventsPlayed: number;
}

interface LeaderboardOverview {
  users: LeaderboardEntry[];
  teams: LeaderboardEntry[];
  colleges: LeaderboardEntry[];
  generatedAt: string;
}

type BoardKey = "colleges" | "teams" | "users";

const BOARDS: { key: BoardKey; label: string }[] = [
  { key: "colleges", label: "Colleges" },
  { key: "teams", label: "Teams" },
  { key: "users", label: "Individuals" },
];

const PODIUM_ORDER = [1, 0, 2];
const PODIUM_STYLES = [
  { height: "h-2/3", background: "bg-[#1F102D]", badge: lead2 },
  { height: "h-full", background: "bg-[#311A49]", badge: lead1 },
  { height: "h-1/3", background: "bg-[#1F102D]", badge: lead3 },
];

function entryLabel(entry: LeaderboardEntry): string {
  return entry.name?.trim() || entry.id;
}

function entrySubLabel(entry: LeaderboardEntry, board: BoardKey): string | null {
  if (board === "colleges") {
    return `${entry.eventsPlayed} ${entry.eventsPlayed === 1 ? "entry" : "entries"}`;
  }
  return entry.collegeName;
}

export const Leaderboard = () => {
  const [board, setBoard] = useState<BoardKey>("colleges");
  const { getWithoutAuth } = useAxios();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await getWithoutAuth<LeaderboardOverview>(ApiPaths.LEADERBOARD);
      return response?.data;
    },
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: REFRESH_INTERVAL_MS,
  });

  const entries = data?.[board] ?? [];
  const podium = PODIUM_ORDER.map((index) => entries[index]);
  const rest = entries.slice(3);

  return (
    <main className="h-[92vh] w-full overflow-y-auto overflow-x-hidden text-white">
      <div className="flex flex-wrap items-center justify-center gap-2 px-4 pt-6">
        {BOARDS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setBoard(key)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              board === key
                ? "bg-[#5D3288] text-white"
                : "bg-[#1F102D] text-indigo-200 hover:bg-[#311A49]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="py-16 text-center text-indigo-200">Loading leaderboard...</p>
      )}

      {isError && (
        <p className="py-16 text-center text-red-400">
          Could not load the leaderboard. Please try again shortly.
        </p>
      )}

      {!isLoading && !isError && entries.length === 0 && (
        <p className="py-16 text-center text-indigo-200">
          No scores have been posted yet. Check back once events get underway.
        </p>
      )}

      {entries.length > 0 && (
        <div className="flex w-full flex-col gap-6 px-4 pb-10 pt-8 lg:flex-row">
          <section className="w-full lg:w-2/3">
            <div className="flex justify-center">
              <img src={crown} alt="" className="h-20 w-20" />
            </div>

            <div className="mx-auto mt-10 flex h-[40vh] max-w-2xl items-end gap-2">
              {podium.map((entry, slot) => {
                const style = PODIUM_STYLES[slot];
                if (!entry) return <div key={slot} className="w-1/3" />;

                return (
                  <div
                    key={entry.id}
                    className={`${style.height} ${style.background} flex w-1/3 flex-col items-center justify-start rounded-2xl px-2 pb-4`}
                  >
                    <img src={style.badge} alt="" className="-mt-12 h-24 w-24" />
                    <div className="mt-3 w-full text-center">
                      <div className="truncate px-2 text-sm md:text-base">
                        {entryLabel(entry)}
                      </div>
                      <div className="mt-1 text-xl font-semibold md:text-3xl">
                        {entry.totalScore}
                      </div>
                      <div className="mt-1 truncate px-2 text-xs text-indigo-300">
                        {entrySubLabel(entry, board)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="w-full rounded-2xl bg-[#1F102D] p-4 lg:w-1/3">
            {rest.length === 0 ? (
              <p className="py-8 text-center text-sm text-indigo-300">
                Only the top spots are filled so far.
              </p>
            ) : (
              <ul className="flex max-h-[60vh] flex-col overflow-y-auto">
                {rest.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3 border-b border-[#5F59598A] py-3"
                  >
                    <span className="min-w-[2.5rem] rounded-full bg-[#311A49] px-3 py-1 text-center text-sm">
                      {entry.rank}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-sm">{entryLabel(entry)}</div>
                      <div className="truncate text-xs text-indigo-300">
                        {entrySubLabel(entry, board)}
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{entry.totalScore}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  );
};
