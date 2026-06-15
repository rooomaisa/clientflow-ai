import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

const features = [
  {
    title: 'Client management',
    description: 'Keep client details, status, and notes in one clean workspace.',
  },
  {
    title: 'Meeting notes',
    description: 'Capture raw conversation notes right after every client call.',
  },
  {
    title: 'AI processing',
    description: 'Turn messy notes into summaries, action items, and email drafts.',
  },
  {
    title: 'Follow-up tasks',
    description: 'Track what to do next so nothing falls through the cracks.',
  },
]

const steps = [
  'Add a client and paste your meeting notes',
  'Click Process with AI',
  'Review the summary, email draft, and suggested tasks',
  'Follow up with confidence',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="mb-4 inline-block rounded-full bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
            Built for freelancers and small agencies
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Turn client conversations into clear follow-up actions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            ClientFlow AI helps you manage clients, meeting notes, and tasks — then uses AI
            to summarize conversations and draft professional follow-ups.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Start free
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              See how it works
            </a>
          </div>
        </section>

        <section id="features" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold text-slate-900">Everything in one flow</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
              A simple workflow from conversation to action — like the tools agencies use,
              without the complexity.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
            <ol className="mx-auto mt-12 grid max-w-3xl gap-4">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-slate-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl rounded-3xl bg-slate-900 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-bold">Ready to streamline client follow-ups?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Create your account and start turning meeting notes into useful next steps.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-block rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Create account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
