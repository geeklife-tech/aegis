import { useState, useMemo } from 'react';
import { Shield, Lock, AtSign, Globe, Folder, Play, Copy, Check } from 'lucide-react';
import { DEFAULT_POLICIES, type PolicyConfig, type PolicyType } from '@/lib/data';

const POLICY_ICONS: Record<PolicyType, typeof Lock> = {
  secrets: Lock,
  pii: AtSign,
  ips: Globe,
  paths: Folder,
};

const SAMPLE_INPUT = `Connecting to server at 192.168.1.100 with api_key=sk-9f8e7d6c5b4a3210
User john.doe@company.com reported issue with file /home/john/config.yml
Backup token:Bearer abc123xyz789 stored at C:\\Users\\admin\\secrets.txt
Phone: 555-123-4567 — please redact before sending.`;

export default function DisclosureGateway() {
  const [policies, setPolicies] = useState<PolicyConfig[]>(DEFAULT_POLICIES);
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const togglePolicy = (type: PolicyType) => {
    setPolicies((prev) =>
      prev.map((p) => (p.type === type ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const sanitize = () => {
    let result = input;
    for (const policy of policies) {
      if (policy.enabled) {
        result = result.replace(policy.regex, policy.replacement);
      }
    }
    setOutput(result);
    setHasRun(true);
  };

  const matchCount = useMemo(() => {
    if (!hasRun) return null;
    let count = 0;
    for (const policy of policies) {
      if (policy.enabled) {
        const matches = input.match(new RegExp(policy.regex.source, policy.regex.flags));
        if (matches) count += matches.length;
      }
    }
    return count;
  }, [input, policies, hasRun]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
        <Shield className="w-4 h-4 text-cyan-400" />
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-200 tracking-wide">
            LAYER 2
          </span>
          <span className="text-sm text-slate-500">Local Disclosure Gateway</span>
        </div>
        <span className="ml-auto text-xs text-slate-600 font-mono">regex://sanitizer</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Policy toggles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {policies.map((policy) => {
            const Icon = POLICY_ICONS[policy.type];
            return (
              <button
                key={policy.type}
                onClick={() => togglePolicy(policy.type)}
                className={`
                  rounded-xl border p-4 text-left transition-all duration-300
                  ${
                    policy.enabled
                      ? 'border-cyan-500/40 bg-cyan-950/30'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${policy.enabled ? 'text-cyan-400' : 'text-slate-600'}`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        policy.enabled ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {policy.label}
                    </span>
                  </div>
                  <div
                    className={`
                      w-9 h-5 rounded-full transition-all duration-300 relative
                      ${policy.enabled ? 'bg-cyan-500/60' : 'bg-slate-700'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300
                        ${policy.enabled ? 'left-4.5' : 'left-0.5'}
                      `}
                      style={{ left: policy.enabled ? '18px' : '2px' }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{policy.description}</p>
              </button>
            );
          })}
        </div>

        {/* Input box */}
        <div>
          <label className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Raw Input
            </span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-y"
            placeholder="Paste raw text containing secrets, PII, IPs, or paths..."
          />
        </div>

        {/* Run button */}
        <div className="flex items-center gap-3">
          <button
            onClick={sanitize}
            className="flex items-center gap-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95"
          >
            <Play className="w-4 h-4" />
            Run Policy Sanitizer
          </button>
          {matchCount !== null && (
            <span className="text-xs font-mono text-slate-500">
              {matchCount} {matchCount === 1 ? 'redaction' : 'redactions'} applied
            </span>
          )}
        </div>

        {/* Output box */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sanitized Output
            </span>
            {output && (
              <button
                onClick={copyOutput}
                className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            )}
          </div>
          <div className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-400 min-h-[120px] whitespace-pre-wrap break-all">
            {output || (
              <span className="text-slate-600 italic">
                Sanitized output will appear here after running the policy sanitizer...
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
