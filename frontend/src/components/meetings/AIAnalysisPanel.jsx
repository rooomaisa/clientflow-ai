import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, Copy, Sparkles } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'

function formatLabel(value) {
  if (!value) return 'Unknown'
  return value.charAt(0) + value.slice(1).toLowerCase()
}

function sentimentTone(sentiment) {
  const normalized = sentiment?.toUpperCase()
  if (normalized === 'POSITIVE') return 'violet'
  if (normalized === 'NEGATIVE') return 'red'
  return 'amber'
}

function priorityTone(priority) {
  const normalized = priority?.toUpperCase()
  if (normalized === 'HIGH') return 'red'
  if (normalized === 'LOW') return 'slate'
  return 'amber'
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.12, duration: 0.4, ease: 'easeOut' },
  }),
}

function CopyButton({ text, label }) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast(`${label} copied to clipboard`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-1.5">
      {copied ? <Check className="h-3.5 w-3.5 text-violet-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}

export default function AIAnalysisPanel({ analysis }) {
  if (!analysis) {
    return null
  }

  const sections = [
    {
      title: 'Summary',
      content: (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="flex-1 leading-relaxed text-slate-700">{analysis.summary}</p>
          <CopyButton text={analysis.summary} label="Summary" />
        </div>
      ),
    },
    {
      title: 'Key points',
      content: analysis.keyPoints?.length ? (
        <ul className="space-y-2">
          {analysis.keyPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              {point}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No key points returned.</p>
      ),
    },
    {
      title: 'Action items',
      subtitle: 'These were also saved as tasks automatically.',
      content: analysis.actionItems?.length ? (
        <ul className="space-y-2">
          {analysis.actionItems.map((item) => (
            <li key={item} className="flex items-start gap-2 text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No action items returned.</p>
      ),
    },
    {
      title: 'Follow-up email draft',
      content: (
        <div className="space-y-3">
          <div className="flex justify-end">
            <CopyButton text={analysis.followUpEmail} label="Email draft" />
          </div>
          <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700">
            {analysis.followUpEmail}
          </pre>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="font-display text-lg font-semibold text-slate-900">AI analysis</h2>
        </div>
        <Badge tone={sentimentTone(analysis.sentiment)}>{formatLabel(analysis.sentiment)} sentiment</Badge>
        <Badge tone={priorityTone(analysis.priority)}>{analysis.priority} priority</Badge>
      </div>

      {sections.map((section, index) => (
        <motion.section
          key={section.title}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="rounded-xl border border-slate-100 bg-slate-50/50 p-5"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {section.title}
          </h3>
          {section.subtitle && (
            <p className="mt-0.5 text-xs text-slate-400">{section.subtitle}</p>
          )}
          <div className="mt-3">{section.content}</div>
        </motion.section>
      ))}
    </div>
  )
}
