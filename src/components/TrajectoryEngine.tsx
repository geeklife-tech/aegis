import { useState, useEffect, useCallback } from 'react';
import { Brain, Download, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, type Trajectory } from '@/lib/supabase';
import { PRIVACY_MODES, SAMPLE_TRAJECTORIES, type PrivacyMode } from '@/lib/data';

const MODE_ACCENT: Record<string, string> = {
  locked: 'bg-red-500/15 text-red-400 border-red-500/30',
  minimized: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  pseudonymous: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  monetizable: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

type Props = {
  activeMode: PrivacyMode;
};

export default function TrajectoryEngine({ activeMode }: Props) {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrajectories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('trajectories')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setTrajectories(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrajectories();
  }, [fetchTrajectories]);

  const seedSampleData = async () => {
    setLoading(true);
    setError(null);
    const rows = SAMPLE_TRAJECTORIES.map((t) => ({
      problem: t.problem,
      attempt: t.attempt,
      correction: t.correction,
      privacy_mode: t.privacy_mode,
    }));
    const { error: err } = await supabase.from('trajectories').insert(rows);
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    await fetchTrajectories();
  };

  const addTrajectory = async () => {
    const newEntry = {
      problem: 'New problem — click to describe what you tried to solve',
      attempt: 'Describe your first attempt here...',
      correction: 'Describe the correction or what you learned...',
      privacy_mode: activeMode,
    };
    const { data, error: err } = await supabase
      .from('trajectories')
      .insert(newEntry)
      .select()
      .single();

    if (err) {
      setError(err.message);
      return;
    }
    if (data) {
      setTrajectories((prev) => [data as Trajectory, ...prev]);
    }
  };

  const exportJson = () => {
    const exportData = trajectories.map((t) => ({
      id: t.id,
      problem: t.problem,
      attempt: t.attempt,
      correction: t.correction,
      privacy_mode: t.privacy_mode,
      timestamp: t.created_at,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegis-trajectories-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
        <Brain className="w-4 h-4 text-cyan-400" />
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-200 tracking-wide">
            LAYER 3
          </span>
          <span className="text-sm text-slate-500">Trajectory Engine</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {trajectories.length > 0 && (
            <button
              onClick={exportJson}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-500/40"
            >
              <Download className="w-3.5 h-3.5" />
              Export Trajectories (.json)
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        )}

        {loading && trajectories.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
            <span className="ml-2 text-sm text-slate-500">Loading trajectories...</span>
          </div>
        ) : trajectories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-sm text-slate-500">No trajectories logged yet.</p>
            <button
              onClick={seedSampleData}
              className="flex items-center gap-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Seed Sample Trajectories
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={addTrajectory}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/40 px-4 py-3 text-sm text-slate-500 hover:text-cyan-400 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Log New Trajectory
            </button>

            <div className="grid gap-3 md:grid-cols-2">
              {trajectories.map((t, idx) => {
                const mode = PRIVACY_MODES.find((m) => m.id === t.privacy_mode);
                return (
                  <div
                    key={t.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition-all hover:border-slate-700 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-slate-600 uppercase">
                        Trajectory #{trajectories.length - idx}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${MODE_ACCENT[t.privacy_mode] ?? MODE_ACCENT.pseudonymous}`}
                      >
                        {mode?.label ?? t.privacy_mode}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-wider">
                            Problem
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{t.problem}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span className="text-[10px] font-semibold text-sky-400/70 uppercase tracking-wider">
                            Attempt
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{t.attempt}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-wider">
                            Correction
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{t.correction}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
