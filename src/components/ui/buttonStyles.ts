/** The one VOLTERRA button style, shared by <Button> links and native <button>s. */
const base =
  'group inline-flex items-center justify-center gap-3 rounded-full font-medium tracking-[0.16em] uppercase transition-[color,background-color,border-color,transform,scale] duration-500 ease-luxe active:scale-[0.98] motion-safe:hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60'

const variants = {
  primary: 'border border-chrome bg-chrome text-ink hover:border-white hover:bg-white',
  ghost: 'border border-white/20 text-chrome hover:border-white/70 hover:bg-white/[0.06] backdrop-blur-sm',
}

const sizes = { md: 'h-12 px-7 text-[0.8125rem]', sm: 'h-11 px-5 text-xs' }

export const buttonStyles = (variant: keyof typeof variants = 'primary', size: keyof typeof sizes = 'md') =>
  `${base} ${sizes[size]} ${variants[variant]}`
