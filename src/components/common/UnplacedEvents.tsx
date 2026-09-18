/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

import { ApiPaths } from "@/constants/enum";
import useAxios from "@/hooks/useAxios";

/**
 * Events the person opted into but still has no team for - the "enrolled"
 * category the migration imports.
 *
 * The import gives each of them a team of one (flagged ENROLLED) for each
 * such event. They are not registered until a team meets the event's minimum,
 * so this names that team and spells out the two choices: invite members into
 * it, or join another team. Renders nothing when they owe no team.
 */
const UnplacedEvents = () => {
  const { getWithAuth } = useAxios();

  const { data: events } = useQuery({
    queryKey: ["me", "enrolled"],
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.MY_ENROLLED);
      return response?.data ?? [];
    },
  });

  if (!events || events.length === 0) return null;

  return (
    <div className="mx-6 lg:mx-12 mb-6 rounded-md border border-[#80466E]/50 bg-[#1b1b1b] p-4">
      <h2 className="text-lg font-semibold text-[#EFAD8B] mb-1">
        You still need a team
      </h2>
      <p className="text-sm text-gray-400 mb-3">
        You signed up for these events, but they are played in teams and your
        team is not big enough yet. You are not registered for them until it is.
      </p>

      <ul className="flex flex-col gap-3 mb-4">
        {events.map((event: any) => (
          <li key={event.eventId} className="text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-200">
                {event.title ?? event.eventId}
              </span>
              <span className="text-xs text-gray-500">
                needs {event.teamMinSize}
                {event.teamMaxSize !== event.teamMinSize
                  ? `-${event.teamMaxSize}`
                  : ""}{" "}
                members
              </span>
            </div>
            {event.teamName && (
              <div className="mt-1 text-xs text-gray-400">
                Your team for it:{" "}
                <span className="text-[#EFAD8B]">{event.teamName}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-400">
        You have two choices for each one:{" "}
        <span className="text-gray-200">invite members</span> into your team
        below until it is big enough, or{" "}
        <span className="text-gray-200">join another team</span> by accepting an
        invitation from the Invitations page. Once a team is the right size, its
        owner registers it for the event.
      </p>
    </div>
  );
};

export default UnplacedEvents;
