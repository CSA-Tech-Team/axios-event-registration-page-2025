import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths } from "@/constants/enum";

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

// The winner sits in the middle, so the three podium slots render 2nd, 1st, 3rd.
const PODIUM_ORDER = [1, 0, 2];

// Keyed by rank rather than by slot: tied entries share a rank, and so must
// share a stamp, height and colour instead of being dressed as 1-2-3 by the
// order they happen to arrive in.
const PODIUM_STYLES: Record<number, { height: string; background: string; stamp: string }> = {
  1: { height: "h-full", background: "bg-acc-2", stamp: "bg-acc text-white" },
  2: { height: "h-2/3", background: "bg-card", stamp: "bg-ink text-paper" },
  3: { height: "h-1/2", background: "bg-card", stamp: "bg-wcard text-ink" },
};

function podiumStyle(rank: number) {
  return PODIUM_STYLES[rank] ?? PODIUM_STYLES[3];
}

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
    <div className="brut-container relative pb-20 pt-10 md:pt-14">

      <header className="border-b-2 border-ink pb-6">
        <p className="eyebrow text-ink-2">Axios · Live standings</p>
        <h1 className="display-title registration mt-2">Leaderboard</h1>
      </header>

      {/* Tabs sit on a heavy rule rather than in pills (§10.7). */}
      <div
        role="group"
        aria-label="Leaderboard"
        className="mt-8 flex gap-x-1 border-b-[3px] border-ink"
      >
        {BOARDS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={board === key}
            onClick={() => setBoard(key)}
            className={`-mb-[3px] min-h-11 border-2 border-b-[3px] px-3 py-2 text-xs font-extrabold sm:px-5 sm:text-sm uppercase tracking-[0.08em] transition-colors duration-150 ${
              board === key
                ? "border-ink border-b-card bg-card text-ink"
                : "border-transparent border-b-ink text-ink-2 hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="py-16 text-center font-mono text-sm uppercase tracking-[0.08em] text-ink">
          <span aria-hidden="true" className="mr-2 inline-block h-3 w-2 animate-brut-blink bg-ink align-middle" />
          Loading leaderboard...
        </p>
      )}

      {isError && (
        <p
          role="alert"
          className="mx-auto mt-12 max-w-xl border-2 border-ink border-l-[8px] border-l-acc bg-wcard px-4 py-3 text-center font-semibold text-ink"
        >
          Could not load the leaderboard. Please try again shortly.
        </p>
      )}

      {!isLoading && !isError && entries.length === 0 && (
        <div className="mx-auto mt-12 max-w-xl -rotate-[0.5deg] border-2 border-dashed border-ink bg-card px-6 py-8 text-center">
          <p className="font-note text-2xl text-ink">No scores yet</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            No scores have been posted yet. Check back once events get underway.
          </p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="mt-10 flex w-full flex-col gap-10 lg:flex-row lg:items-end">
          <section aria-label="Top three" className="w-full lg:min-w-0 lg:flex-[2]">
            <div className="mx-auto flex h-[40vh] min-h-[300px] max-w-2xl items-end gap-3">
              {podium.map((entry, slot) => {
                if (!entry) return <div key={slot} className="min-w-0 flex-1" />;
                const style = podiumStyle(entry.rank);

                return (
                  <div
                    key={entry.id}
                    // min-h-fit keeps the short third-place block from spilling
                    // its name and score out below the card.
                    className={`${style.height} ${style.background} flex min-h-fit min-w-0 flex-1 flex-col items-center justify-start border-2 border-ink px-2 pb-4 text-ink shadow-brut-md`}
                  >
                    <div className="-mt-7">
                      <span
                        role="img"
                        aria-label={`Rank ${entry.rank}`}
                        className={`${style.stamp} flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink font-display text-2xl shadow-brut-sm`}
                      >
                        {entry.rank}
                      </span>
                    </div>
                    <div className="mt-3 w-full text-center">
                      <div lang="en" className="line-clamp-3 hyphens-auto break-words px-1 text-[11px] font-bold leading-tight sm:px-2 sm:text-sm md:text-base">
                        {entryLabel(entry)}
                      </div>
                      <div className="mt-1 font-display text-3xl leading-none md:text-5xl">
                        {entry.totalScore}
                      </div>
                      <div className="mt-2 break-words px-1 font-mono text-[11px] uppercase leading-tight sm:px-2 sm:text-xs">
                        {entrySubLabel(entry, board)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-label="Rankings" className="brut-card w-full p-4 lg:min-w-0 lg:flex-1">
            {rest.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-2">
                Only the top spots are filled so far.
              </p>
            ) : (
              <ul className="scrollbar flex max-h-[60vh] flex-col overflow-y-auto">
                {rest.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3 border-b-2 border-dashed border-line py-3 last:border-b-0"
                  >
                    <span className="min-w-[2.75rem] border-2 border-ink bg-wcard px-2 py-1 text-center font-mono text-sm font-bold">
                      {entry.rank}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-sm font-bold">{entryLabel(entry)}</div>
                      <div className="truncate text-xs text-ink-2">
                        {entrySubLabel(entry, board)}
                      </div>
                    </div>
                    <span className="font-display text-xl">{entry.totalScore}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
