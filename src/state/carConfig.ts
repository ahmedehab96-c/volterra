import { useSyncExternalStore } from 'react'
import { carColors, interiorOptions, models, wheelOptions, type CarColor, type ConfigOption, type Model } from '../data/content'

/** Tiny shared store so every configurator view stays in sync without a state library. */
export type CarConfig = { model: Model; color: CarColor; wheels: ConfigOption; interior: ConfigOption }

const KEY = 'volterra-config'
const defaults = { color: carColors[0], wheels: wheelOptions[0], interior: interiorOptions[0] }

// Restore the last build; any unknown or unreadable value falls back to the default
function load(): CarConfig {
  const base = { model: models.find((m) => m.id === 'gt') ?? models[0], ...defaults }
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, string>
    return {
      model: models.find((m) => m.id === saved.model) ?? base.model,
      color: carColors.find((c) => c.id === saved.color) ?? base.color,
      wheels: wheelOptions.find((o) => o.id === saved.wheels) ?? base.wheels,
      interior: interiorOptions.find((o) => o.id === saved.interior) ?? base.interior,
    }
  } catch {
    return base
  }
}

// Each car offers its own paints; an unavailable choice falls back to the car's first paint
const colorFor = (model: Model, color: CarColor) => (model.colors.includes(color.id) ? color : (carColors.find((c) => c.id === model.colors[0]) ?? carColors[0]))

// A saved paint the restored model cannot wear falls back to its signature paint
const restored = load()
let state: CarConfig = { ...restored, color: colorFor(restored.model, restored.color) }
const listeners = new Set<() => void>()

const update = (patch: Partial<CarConfig>) => {
  state = { ...state, ...patch }
  try {
    const { model, color, wheels, interior } = state
    localStorage.setItem(KEY, JSON.stringify({ model: model.id, color: color.id, wheels: wheels.id, interior: interior.id }))
  } catch {
    // Storage unavailable (private mode): the build still works for this visit
  }
  listeners.forEach((l) => l())
}


export const setModel = (id: string) => {
  const model = models.find((m) => m.id === id)
  if (model && model !== state.model) update({ model, color: colorFor(model, state.color) })
}
export const setCarColor = (id: CarColor['id']) => update({ color: colorFor(state.model, carColors.find((c) => c.id === id)!) })
export const setWheels = (option: ConfigOption) => update({ wheels: option })
export const setInterior = (option: ConfigOption) => update({ interior: option })
/** Back to standard options; the chosen model is kept */
export const resetCarConfig = () => update(defaults)

/** Mock estimate: model base price plus each option */
export const configTotal = ({ model, color, wheels, interior }: CarConfig) => model.price + color.price + wheels.price + interior.price

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCarConfig(): CarConfig {
  return useSyncExternalStore(subscribe, () => state)
}
