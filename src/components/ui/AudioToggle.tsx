import { useEffect, useRef, useState } from 'react'

type Engine = { ctx: AudioContext; master: GainNode }

const LEVEL = 0.06

/**
 * Low engine idle and road rumble, synthesised with Web Audio so no asset is needed.
 * Built on the first click only, which also satisfies browser autoplay rules.
 */
function createAmbience(): Engine | null {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  const ctx = new Ctx()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // Engine: two detuned saws under a low-pass, slowly breathing
  const engineFilter = ctx.createBiquadFilter()
  engineFilter.type = 'lowpass'
  engineFilter.frequency.value = 140
  engineFilter.Q.value = 1.2
  engineFilter.connect(master)
  for (const f of [38, 38.7]) {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = f
    osc.connect(engineFilter)
    osc.start()
  }
  const lfo = ctx.createOscillator()
  const lfoDepth = ctx.createGain()
  lfo.frequency.value = 0.12
  lfoDepth.gain.value = 45
  lfo.connect(lfoDepth).connect(engineFilter.frequency)
  lfo.start()

  // Road: looped brown noise, darkened
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last * 3.5
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  noise.loop = true
  const road = ctx.createBiquadFilter()
  road.type = 'lowpass'
  road.frequency.value = 420
  const roadGain = ctx.createGain()
  roadGain.gain.value = 0.5
  noise.connect(road).connect(roadGain).connect(master)
  noise.start()

  return { ctx, master }
}

/** Ambient sound toggle. Always off on load; never starts without a click. */
export function AudioToggle({ className = '' }: { className?: string }) {
  const [on, setOn] = useState(false)
  const [supported] = useState(() => typeof window !== 'undefined' && !!(window.AudioContext ?? (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext))
  const engine = useRef<Engine | null>(null)
  const onRef = useRef(false)

  const fade = (next: boolean) => {
    const e = engine.current
    if (!e) return
    const t = e.ctx.currentTime
    e.master.gain.cancelScheduledValues(t)
    e.master.gain.setTargetAtTime(next ? LEVEL : 0, t, next ? 0.8 : 0.3)
    // Release the audio thread once faded out
    if (!next) window.setTimeout(() => !onRef.current && e.ctx.suspend(), 1500)
  }

  const toggle = async () => {
    const next = !on
    onRef.current = next
    setOn(next)
    if (next && !engine.current) engine.current = createAmbience()
    if (next) await engine.current?.ctx.resume().catch(() => undefined)
    fade(next)
  }

  // Quiet while the tab is hidden; tear down on unmount
  useEffect(() => {
    const onVisibility = () => {
      const e = engine.current
      if (!e || !onRef.current) return
      if (document.hidden) e.ctx.suspend()
      else e.ctx.resume()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      engine.current?.ctx.close()
      engine.current = null
    }
  }, [])

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'}
      title={on ? 'Mute ambient sound' : 'Play ambient sound'}
      className={`flex h-10 min-w-10 items-center justify-center gap-2.5 px-2 text-[0.6875rem] font-medium tracking-[0.22em] uppercase transition-colors duration-300 ${
        on ? 'text-chrome' : 'text-steel hover:text-chrome'
      } ${className}`}
    >
      {/* Four hairline bars: flat when off, a slow equaliser when on */}
      <span className="flex h-3 items-end gap-[3px]" aria-hidden>
        {[0.55, 1, 0.7, 0.85].map((h, i) => (
          <span
            key={i}
            className={`w-px origin-bottom bg-current transition-transform duration-500 ease-luxe ${on ? 'animate-eq' : 'scale-y-[0.4]'}`}
            style={{ height: `${h * 100}%`, animationDelay: `${i * -0.35}s` }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">Sound</span>
    </button>
  )
}
