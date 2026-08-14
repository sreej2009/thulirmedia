// Eight small, self-contained decorative visuals — one per service — built
// from CSS/SVG only. Kept deliberately light (no WebGL) so the service
// sections stay cheap; the page's 3D budget goes to the Hero and Ecosystem.

export function TerminalVisual({ accent }) {
  const lines = [
    { cmd: '$ campaign.analyze()', out: '→ 1,204 keywords scanned' },
    { cmd: '$ bid.optimize()', out: '→ CPC  -18.4%' },
    { cmd: '$ track.conversions()', out: '→ 312 tracked events' },
    { cmd: '$ report.generate()', out: '→ ROAS  5.4x' },
  ]
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-charcoal/80 font-mono text-xs">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 text-[10px] uppercase tracking-widest text-mist">google-ads.sh</span>
      </div>
      <div className="flex flex-col gap-2.5 p-5">
        {lines.map((l) => (
          <div key={l.cmd}>
            <p className="text-ink">{l.cmd}</p>
            <p style={{ color: accent }}>{l.out}</p>
          </div>
        ))}
        <span className="mt-1 h-3.5 w-2 animate-pulse" style={{ background: accent }} />
      </div>
    </div>
  )
}

export function StoriesVisual({ accent }) {
  return (
    <div className="mx-auto flex w-full max-w-[220px] flex-col gap-3 rounded-[2rem] border border-line bg-charcoal/80 p-3">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-white/15">
            <div
              className="h-full rounded-full"
              style={{ width: i === 0 ? '100%' : '0%', background: accent }}
            />
          </div>
        ))}
      </div>
      <div
        className="flex h-72 flex-col justify-end overflow-hidden rounded-2xl p-4"
        style={{ background: `linear-gradient(160deg, ${accent}55, #0a0a0c 85%)` }}
      >
        <div className="h-8 w-8 rounded-full border-2 border-white/40" />
        <div className="mt-4 h-2.5 w-3/4 rounded-full bg-white/25" />
        <div className="mt-2 h-2.5 w-1/2 rounded-full bg-white/15" />
        <div className="mt-5 flex items-center justify-between">
          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-void">Shop Now</span>
          <span className="text-white/70">♡ 2.4k</span>
        </div>
      </div>
    </div>
  )
}

export function CalendarVisual({ accent }) {
  const filled = [1, 3, 4, 8, 10, 11, 14, 17, 18, 21, 24, 27]
  return (
    <div className="w-full rounded-xl border border-line bg-charcoal/80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-mist">Content Calendar</span>
        <span className="font-mono text-xs text-mist">Week 1–4</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md border border-line"
            style={filled.includes(i) ? { background: `${accent}66`, borderColor: accent } : undefined}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-mist">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: accent }} />
        Scheduled posts
      </div>
    </div>
  )
}

export function EditorialVisual({ accent }) {
  return (
    <div className="w-full rounded-xl border border-line bg-charcoal/80 p-8">
      <span className="font-display text-6xl leading-none" style={{ color: accent }}>
        &ldquo;
      </span>
      <div className="-mt-4 flex flex-col gap-2.5">
        <div className="h-2.5 w-full rounded-full bg-white/15" />
        <div className="h-2.5 w-11/12 rounded-full bg-white/15" />
        <div className="h-2.5 w-4/5 rounded-full bg-white/15" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full" style={{ background: accent }} />
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-20 rounded-full bg-white/25" />
          <div className="h-1.5 w-14 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  )
}

export function RankingVisual({ accent }) {
  const points = [8, 14, 11, 20, 18, 27, 24, 34, 30, 42]
  const max = Math.max(...points)
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${40 - (p / max) * 36}`)
    .join(' ')

  return (
    <div className="w-full rounded-xl border border-line bg-charcoal/80 p-5">
      <div className="mb-3 flex items-center justify-between text-xs text-mist">
        <span className="uppercase tracking-[0.2em]">Ranking Trend</span>
        <span className="font-mono" style={{ color: accent }}>+240%</span>
      </div>
      <svg viewBox="0 0 100 40" className="w-full" preserveAspectRatio="none">
        <polyline points={path} fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="mt-4 flex flex-wrap gap-2">
        {['#seo', '#local-seo', '#technical', '#backlinks'].map((tag) => (
          <span key={tag} className="rounded-full border border-line px-2.5 py-1 text-[10px] text-mist">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export function BrowserVisual({ accent }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-charcoal/80">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 flex-1 truncate rounded-full bg-void px-3 py-1 text-[10px] text-mist">
          yourbusiness.com
        </span>
      </div>
      <div className="p-4">
        <div className="h-16 w-full rounded-lg" style={{ background: `linear-gradient(135deg, ${accent}44, transparent)` }} />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-md border border-line" />
          ))}
        </div>
        <div className="mt-3 h-2 w-2/3 rounded-full bg-white/15" />
        <div className="mt-2 h-2 w-1/3 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

export function DeviceVisual({ accent }) {
  return (
    <div className="mx-auto flex w-full max-w-[200px] flex-col gap-2 rounded-[1.75rem] border border-line bg-charcoal/80 p-3">
      <div className="flex items-center justify-between px-1">
        <div className="h-1.5 w-8 rounded-full bg-white/20" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-void p-3">
        <div className="h-20 w-full rounded-xl" style={{ background: `linear-gradient(160deg, ${accent}55, transparent)` }} />
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-line p-2">
            <div className="h-6 w-6 shrink-0 rounded-md" style={{ background: accent }} />
            <div className="flex-1">
              <div className="h-1.5 w-3/4 rounded-full bg-white/25" />
              <div className="mt-1 h-1.5 w-1/2 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-around rounded-full border border-line py-2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ background: i === 0 ? accent : 'rgba(255,255,255,0.15)' }}
          />
        ))}
      </div>
    </div>
  )
}

export function SwatchesVisual({ accent }) {
  const shades = [accent, '#f5f4f2', '#9a99a3', '#121215']
  return (
    <div className="w-full rounded-xl border border-line bg-charcoal/80 p-5">
      <div className="grid grid-cols-4 gap-2">
        {shades.map((s) => (
          <div key={s} className="aspect-square rounded-lg border border-line" style={{ background: s }} />
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between">
        <span className="font-display text-4xl text-ink">Aa</span>
        <span className="font-mono text-[10px] text-mist">Bricolage / Inter</span>
      </div>
    </div>
  )
}

