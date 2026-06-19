import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const STEPS = [
  'Reading meeting notes…',
  'Analyzing conversation…',
  'Extracting key points…',
  'Drafting follow-up email…',
  'Creating action items…',
]

export default function AIProcessingLoader() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((current) => (current + 1) % STEPS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card overflow-hidden border-violet-200/60 p-8 shadow-glow">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse-glow rounded-full bg-violet-400/20 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-glow">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
        </div>
        <h3 className="font-display text-lg font-semibold text-slate-900">Processing with AI</h3>
        <p className="mt-2 text-sm text-slate-500 transition-opacity duration-300">{STEPS[stepIndex]}</p>
        <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-accent-gradient transition-all duration-500"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
