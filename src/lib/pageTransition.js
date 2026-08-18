import { gsap } from './gsap'

// A lightweight, dependency-free "iris wipe" page transition. One overlay
// element is mounted once globally (see TransitionOverlay) and registered
// here; any component can call `coverTransition()` before navigating and
// `revealTransition()` once the destination has mounted. Mirrors the
// existing `window.__lenis` global-handle pattern already used in this repo
// rather than introducing a new state-management dependency.

let overlayEl = null
let wordmarkEl = null

export function registerTransitionOverlay(el) {
  overlayEl = el
}

export function registerTransitionWordmark(el) {
  wordmarkEl = el
}

export function setTransitionOrigin(x, y) {
  document.documentElement.style.setProperty('--transition-ox', `${x}px`)
  document.documentElement.style.setProperty('--transition-oy', `${y}px`)
}

export function coverTransition(color = '#0a0a0c') {
  return new Promise((resolve) => {
    if (!overlayEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resolve()
      return
    }
    gsap.set(overlayEl, {
      display: 'flex',
      opacity: 1,
      backdropFilter: 'blur(0px)',
      backgroundColor: color,
      clipPath: 'circle(0% at var(--transition-ox, 50%) var(--transition-oy, 50%))',
    })
    if (wordmarkEl) gsap.set(wordmarkEl, { opacity: 0, y: 10 })

    const tl = gsap.timeline({ onComplete: resolve })
    tl.to(overlayEl, {
      clipPath: 'circle(150% at var(--transition-ox, 50%) var(--transition-oy, 50%))',
      backdropFilter: 'blur(14px)',
      duration: 0.65,
      ease: 'power3.inOut',
    })
    if (wordmarkEl) {
      tl.to(wordmarkEl, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.3')
    }
  })
}

export function revealTransition() {
  if (!overlayEl) return
  if (wordmarkEl) {
    gsap.to(wordmarkEl, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in' })
  }
  gsap.to(overlayEl, {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    duration: 0.55,
    delay: 0.1,
    ease: 'power2.out',
    onComplete: () => gsap.set(overlayEl, { display: 'none', opacity: 1, backdropFilter: 'blur(0px)' }),
  })
}
