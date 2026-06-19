import { ArrowRight, ClipboardList, Mail, Sparkles, StickyNote } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const WORKFLOW = [
  {
    icon: StickyNote,
    title: 'Paste notes',
    description: 'Log the client call while it is still fresh.',
    tone: 'violet',
  },
  {
    icon: Sparkles,
    title: 'Run AI',
    description: 'Get a summary, tasks, and a draft email in seconds.',
    tone: 'orange',
  },
  {
    icon: ClipboardList,
    title: 'Review & adjust',
    description: 'Tweak the output, then approve what goes out.',
    tone: 'violet',
  },
  {
    icon: Mail,
    title: 'Send & track',
    description: 'Follow up with confidence — tasks stay on your radar.',
    tone: 'orange',
  },
]

const toneStyles = {
  violet: { icon: 'landing-icon-purple' },
  orange: { icon: 'landing-icon-orange' },
}

function WorkflowStep({ step, index }) {
  const Icon = step.icon
  const style = toneStyles[step.tone]

  return (
    <ScrollReveal delay={index * 0.1} className="text-center">
      <div className={`mx-auto mb-4 h-12 w-12 ${style.icon} transition duration-300 group-hover:scale-110`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display font-semibold text-slate-900">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
    </ScrollReveal>
  )
}

export default function WorkflowPipeline() {
  return (
    <section id="how-it-works" className="landing-section-workflow border-t border-slate-200/80 bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="text-center">
          <p className="page-header-label">How it works</p>
          <h2 className="page-header-title mt-2 md:text-4xl">
            Four steps.{' '}
            <span className="accent-gradient-text">Zero busywork.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            The same flow you saw above — built for how freelancers actually work after a client call.
          </p>
        </ScrollReveal>

        <div className="relative mt-16 hidden lg:block">
          <div className="absolute left-[12%] right-[12%] top-6 h-px bg-gradient-to-r from-violet-200 via-orange-200 to-violet-200" />
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-start gap-4">
            {WORKFLOW.flatMap((step, index) => {
              const nodes = [
                <article key={step.title} className="group">
                  <WorkflowStep step={step} index={index} />
                </article>,
              ]

              if (index < WORKFLOW.length - 1) {
                nodes.push(
                  <div key={`arrow-${step.title}`} className="flex items-center justify-center pt-5">
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                  </div>,
                )
              }

              return nodes
            })}
          </div>
        </div>

        <div className="relative mt-16 lg:hidden">
          <div className="absolute bottom-4 left-[1.35rem] top-4 w-px bg-gradient-to-b from-violet-200 via-orange-200 to-violet-200" />
          <ol className="space-y-8">
            {WORKFLOW.map((step, index) => {
              const Icon = step.icon
              const style = toneStyles[step.tone]

              return (
                <ScrollReveal key={step.title} delay={index * 0.08}>
                  <li className="relative flex gap-4 pl-1">
                    <div className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${style.icon}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="pt-1">
                      <h3 className="font-display font-semibold text-slate-900">{step.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                    </div>
                  </li>
                </ScrollReveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
