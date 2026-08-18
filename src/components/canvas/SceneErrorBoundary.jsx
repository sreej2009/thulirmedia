import { Component } from 'react'

// Wraps a single 3D scene. If it throws during render, this swallows the
// error and renders nothing (or a caller-supplied fallback) instead of
// taking down the rest of the page — the surrounding headline, copy and
// buttons stay fully visible and usable even when a Canvas crashes.
export default class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Thulir Media — 3D scene failed to render:', error, info)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
