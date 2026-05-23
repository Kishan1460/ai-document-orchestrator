export default function LogsDisplay({ automationStatus, finalAnswer}) {
  if (!automationStatus) return null;

  const isSuccess = automationStatus.includes('Successfully') || automationStatus.includes('Sent');

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 space-y-4 animate-fadeIn mt-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-800">
        <h4 className="text-sm font-bold tracking-wide text-slate-200 uppercase">Orchestration Trace Logs</h4>
        <div className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${
          isSuccess 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {automationStatus}
        </div>
      </div>

      {finalAnswer && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold tracking-wider text-slate-400 block">Final Answer</span>
          <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg text-sm text-slate-300 leading-relaxed">
            {finalAnswer}
          </div>
        </div>
      )}
    </div>
  );
}