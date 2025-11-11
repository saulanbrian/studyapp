import { useCallback, useEffect, useRef } from "react";

export default function useEffectAfterMount(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    return effect()

  }, deps)
}
