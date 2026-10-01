import { Button } from '../components/ui/Button'
import { useTitle } from '../router'

export function NotFound() {
  useTitle('Wrong road — VOLTERRA')
  return (
    <section id="top" className="grid min-h-[80svh] place-items-center bg-ink px-5 pt-24 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 font-wide text-[clamp(2.25rem,7vw,5rem)] leading-none font-bold tracking-[-0.03em] text-chrome uppercase">Wrong road.</h1>
        <p className="mx-auto mt-6 max-w-sm text-steel">The road you’re looking for doesn’t exist.</p>
        <Button href="/" className="mt-10">
          Return home
        </Button>
      </div>
    </section>
  )
}
