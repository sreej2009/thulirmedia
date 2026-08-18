// Every project currently ships without real client photography/screens —
// this renders a clearly-labelled placeholder instead of a fabricated
// screenshot. Swap `project.heroImage` / `project.gallery[n]` with a real
// asset URL and callers here automatically render an <img>/<video> instead
// (see `MediaFrame` below) — no other code needs to change.

function ConceptBadge({ className = '' }) {
  return (
    <span
      className={`pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-void/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-mist backdrop-blur-sm ${className}`}
    >
      Concept Visual
    </span>
  )
}

function GradientField({ accent }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(120% 100% at 15% 0%, ${accent}33, transparent 60%)` }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(${accent}55 1px, transparent 1px), linear-gradient(90deg, ${accent}55 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute h-40 w-40 rounded-full blur-3xl"
        style={{ background: accent, opacity: 0.35, left: '20%', top: '30%' }}
      />
      <div
        className="absolute h-24 w-24 rotate-12 rounded-2xl border border-white/10"
        style={{ right: '18%', bottom: '24%' }}
      />
    </>
  )
}

function BrowserFrame({ accent, children }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-charcoal/80">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 flex-1 truncate rounded-full bg-void px-3 py-1 text-[10px] text-mist">
          project.thulirmedia.com
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <GradientField accent={accent} />
        {children}
      </div>
    </div>
  )
}

function PhoneFrame({ accent, children }) {
  return (
    <div className="relative mx-auto flex h-full max-w-[280px] flex-col overflow-hidden rounded-[2rem] border border-line bg-charcoal/80 p-2">
      <div className="mb-2 flex shrink-0 items-center justify-center">
        <span className="h-1.5 w-10 rounded-full bg-white/15" />
      </div>
      <div className="relative flex-1 overflow-hidden rounded-[1.4rem]">
        <GradientField accent={accent} />
        {children}
      </div>
    </div>
  )
}

function CardFrame({ accent, children }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-line bg-charcoal/80">
      <GradientField accent={accent} />
      {children}
    </div>
  )
}

const FRAMES = { browser: BrowserFrame, phone: PhoneFrame, card: CardFrame }

export function PlaceholderVisual({ accent = '#a78bfa', frame = 'card', label, badge = true, className = '' }) {
  const Frame = FRAMES[frame] || CardFrame

  return (
    <div className={`relative h-full w-full ${className}`}>
      {badge && <ConceptBadge />}
      <Frame accent={accent}>
        {label && (
          <span className="pointer-events-none absolute bottom-3 left-3 max-w-[70%] text-xs text-mist/70">
            {label}
          </span>
        )}
      </Frame>
    </div>
  )
}

// Renders a real image/video when the project provides one, otherwise falls
// back to the honest placeholder above — this is the "insert real assets
// later" seam the content system is built around.
export function MediaFrame({ src, video, alt, accent, frame = 'card', className = '' }) {
  if (video) {
    return (
      <div className={`relative h-full w-full overflow-hidden rounded-xl border border-line ${className}`}>
        <video
          src={video}
          poster={src}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  if (src) {
    return (
      <div className={`relative h-full w-full overflow-hidden rounded-xl border border-line ${className}`}>
        <img src={src} alt={alt || ''} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
    )
  }

  return <PlaceholderVisual accent={accent} frame={frame} label={alt} className={className} />
}
