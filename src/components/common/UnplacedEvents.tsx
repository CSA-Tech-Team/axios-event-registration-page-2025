/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

import { ApiPaths } from "@/constants/enum";
import useAxios from "@/hooks/useAxios";

/**
 * Events the person opted into but still has no team for - the "enrolled"
 * category the migration imports.
 *
 * They are not registered for those events and cannot be until a team meets
 * the event's minimum, so this says so plainly and points at the Create button
 * and their invitations. Renders nothing when they owe no team.
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
        You signed up for these events, but they are played in teams and you are
        not in one that fits yet. You are not registered for them until you are.
      </p>

      <ul className="flex flex-col gap-2 mb-4">
        {events.map((event: any) => (
          <li
            key={event.eventId}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="text-gray-200">{event.title ?? event.eventId}</span>
            <span className="text-xs text-gray-500">
              needs {event.teamMinSize}
              {event.teamMaxSize !== event.teamMinSize
                ? `-${event.teamMaxSize}`
                : ""}{" "}
              members
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-400">
        Use <span className="text-gray-200">Create</span> above to start a team
        and invite people, or accept an invitation from the Invitations page to
        join one that already exists. Once your team is the right size, come
        back to the event and register.
      </p>
    </div>
  );
};

export default UnplacedEvents;
