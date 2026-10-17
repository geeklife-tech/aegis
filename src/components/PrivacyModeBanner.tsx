import { Lock, Minimize2, UserCircle, DollarSign, ShieldCheck } from 'lucide-react';
import type { PrivacyMode } from '@/lib/data';
import { PRIVACY_MODES } from '@/lib/data';

const ICONS: Record<PrivacyMode, typeof Lock> = {
  locked: Lock,
  minimized: Minimize2,
  pseudonymous: UserCircle,
  monetizable: DollarSign,
};

type Props = {
  activeMode: PrivacyMode;
  onSelect: (mode: PrivacyMode) => void;
};

export default function PrivacyModeBanner({ activeMode, onSelect }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-slate-200 tracking-wide">
          PRIVACY MODE
        </span>
        <span className="ml-auto text-xs text-slate-500 font-mono">
          aegis://privacy/active
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800">
        {PRIVACY_MODES.map((mode) => {
          const Icon = ICONS[mode.id];
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className={`
                relative group p-5 text-left transition-all duration-300
                bg-gradient-to-br ${mode.color}
                ${isActive ? 'ring-1 ring-inset ring-cyan-500/50' : 'hover:bg-slate-800/50'}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  className={`w-5 h-5 transition-colors ${isActive ? mode.accent : 'text-slate-500 group-hover:text-slate-400'}`}
                />
                <span
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? mode.accent : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {mode.label}
                </span>
                {isActive && (
                  <span className="ml-auto flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${mode.accent.replace('text-', 'bg-')} animate-pulse`} />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">active</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {mode.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
