import { Component } from 'react'

// Top-level safety net — React error boundaries only catch render-phase
// errors in class components, so this can't be a hook. Anything that slips
// through a page's own rendering (a bad prop shape, a missing data field,
// an unexpected 3D scene crash) lands here instead of a blank white screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Thulir Media — unhandled render error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
    window.location.assign('/')
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-void px-6 text-center">
        <span className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-accent-soft">
          Thulir Media
        </span>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Something went wrong.</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
          This page hit an unexpected error. Reloading usually fixes it — if it keeps
          happening, email us and we'll take a look.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void"
          >
            Back to Home
          </button>
          <a
            href="mailto:infothulirmedia@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-accent-soft/60"
          >
            Email Us
          </a>
        </div>
      </div>
    )
  }
}
