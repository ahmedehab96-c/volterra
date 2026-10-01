import { Component, type ReactNode } from 'react'

/** Renders `fallback` instead of crashing the page; the error is only logged for developers. */
export class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('[VOLTERRA] Showing fallback after an error.', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
