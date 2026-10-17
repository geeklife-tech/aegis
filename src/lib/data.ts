export type PrivacyMode = 'locked' | 'minimized' | 'pseudonymous' | 'monetizable';

export type PolicyType = 'secrets' | 'pii' | 'ips' | 'paths';

export type PolicyConfig = {
  type: PolicyType;
  label: string;
  description: string;
  regex: RegExp;
  replacement: string;
  enabled: boolean;
};

export const PRIVACY_MODES: {
  id: PrivacyMode;
  label: string;
  description: string;
  color: string;
  accent: string;
}[] = [
  {
    id: 'locked',
    label: 'Locked',
    description: 'No data leaves the node',
    color: 'from-red-500/20 to-red-900/10',
    accent: 'text-red-400',
  },
  {
    id: 'minimized',
    label: 'Minimized',
    description: 'Only essential fields shared',
    color: 'from-amber-500/20 to-amber-900/10',
    accent: 'text-amber-400',
  },
  {
    id: 'pseudonymous',
    label: 'Pseudonymous',
    description: 'Identifiers replaced with tokens',
    color: 'from-sky-500/20 to-sky-900/10',
    accent: 'text-sky-400',
  },
  {
    id: 'monetizable',
    label: 'Monetizable',
    description: 'Consented data available for exchange',
    color: 'from-emerald-500/20 to-emerald-900/10',
    accent: 'text-emerald-400',
  },
];

export const DEFAULT_POLICIES: PolicyConfig[] = [
  {
    type: 'secrets',
    label: 'Secrets',
    description: 'API keys, tokens, passwords',
    regex: /(?:api[_-]?key|secret|token|password|passwd|pwd)["'\s:=]+[A-Za-z0-9+/=_\-]{8,}/gi,
    replacement: '[REDACTED:SECRET]',
    enabled: true,
  },
  {
    type: 'pii',
    label: 'PII',
    description: 'Emails, phone numbers, SSNs',
    regex: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\b\d{3}[-.]?\d{3}[-.]?\d{4}\b)|(\b\d{3}-\d{2}-\d{4}\b)/g,
    replacement: '[REDACTED:PII]',
    enabled: true,
  },
  {
    type: 'ips',
    label: 'IPs',
    description: 'IPv4 and IPv6 addresses',
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\b/g,
    replacement: '[REDACTED:IP]',
    enabled: true,
  },
  {
    type: 'paths',
    label: 'Paths',
    description: 'File system paths',
    regex: /(?:\/[\w.\-]+)+\/?|[A-Z]:\\[\w\\.\-]+/g,
    replacement: '[REDACTED:PATH]',
    enabled: true,
  },
];

export const VAULT_STATS = [
  { label: 'SQLite DB Size', value: '2.4 MB', icon: 'database' },
  { label: 'Total Keys', value: '1,247', icon: 'key' },
  { label: 'Context Entries', value: '386', icon: 'fileText' },
  { label: 'Last Sync', value: '14s ago', icon: 'refresh' },
];

export const VAULT_KEY_VALUES = [
  { key: 'user.workspace', value: '/home/dev/aegis-project' },
  { key: 'session.token', value: 'sk-2024-••••••••' },
  { key: 'context.model', value: 'gpt-4-turbo' },
  { key: 'node.version', value: 'aegis-v3.2.1' },
  { key: 'vault.location', value: '~/.aegis/vault.db' },
  { key: 'encryption.algo', value: 'AES-256-GCM' },
  { key: 'retention.days', value: '30' },
  { key: 'auto_purge', value: 'true' },
];

export const SAMPLE_TRAJECTORIES = [
  {
    problem: 'Parse nested JSON response from streaming API endpoint',
    attempt: 'Used JSON.parse on the full chunk — failed because chunks were partial fragments.',
    correction: 'Buffer chunks and use a streaming JSON parser. Accumulate until a complete object boundary is detected.',
    privacy_mode: 'pseudonymous' as PrivacyMode,
  },
  {
    problem: 'Resolve race condition in concurrent file writes to vault.db',
    attempt: 'Added a simple lock variable — still had race issues across async boundaries.',
    correction: 'Use a mutex queue with async/await ordering. SQLite WAL mode handles concurrent reads, writes need serialization.',
    privacy_mode: 'minimized' as PrivacyMode,
  },
  {
    problem: 'Sanitize user input containing embedded file paths and API keys',
    attempt: 'Manual string replacement — missed edge cases with encoded paths.',
    correction: 'Switched to regex-based policy sanitization. Secrets pattern now catches base64-encoded tokens too.',
    privacy_mode: 'locked' as PrivacyMode,
  },
];
