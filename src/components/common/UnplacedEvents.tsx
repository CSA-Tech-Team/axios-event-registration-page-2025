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
    <section className="mb-10 border-2 border-ink border-l-[8px] border-l-acc-2 bg-card p-5 text-ink shadow-brut-md">
      <h2 className="mb-1 font-section text-2xl font-extrabold uppercase leading-none tracking-[-0.02em]">
        You still need a team
      </h2>
      <p className="mb-4 mt-2 text-[15px] leading-relaxed text-ink-2">
        You signed up for these events, but they are played in teams and your
        team is not big enough yet. You are not registered for them until it is.
      </p>

      <ul className="mb-4 flex flex-col">
        {events.map((event: any) => (
          <li
            key={event.eventId}
            className="border-b-2 border-dashed border-line py-3 text-sm first:border-t-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-bold">
                {event.title ?? event.eventId}
              </span>
              <span className="border-2 border-ink bg-wcard px-1.5 py-0.5 font-mono text-[11px] font-bold uppercase">
                needs {event.teamMinSize}
                {event.teamMaxSize !== event.teamMinSize
                  ? `-${event.teamMaxSize}`
                  : ""}{" "}
                members
              </span>
            </div>
            {event.teamName && (
              <div className="mt-1 text-xs text-ink-2">
                Your team for it:{" "}
                <span className="font-bold text-ink">{event.teamName}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="text-sm leading-relaxed text-ink-2">
        You have two choices for each one:{" "}
        <span className="font-bold text-ink">invite members</span> into your team
        below until it is big enough, or{" "}
        <span className="font-bold text-ink">join another team</span> by accepting an
        invitation from the Invitations page. Once a team is the right size, its
        owner registers it for the event.
      </p>
    </section>
  );
};

export default UnplacedEvents;
