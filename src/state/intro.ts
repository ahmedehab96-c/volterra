import { useSyncExternalStore } from 'react'

// Lets the hero start its entrance as the preloader lifts, instead of animating unseen behind it
let introDone = false
const introListeners = new Set<() => void>()
export const finishIntro = () => {
  introDone = true
  introListeners.forEach((l) => l())
}
const subscribeIntro = (l: () => void) => {
  introListeners.add(l)
  return () => introListeners.delete(l)
}
export const useIntroDone = () => useSyncExternalStore(subscribeIntro, () => introDone)
