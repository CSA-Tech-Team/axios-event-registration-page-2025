import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Leaderboard } from "./Leaderboard";

const getWithoutAuth = vi.fn();

vi.mock("@/hooks/useAxios", () => ({
  default: () => ({ getWithoutAuth }),
}));

function entry(overrides: Record<string, unknown>) {
  return {
    rank: 1,
    id: "ID",
    name: "Name",
    collegeName: "College A",
    totalScore: 10,
    eventsPlayed: 2,
    ...overrides,
  };
}

const OVERVIEW = {
  colleges: [
    entry({ rank: 1, id: "College A", name: "College A", totalScore: 350, eventsPlayed: 3 }),
    entry({ rank: 2, id: "College B", name: "College B", totalScore: 220, eventsPlayed: 2 }),
    entry({ rank: 3, id: "College C", name: "College C", totalScore: 120, eventsPlayed: 1 }),
    entry({ rank: 4, id: "College D", name: "College D", totalScore: 40, eventsPlayed: 1 }),
  ],
  teams: [entry({ rank: 1, id: "T1", name: "Team Alpha", totalScore: 200 })],
  users: [entry({ rank: 1, id: "U1", name: "Alice Anand", totalScore: 100 })],
  generatedAt: new Date().toISOString(),
};

function renderLeaderboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Leaderboard />
    </QueryClientProvider>,
  );
}

describe("Leaderboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getWithoutAuth.mockResolvedValue({ data: OVERVIEW });
  });

  it("shows a loading state before the boards arrive", () => {
    getWithoutAuth.mockReturnValue(new Promise(() => {}));
    renderLeaderboard();

    expect(screen.getByText(/loading leaderboard/i)).toBeInTheDocument();
  });

  it("requests the combined leaderboard endpoint once", async () => {
    renderLeaderboard();

    await screen.findByText("College A");
    expect(getWithoutAuth).toHaveBeenCalledTimes(1);
    expect(getWithoutAuth).toHaveBeenCalledWith("/leaderboard");
  });

  it("shows the colleges board first", async () => {
    renderLeaderboard();

    expect(await screen.findByText("College A")).toBeInTheDocument();
    expect(screen.getByText("350")).toBeInTheDocument();
  });

  // Top three sit on a podium where the winner is centred, so the rendered
  // order is 2nd, 1st, 3rd rather than 1st, 2nd, 3rd.
  it("centres the winner on the podium", async () => {
    renderLeaderboard();
    await screen.findByText("College A");

    const podiumNames = screen
      .getAllByText(/^College [ABC]$/)
      .map((node) => node.textContent);

    expect(podiumNames).toEqual(["College B", "College A", "College C"]);
  });

  it("badges each podium place by its rank", async () => {
    renderLeaderboard();
    await screen.findByText("College A");

    const badges = screen.getAllByRole("img", { name: /^Rank / });
    expect(badges.map((badge) => badge.getAttribute("aria-label"))).toEqual([
      "Rank 2",
      "Rank 1",
      "Rank 3",
    ]);
  });

  // The API hands out equal ranks for equal scores, so the podium has to show
  // both winners as first rather than demoting whichever arrived second.
  it("puts tied entries on the same podium step", async () => {
    getWithoutAuth.mockResolvedValue({
      data: {
        ...OVERVIEW,
        colleges: [
          entry({ rank: 1, id: "College A", name: "College A", totalScore: 350 }),
          entry({ rank: 1, id: "College B", name: "College B", totalScore: 350 }),
          entry({ rank: 3, id: "College C", name: "College C", totalScore: 120 }),
        ],
      },
    });
    renderLeaderboard();
    await screen.findByText("College A");

    const badges = screen.getAllByRole("img", { name: /^Rank / });
    expect(badges.map((badge) => badge.getAttribute("aria-label"))).toEqual([
      "Rank 1",
      "Rank 1",
      "Rank 3",
    ]);

    const [tiedB, tiedA] = badges.map((badge) => badge.closest("div"));
    expect(tiedA?.className).toEqual(tiedB?.className);
  });

  it("lists everyone past the top three below the podium", async () => {
    renderLeaderboard();
    await screen.findByText("College A");

    const runnerUp = screen.getByText("College D").closest("li");
    expect(runnerUp).not.toBeNull();
    expect(within(runnerUp as HTMLElement).getByText("4")).toBeInTheDocument();
    expect(within(runnerUp as HTMLElement).getByText("40")).toBeInTheDocument();
  });

  it("switches boards without refetching", async () => {
    renderLeaderboard();
    await screen.findByText("College A");

    await userEvent.click(screen.getByRole("button", { name: "Teams" }));

    expect(await screen.findByText("Team Alpha")).toBeInTheDocument();
    // College D only ever appears in the colleges board, so its absence means
    // that board is gone rather than merely reordered.
    expect(screen.queryByText("College D")).not.toBeInTheDocument();
    expect(getWithoutAuth).toHaveBeenCalledTimes(1);
  });

  it("shows individual participants on the users board", async () => {
    renderLeaderboard();
    await screen.findByText("College A");

    await userEvent.click(screen.getByRole("button", { name: "Individuals" }));

    expect(await screen.findByText("Alice Anand")).toBeInTheDocument();
  });

  it("falls back to the identifier when an entry has no name", async () => {
    getWithoutAuth.mockResolvedValue({
      data: { ...OVERVIEW, users: [entry({ id: "U404", name: null })] },
    });
    renderLeaderboard();
    await screen.findByText("College A");

    await userEvent.click(screen.getByRole("button", { name: "Individuals" }));

    expect(await screen.findByText("U404")).toBeInTheDocument();
  });

  it("tells the user when no scores exist yet", async () => {
    getWithoutAuth.mockResolvedValue({
      data: { users: [], teams: [], colleges: [], generatedAt: "" },
    });
    renderLeaderboard();

    expect(await screen.findByText(/no scores have been posted yet/i)).toBeInTheDocument();
  });

  it("surfaces a failure instead of an empty board", async () => {
    getWithoutAuth.mockRejectedValue(new Error("network down"));
    renderLeaderboard();

    await waitFor(() =>
      expect(screen.getByText(/could not load the leaderboard/i)).toBeInTheDocument(),
    );
  });
});
