/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiPaths } from "@/constants/enum";
import { useToast } from "@/hooks/use-toast";
import useAxios from "@/hooks/useAxios";
import { useAuthStore } from "@/store/ApiStates";

/**
 * The third branch, beside "lead a team" and "join a team": register on a team
 * event with no team yet, and be picked up by somebody who is forming one.
 *
 * Shown only when the organizer opened the waiting room on this event
 * (`allowsEnrolled`). The copy is deliberately blunt about what it is not -
 * waiting takes no place in the event and scores nothing - so nobody walks
 * away thinking they have entered.
 */
const WaitingRoom = ({ event }: { event: any }) => {
  const { getWithAuth, postWithAuth, putWithAuth, deleteWithAuth } = useAxios();
  const { getOwnedTeams, getIsProfileCompleted } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const eventId = event?.id;
  const [inviting, setInviting] = useState<string | null>(null);

  const mineKey = ["enrolled", eventId, "mine"];
  const poolKey = ["enrolled", eventId, "pool"];

  const { data: mine } = useQuery({
    queryKey: mineKey,
    enabled: !!eventId,
    queryFn: async () => {
      const response: any = await getWithAuth(
        `${ApiPaths.MY_ENROLLED}/${eventId}${ApiPaths.ENROLLED}`,
      );
      return response?.data ?? null;
    },
  });

  const { data: pool } = useQuery({
    queryKey: poolKey,
    enabled: !!eventId,
    queryFn: async () => {
      const response: any = await getWithAuth(
        `${ApiPaths.EVENT}/${eventId}${ApiPaths.ENROLLED}`,
      );
      return response?.data ?? null;
    },
  });

  const isWaiting = !!mine && !mine.convertedAt && !mine.withdrawnAt;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: mineKey });
    queryClient.invalidateQueries({ queryKey: poolKey });
  };

  const fail = (error: any, fallback: string) =>
    toast({
      title: "That didn't work",
      description: error?.response?.data?.message ?? fallback,
    });

  const joinMutation = useMutation({
    mutationFn: async () =>
      postWithAuth(`${ApiPaths.MY_ENROLLED}/${eventId}${ApiPaths.ENROLLED}`),
    onSuccess: () => {
      refresh();
      toast({
        title: "You're on the waiting list",
        description:
          "This does not register you for the event. You are in once a team picks you up.",
      });
    },
    onError: (error) => fail(error, "Could not join the waiting list."),
  });

  const listingMutation = useMutation({
    mutationFn: async (listed: boolean) =>
      putWithAuth(
        `${ApiPaths.MY_ENROLLED}/${eventId}${ApiPaths.ENROLLED_LISTING}`,
        { listed },
      ),
    onSuccess: () => {
      refresh();
    },
    onError: (error) => fail(error, "Could not change your listing."),
  });

  const withdrawMutation = useMutation({
    mutationFn: async () =>
      deleteWithAuth(`${ApiPaths.MY_ENROLLED}/${eventId}${ApiPaths.ENROLLED}`),
    onSuccess: () => {
      refresh();
      toast({ title: "Removed from the waiting list" });
    },
    onError: (error) => fail(error, "Could not leave the waiting list."),
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ userId, teamId }: { userId: string; teamId: string }) =>
      postWithAuth(
        `${ApiPaths.EVENT}/${eventId}${ApiPaths.ENROLLED}/${userId}${ApiPaths.ENROLLED_INVITE}`,
        { teamId },
      ),
    onSuccess: () => {
      refresh();
      toast({ title: "Invitation sent" });
    },
    onError: (error) => fail(error, "Could not send that invitation."),
    onSettled: () => setInviting(null),
  });

  if (!event?.allowsEnrolled) return null;

  const ownedTeams = getOwnedTeams() || [];
  // Only a team that has not registered anywhere can still take members.
  const invitableTeam = ownedTeams.find((team: any) => !team?.lock) as
    | { id: string; name: string }
    | undefined;
  const entries = pool?.entries ?? [];

  return (
    <div className="mt-6 rounded-md border border-[#80466E]/40 bg-[#1b1b1b] p-4">
      <h2 className="text-lg font-semibold text-[#80466E] mb-1">
        No team yet?
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Put your name down and someone forming a team can pick you up.{" "}
        <span className="text-gray-300">
          This does not take a place in the event and scores nothing
        </span>{" "}
        — you are only in once a team registers with you in it.
      </p>

      {!isWaiting && (
        <Button
          className="bg-[#80466E] text-white px-6 py-2.5 rounded-sm"
          disabled={joinMutation.isPending}
          onClick={() => {
            if (!getIsProfileCompleted()) {
              toast({
                title: "Complete your profile",
                description:
                  "Please complete your profile before joining the waiting list.",
              });
              return;
            }
            joinMutation.mutate();
          }}
        >
          {joinMutation.isPending ? "Adding you…" : "Join the waiting list"}
        </Button>
      )}

      {isWaiting && (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-gray-300">
            You are on the waiting list for this event.
          </div>

          {/* Being visible to other participants is a separate, reversible
              choice - joining the list is not consent to being listed. */}
          <label className="flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              className="mt-1"
              checked={!!mine?.listed}
              disabled={listingMutation.isPending}
              onChange={(e) => listingMutation.mutate(e.target.checked)}
            />
            <span>
              Show my name to other participants looking for members.
              <span className="block text-xs text-gray-500">
                Off by default. Only your name is shown — never your email or
                phone number. The organizers can always see you.
              </span>
            </span>
          </label>

          <div>
            <button
              type="button"
              className="text-xs text-[#C02727] underline"
              disabled={withdrawMutation.isPending}
              onClick={() => withdrawMutation.mutate()}
            >
              Leave the waiting list
            </button>
          </div>
        </div>
      )}

      {/* The pool. Participants see only the people who opted in; organizers
          see everybody still unplaced. */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Looking for a team ({entries.length})
          {pool?.includesUnlisted && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              including people who have not listed themselves
            </span>
          )}
        </h3>

        {entries.length === 0 ? (
          <p className="text-xs text-gray-500">
            Nobody is listed yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-2">
            {entries.map((entry: any) => (
              <li
                key={entry.userId}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-gray-200">
                  {entry.name ?? "Unnamed participant"}
                  {pool?.includesUnlisted && !entry.listed && (
                    <span className="ml-2 text-xs text-gray-500">
                      (not listed)
                    </span>
                  )}
                </span>

                {invitableTeam && entry.userId !== mine?.userId && (
                  <Button
                    className="bg-[#512F5C] text-white text-xs px-3 py-1 rounded-sm"
                    disabled={inviting === entry.userId}
                    onClick={() => {
                      setInviting(entry.userId);
                      inviteMutation.mutate({
                        userId: entry.userId,
                        teamId: invitableTeam.id,
                      });
                    }}
                  >
                    {inviting === entry.userId
                      ? "Inviting…"
                      : `Invite to ${invitableTeam.name}`}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
