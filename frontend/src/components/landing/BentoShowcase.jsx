import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Mail, Sparkles, StickyNote } from 'lucide-react'
import TypewriterNotes from './TypewriterNotes'
import TypewriterText from './TypewriterText'

const SUMMARY =
  'Client approved a 2-week timeline extension. Send revised proposal by Thursday within the €4,500 budget cap.'

const ACTION_ITEMS = [
  'Send revised proposal',
  'Update project timeline',
  'Schedule follow-up call',
]

const EMAIL_DRAFT =
  "Hi Sarah, thanks for today's call. As discussed, I've attached the updated proposal reflecting the 2-week extension…"

const PHASE_LABELS = {
  notes: 'Reading meeting notes…',
  summary: 'Generating AI summary…',
  tasks: 'Extracting action items…',
  email: 'Drafting follow-up email…',
  done: 'Notes in → AI out → tasks & email ready',
}

const PHASE_ORDER = ['notes', 'summary', 'tasks', 'email', 'done']

function getPanelState(panelId, phase) {
  const currentIndex = PHASE_ORDER.indexOf(phase)
  const panelIndex = { notes: 0, summary: 1, tasks: 2, email: 3 }[panelId]

  if (phase === panelId) {
    return panelId === 'tasks' || panelId === 'email' ? 'active-orange' : 'active-violet'
  }

  if (panelIndex < currentIndex) {
    return panelId === 'tasks' || panelId === 'email' ? 'done-orange' : 'done-violet'
  }

  return 'idle'
}

const PANEL_STATE_CLASS = {
  'active-violet': 'is-active-violet',
  'active-orange': 'is-active-orange',
  'done-violet': 'is-done-violet',
  'done-orange': 'is-done-orange',
  idle: '',
}

function PanelShell({ panelId, label, icon: Icon, phase, children }) {
  const state = getPanelState(panelId, phase)
  const isActive = state.startsWith('active')

  return (
    <article
      className={`landing-bento-panel flex flex-col p-5 ${PANEL_STATE_CLASS[state]}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition duration-300 ${
            state === 'active-violet' || state === 'done-violet'
              ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-200/80'
              : state === 'active-orange' || state === 'done-orange'
                ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-200/80'
                : 'bg-slate-100 text-slate-400'
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={`text-xs font-semibold uppercase tracking-wider transition duration-300 ${
            isActive
              ? state.includes('orange')
                ? 'text-orange-700'
                : 'text-violet-700'
              : state.startsWith('done')
                ? 'text-slate-600'
                : 'text-slate-400'
          }`}
        >
          {label}
        </span>
        {isActive && (
          <span
            className={`ml-auto h-1.5 w-1.5 animate-pulse rounded-full ${
              state.includes('orange') ? 'bg-orange-500' : 'bg-violet-500'
            }`}
          />
        )}
        {state.startsWith('done') && (
          <Check className="ml-auto h-3.5 w-3.5 text-violet-500" />
        )}
      </div>

      <div className="mt-4 min-h-[5.5rem] flex-1">{children}</div>
    </article>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
}

export default function BentoShowcase() {
  const [phase, setPhase] = useState('notes')
  const [visibleTasks, setVisibleTasks] = useState(0)
  const [gridReady, setGridReady] = useState(false)
  const [emailStarted, setEmailStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setGridReady(true), 300)
    return () => clearTimeout(timeout)
  }, [])

  const handleNotesComplete = useCallback(() => {
    setTimeout(() => setPhase('summary'), 500)
  }, [])

  const handleEmailComplete = useCallback(() => {
    setPhase('done')
  }, [])

  useEffect(() => {
    if (phase === 'summary') {
      const timeout = setTimeout(() => setPhase('tasks'), 1800)
      return () => clearTimeout(timeout)
    }

    if (phase === 'tasks') {
      if (visibleTasks < ACTION_ITEMS.length) {
        const timeout = setTimeout(() => setVisibleTasks((c) => c + 1), 450)
        return () => clearTimeout(timeout)
      }

      const timeout = setTimeout(() => {
        setPhase('email')
        setEmailStarted(true)
      }, 600)
      return () => clearTimeout(timeout)
    }

    return undefined
  }, [phase, visibleTasks])

  if (!gridReady) {
    return <div className="mx-auto mt-20 h-[340px] max-w-4xl animate-pulse rounded-2xl bg-slate-100" />
  }

  return (
    <div className="relative mx-auto mt-20 max-w-4xl animate-fade-in-up animation-delay-400 opacity-0">
      <div
        className="pointer-events-none absolute -inset-8 rounded-3xl bg-gradient-to-br from-violet-200/20 via-transparent to-orange-200/15 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative grid gap-4 md:grid-cols-2">
        <PanelShell panelId="notes" label="Meeting notes" icon={StickyNote} phase={phase}>
          <TypewriterNotes onComplete={handleNotesComplete} />
        </PanelShell>

        <PanelShell panelId="summary" label="AI summary" icon={Sparkles} phase={phase}>
          <AnimatePresence mode="wait">
            {PHASE_ORDER.indexOf(phase) >= 1 && (
              <motion.p
                key="summary"
                {...fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-sm leading-relaxed text-slate-700"
              >
                {SUMMARY}
              </motion.p>
            )}
          </AnimatePresence>
        </PanelShell>

        <PanelShell panelId="tasks" label="Action items" icon={Check} phase={phase}>
          <ul className="space-y-2">
            {ACTION_ITEMS.map((item, index) => (
              <AnimatePresence key={item}>
                {visibleTasks > index && (
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-100 ring-1 ring-orange-200/60">
                      <Check className="h-2.5 w-2.5 text-orange-600" />
                    </span>
                    {item}
                  </motion.li>
                )}
              </AnimatePresence>
            ))}
          </ul>
        </PanelShell>

        <PanelShell panelId="email" label="Follow-up draft" icon={Mail} phase={phase}>
          <TypewriterText
            text={EMAIL_DRAFT}
            active={emailStarted}
            charDelayMs={20}
            onComplete={handleEmailComplete}
            className="text-sm leading-relaxed text-slate-600"
          />
        </PanelShell>
      </div>

      <motion.p
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`mt-6 text-center text-xs font-medium ${
          phase === 'done' ? 'text-violet-600' : 'text-slate-500'
        }`}
      >
        {PHASE_LABELS[phase]}
      </motion.p>
    </div>
  )
}
