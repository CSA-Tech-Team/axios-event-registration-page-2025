import Discord from "@/components/common/Discord";

function LandingPage() {
  return (
    <div className="brut-container pb-20 pt-10 md:pt-14">
      <header className="border-b-2 border-ink pb-6">
        <p className="eyebrow text-ink-2">Axios · Community</p>
        <h1 className="display-title registration mt-2">The lounge</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2 md:text-base">
          Official announcements from the Axios team, straight from our Discord.
        </p>
      </header>

      {/* The Discord widget is a dark third-party iframe, so it is framed as
          a terminal window rather than restyled (§10.8). */}
      <section
        aria-label="Axios Discord"
        className="mt-10 border-2 border-ink bg-term shadow-brut-md"
      >
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-2">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-term-fg">
            ▸ discord / axios
          </span>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-paper">
            <span aria-hidden="true" className="h-2.5 w-2.5 animate-brut-blink rounded-full bg-r4" />
            Live
          </span>
        </div>
        <div className="h-[70dvh] min-h-[420px] w-full">
          <Discord />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
