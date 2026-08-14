import { gsap, SplitText } from './gsap'

// Masked line-by-line reveal, e.g. section headlines swooping up into place.
export function revealLines(el, {
  start = 'top 82%',
  stagger = 0.09,
  duration = 1.1,
  delay = 0,
  ease = 'expo.out',
  once = true,
} = {}) {
  if (!el) return null

  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'reveal-line',
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110,
        opacity: 0,
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          once,
        },
      })
    },
  })
}

// Word-by-word brightness wipe, scrubbed to scroll — the "reading reveal" effect.
export function revealWords(el, {
  start = 'top 85%',
  end = 'top 40%',
  scrub = 0.6,
} = {}) {
  if (!el) return null

  return SplitText.create(el, {
    type: 'words',
    onSplit(self) {
      return gsap.fromTo(
        self.words,
        { opacity: 0.22 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub,
          },
        }
      )
    },
  })
}
