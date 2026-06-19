export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display font-semibold text-slate-900">ClientFlow AI</p>
            <p className="mt-1 text-sm text-slate-500">Client intake and meeting assistant</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Built with React, Spring Boot, OpenAI</span>
            <a
              href="https://github.com/rooomaisa/clientflow-ai"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 transition hover:text-violet-600"
            >
              View on GitHub →
            </a>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-100 pt-6 text-xs text-slate-400">
          Portfolio project by Romy
        </p>
      </div>
    </footer>
  )
}
