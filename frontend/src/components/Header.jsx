export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
        MERN + n8n + Gemini Automation
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
        OmniDoc AI
      </h1>
      <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
        Extract strict schema elements instantly from unmapped textual data, then seamlessly deploy conditional multi-node business logic triggers.
      </p>
    </header>
  );
}