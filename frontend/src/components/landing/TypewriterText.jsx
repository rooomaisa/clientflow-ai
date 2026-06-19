import { useEffect, useState } from 'react'

export default function TypewriterText({
  text,
  active,
  charDelayMs = 22,
  onComplete,
  className = '',
}) {
  const [charIndex, setCharIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (!active) {
      setCharIndex(0)
      setIsDone(false)
      return
    }

    setCharIndex(0)
    setIsDone(false)
  }, [active, text])

  useEffect(() => {
    if (!active || isDone) return undefined

    if (charIndex < text.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), charDelayMs)
      return () => clearTimeout(timeout)
    }

    setIsDone(true)
    onComplete?.()
    return undefined
  }, [active, charIndex, charDelayMs, isDone, onComplete, text])

  if (!active) return null

  return (
    <p className={className}>
      {text.slice(0, charIndex)}
      {!isDone && (
        <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-violet-500/80 align-middle" />
      )}
    </p>
  )
}
