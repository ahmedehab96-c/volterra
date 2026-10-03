import type { DetailedHTMLProps, HTMLAttributes } from 'react'

// <model-viewer> custom element (registered on demand by Vehicle3D)
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>
    }
  }
}
