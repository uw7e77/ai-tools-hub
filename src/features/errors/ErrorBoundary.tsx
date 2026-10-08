import { Component } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../../components/ui/Button'
import { ErrorState } from '../../components/ui/ErrorState'

interface ErrorBoundaryProps {
  children: ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  private handleRetry = () => {
    this.props.onReset?.()
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="section">
          <div className="container">
            <ErrorState
              title="Something went wrong"
              description="We couldn't load this content right now."
              action={<Button onClick={this.handleRetry}>Try Again</Button>}
            />
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
