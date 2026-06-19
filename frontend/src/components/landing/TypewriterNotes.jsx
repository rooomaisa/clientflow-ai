import { useEffect, useState } from 'react'

const LINES = [
  'Client wants revised timeline — agreed to 2-week extension.',
  'Needs updated proposal by Thursday.',
  'Budget cap at €4,500 confirmed.',
]

const CHAR_DELAY_MS = 28
const LINE_PAUSE_MS = 400

export default function TypewriterNotes({ onComplete }) {
  const [finishedLines, setFinishedLines] = useState([])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)

  const activeLine = LINES[lineIndex] ?? ''
  const typingLine = activeLine.slice(0, charIndex)

  useEffect(() => {
    if (isDone) return undefined

    if (charIndex < activeLine.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), CHAR_DELAY_MS)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      setFinishedLines((prev) => [...prev, activeLine])

      if (lineIndex >= LINES.length - 1) {
        setIsDone(true)
        return
      }

      setLineIndex((i) => i + 1)
      setCharIndex(0)
    }, LINE_PAUSE_MS)

    return () => clearTimeout(timeout)
  }, [activeLine, charIndex, isDone, lineIndex])

  useEffect(() => {
    if (isDone) {
      onComplete?.()
    }
  }, [isDone, onComplete])

  return (
    <div className="min-h-[5.5rem] space-y-2 text-left font-mono text-xs leading-relaxed text-slate-600">
      {finishedLines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      {!isDone && (
        <p>
          {typingLine}
          <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-violet-500/80 align-middle" />
        </p>
      )}
    </div>
  )
}
