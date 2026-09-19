/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, FC } from "react";
import { eventAccent, eventLogo, eventTilt } from "@/lib/eventArt";

interface EventCardProps {
  data: any;
  index?: number;
  /** Set when the viewer has no team that fits this event's size. */
  teamNotice?: string | null;
}

/**
 * Poster-card for the events board (§10.3): card stock, ink border, one
 * spectrum-coloured hard shadow, a small tilt that straightens on hover/focus.
 * The parent supplies the link, so nothing inside is interactive.
 */
export const EventCard: FC<EventCardProps> = ({ data, index = 0, teamNotice }) => {
  const logo = eventLogo(data);
  const style = {
    "--tilt": `${eventTilt(index)}deg`,
    "--accent": eventAccent(index),
  } as CSSProperties;

  return (
    <article
      style={style}
      className="flex h-full rotate-[var(--tilt)] flex-col border-2 border-ink bg-card p-5 text-ink shadow-[6px_6px_0_var(--accent)] transition-[transform,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:rotate-0 group-hover:shadow-[8px_8px_0_var(--accent)] group-focus-visible:-translate-y-1 group-focus-visible:rotate-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center border-2 border-ink bg-wcard p-1.5">
          {logo ? (
            <img
              src={logo}
              alt=""
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <span
              aria-hidden="true"
              className="font-display text-3xl uppercase leading-none"
            >
              {data?.title?.charAt(0) ?? "✦"}
            </span>
          )}
        </div>
        <span className="rotate-[1deg] border-2 border-ink bg-wcard px-2 py-1 font-mono text-xs font-bold uppercase shadow-brut-sm">
          {data?.startTime?.slice(0, 10)}
        </span>
      </div>

      <h2 className="mt-5 font-display text-[clamp(30px,4vw,40px)] uppercase leading-[0.9]">
        {data?.title}
      </h2>
      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-2">
        {data?.description}
      </p>

      {teamNotice && (
        <p className="mt-4 border-2 border-ink border-l-[6px] border-l-acc-2 bg-wcard px-3 py-2 text-sm text-ink">
          <span className="eyebrow mr-1.5">Team needed ·</span>
          {teamNotice} Join or create a team to participate.
        </p>
      )}

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between border-t-2 border-dashed border-line pt-4">
          <span className="eyebrow text-ink-2">Event brief</span>
          <span className="font-bold underline decoration-acc decoration-[3px] underline-offset-4">
            See details ▸
          </span>
        </div>
      </div>
    </article>
  );
};
