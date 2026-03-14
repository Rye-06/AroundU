export function SkillCard({ name, role, canHelp, wantsToLearn, avatar }: { name: string, role: string, canHelp: string[], wantsToLearn: string[], avatar: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-surface-200 hover:border-primary-200 transition-colors flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
        <div>
          <h3 className="font-semibold text-ink-800">{name}</h3>
          <p className="text-xs text-ink-400">{role}</p>
        </div>
      </div>
      <div className="space-y-4 mb-6 flex-grow">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400 mb-2">Can Help With</p>
          <div className="flex flex-wrap gap-2">
            {canHelp.map(s => <span key={s} className="px-2 py-0.5 rounded bg-primary-50 text-primary-600 text-xs font-medium">{s}</span>)}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400 mb-2">Wants to Learn</p>
          <div className="flex flex-wrap gap-2">
            {wantsToLearn.map(s => <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-500 text-xs font-medium">{s}</span>)}
          </div>
        </div>
      </div>
      <button className="w-full py-2 border border-surface-200 rounded-lg text-sm font-medium hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all">Send Message</button>
    </div>
  );
}
