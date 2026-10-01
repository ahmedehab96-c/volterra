import { Reveal } from './Reveal'
import { StaggerText } from './StaggerText'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  intro?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, intro, align = 'left', className = '' }: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <Reveal className={`mb-6 flex items-center gap-4 ${centered ? 'justify-center' : ''}`}>
        <span className="h-px w-10 bg-accent" aria-hidden />
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <StaggerText
        text={title}
        className="font-wide text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.02em] text-chrome uppercase"
      />
      {intro && (
        <Reveal delay={0.2}>
          <p className={`mt-6 max-w-xl text-base leading-relaxed text-steel md:text-lg ${centered ? 'mx-auto' : ''}`}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  )
}
