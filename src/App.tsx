import { useState, useEffect } from 'react';
import { Terminal, Cpu, Activity, Wifi } from 'lucide-react';
import PrivacyModeBanner from '@/components/PrivacyModeBanner';
import ContextVault from '@/components/ContextVault';
import DisclosureGateway from '@/components/DisclosureGateway';
import TrajectoryEngine from '@/components/TrajectoryEngine';
import type { PrivacyMode } from '@/lib/data';

function App() {
  const [activeMode, setActiveMode] = useState<PrivacyMode>('pseudonymous');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-slate-800/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-slate-800 border border-cyan-500/30 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                AEGIS Protocol Node
              </h1>
              <p className="text-xs text-slate-500 font-mono">v3.2.1 — privacy-first context engine</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">node online</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono">{formatUptime(uptime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono">local-only</span>
            </div>
          </div>
        </header>

        {/* Privacy mode banner */}
        <PrivacyModeBanner activeMode={activeMode} onSelect={setActiveMode} />

        {/* Layer 1: Context Vault */}
        <ContextVault />

        {/* Layer 2: Disclosure Gateway */}
        <DisclosureGateway />

        {/* Layer 3: Trajectory Engine */}
        <TrajectoryEngine activeMode={activeMode} />

        {/* Footer */}
        <footer className="pt-2 pb-4 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-700 uppercase tracking-wider">
            aegis protocol // privacy layer v3.2.1
          </span>
          <span className="text-[10px] font-mono text-slate-700">
            mode: {activeMode}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
