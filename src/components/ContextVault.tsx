import { Database, Key, FileText, RefreshCw, ChevronRight, HardDrive } from 'lucide-react';
import { VAULT_STATS, VAULT_KEY_VALUES } from '@/lib/data';

const ICONS: Record<string, typeof Database> = {
  database: Database,
  key: Key,
  fileText: FileText,
  refresh: RefreshCw,
};

export default function ContextVault() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
        <HardDrive className="w-4 h-4 text-cyan-400" />
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-200 tracking-wide">
            LAYER 1
          </span>
          <span className="text-sm text-slate-500">Local Context Vault</span>
        </div>
        <span className="ml-auto text-xs text-slate-600 font-mono">sqlite://vault.db</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {VAULT_STATS.map((stat) => {
            const Icon = ICONS[stat.icon] ?? Database;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/80"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <p className="text-xl font-semibold text-slate-100 font-mono">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Key-value list */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
          <div className="flex items-center px-4 py-2.5 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Key-Value Store
            </span>
            <span className="ml-auto text-[10px] text-slate-600 font-mono">8 entries</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {VAULT_KEY_VALUES.map((kv) => (
              <div
                key={kv.key}
                className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-900/60 group"
              >
                <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-slate-500 transition-colors" />
                <span className="text-sm font-mono text-cyan-300/80 min-w-[180px]">
                  {kv.key}
                </span>
                <span className="text-sm font-mono text-slate-400 truncate">
                  {kv.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
