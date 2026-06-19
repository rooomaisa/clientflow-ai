import { Link } from 'react-router-dom'
import { ArrowRight, CheckSquare, Sparkles, Users, Zap } from 'lucide-react'
import BentoShowcase from '../components/landing/BentoShowcase'
import ScrollReveal from '../components/landing/ScrollReveal'
import WorkflowPipeline from '../components/landing/WorkflowPipeline'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

const features = [
  {
    icon: Users,
    title: 'Client management',
    description: 'Keep client details, status, and notes in one clean workspace.',
    iconClass: 'landing-icon-purple',
    accentClass: 'landing-card-accent-purple',
  },
  {
    icon: Zap,
    title: 'Meeting notes',
    description: 'Capture raw conversation notes right after every client call.',
    iconClass: 'landing-icon-orange',
    accentClass: 'landing-card-accent-orange',
  },
  {
    icon: Sparkles,
    title: 'AI processing',
    description: 'Turn messy notes into summaries, action items, and email drafts.',
    iconClass: 'landing-icon-purple',
    accentClass: 'landing-card-accent-purple',
  },
  {
    icon: CheckSquare,
    title: 'Follow-up tasks',
    description: 'Track what to do next so nothing falls through the cracks.',
    iconClass: 'landing-icon-orange',
    accentClass: 'landing-card-accent-orange',
  },
]

const techStack = ['React', 'Spring Boot', 'PostgreSQL', 'OpenAI']

export default function LandingPage() {
  return (
    <div className="landing-bg min-h-screen">
      <Navbar variant="landing" />

      <main>
        <section className="relative overflow-hidden pb-20 pt-24">
          <div className="pointer-events-none absolute inset-0 bg-mesh-hero" />

          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <p className="mb-6 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 opacity-0">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              Built for freelancers and small agencies
            </p>

            <h1 className="animate-fade-in-up animation-delay-100 mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-tight text-slate-900 opacity-0 md:text-6xl md:leading-[1.1]">
              Turn client conversations into{' '}
              <span className="accent-gradient-text">clear follow-up actions</span>
            </h1>

            <p className="animate-fade-in-up animation-delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 opacity-0">
              ClientFlow AI helps you manage clients, meeting notes, and tasks — then uses AI
              to summarize conversations and draft professional follow-ups.
            </p>

            <div className="animate-fade-in-up animation-delay-300 mt-10 flex flex-wrap items-center justify-center gap-4 opacity-0">
              <Link to="/register" className="landing-btn gap-2">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="landing-btn-outline">
                See how it works
              </a>
            </div>

            <BentoShowcase />
          </div>
        </section>

        <section className="border-y border-slate-200/80 bg-white py-10">
          <ScrollReveal>
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Powered by
              </span>
              {techStack.map((tech, index) => (
                <span
                  key={tech}
                  className={`landing-pill cursor-default transition hover:shadow-md ${
                    index % 2 === 0
                      ? 'hover:border-violet-200 hover:text-violet-700'
                      : 'hover:border-orange-200 hover:text-orange-700'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section id="features" className="landing-section-features py-28">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal className="text-center">
              <p className="page-header-label">What you get</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                One workspace.{' '}
                <span className="accent-gradient-text">Four superpowers.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                <span className="font-medium text-violet-700">Capture</span> the call,{' '}
                <span className="font-medium text-orange-600">process</span> with AI, and{' '}
                <span className="font-medium text-violet-700">follow up</span> — without switching
                tools or losing context.
              </p>
            </ScrollReveal>

            <div className="mt-16 grid gap-5 md:grid-cols-2">
              {features.map(({ icon: Icon, title, description, iconClass, accentClass }, index) => (
                <ScrollReveal key={title} delay={index * 0.08}>
                  <article className={`landing-card-accent group h-full p-6 ${accentClass}`}>
                    <div className={`mb-4 h-11 w-11 ${iconClass} transition duration-300 group-hover:scale-110 group-hover:shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <WorkflowPipeline />

        <section className="landing-section-cta py-28">
          <div className="mx-auto max-w-4xl px-6">
            <ScrollReveal>
              <div className="landing-cta-card">
                <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-accent-gradient" />
                <h2 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
                  Ready to streamline client follow-ups?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                  Create your account and start turning meeting notes into useful next steps.
                </p>
                <Link to="/register" className="landing-btn mt-8 inline-flex">
                  Create account
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
