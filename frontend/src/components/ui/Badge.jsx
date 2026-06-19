export default function Badge({ children, tone = 'slate', size = 'md' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700 ring-slate-200/60',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200/60',
    emerald: 'bg-violet-50 text-violet-700 ring-violet-200/60',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200/60',
    orange: 'bg-orange-50 text-orange-700 ring-orange-200/60',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200/60',
    red: 'bg-red-50 text-red-700 ring-red-200/60',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${tones[tone]} ${sizes[size]}`}
    >
      {children}
    </span>
  )
}
