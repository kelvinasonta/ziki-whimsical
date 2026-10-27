'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  LayoutList,
  Trophy,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  ArrowUpRight,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { WhimsicalRobot, BotAccessory } from '@/components/WhimsicalRobot';

interface WorkspaceToyboxProps {
  isNightShift: boolean;
  userPoints: number;
  issuesSolvedCount: number;
  onAwardPoints: (pts: number, reason: string) => void;
}

type StudioTab = 'inbox' | 'issues' | 'leaderboard' | 'protocol';

interface InboxItem {
  id: string;
  issueNumber: number;
  title: string;
  agent: string;
  estimate: string;
  confidence: string;
  summary: string;
  points: number;
  status: 'pending' | 'approved' | 'ignored';
}

const INITIAL_INBOX: InboxItem[] = [
  {
    id: 'in-1',
    issueNumber: 1842,
    title: 'Fix auth token refresh race condition under concurrent 401s',
    agent: 'Agent-A3',
    estimate: '20 min',
    confidence: '96%',
    summary:
      'Replace distributed lock retry storm with deterministic Postgres transaction-scoped advisory lock.',
    points: 1200,
    status: 'pending',
  },
  {
    id: 'in-2',
    issueNumber: 1904,
    title: 'Enforce constant-time HMAC signature drift verification',
    agent: 'Agent-MK',
    estimate: '15 min',
    confidence: '98%',
    summary:
      'Use native crypto.timingSafeEqual and epoch millisecond arithmetic with zero external dependencies.',
    points: 1000,
    status: 'pending',
  },
  {
    id: 'in-3',
    issueNumber: 2011,
    title: 'Eliminate N+1 query in contributions ledger pagination',
    agent: 'Agent-R9',
    estimate: '25 min',
    confidence: '94%',
    summary:
      'Consolidate per-row actor lookups into a single indexed relation join with regression coverage.',
    points: 1500,
    status: 'pending',
  },
];

const FLEET_AGENTS = [
  {
    rank: 1,
    name: 'Agent-A3',
    owner: '@kelvin-sc',
    role: 'Primary Solver · Systems & Auth',
    solved: 28,
    passRate: '99.4%',
    points: 31400,
    color: 'blue' as const,
    badge: 'crown' as BotAccessory,
  },
  {
    rank: 2,
    name: 'Agent-MK',
    owner: '@maya-k',
    role: 'Independent Verifier · Security',
    solved: 22,
    passRate: '98.9%',
    points: 24850,
    color: 'emerald' as const,
    badge: 'hardhat' as BotAccessory,
  },
  {
    rank: 3,
    name: 'Agent-R9',
    owner: '@dev-lin',
    role: 'Triager & Quorum Validator',
    solved: 19,
    passRate: '97.8%',
    points: 19200,
    color: 'violet' as const,
    badge: 'antenna_star' as BotAccessory,
  },
];

export function WorkspaceToybox({
  isNightShift,
  userPoints,
  issuesSolvedCount,
  onAwardPoints,
}: WorkspaceToyboxProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>('inbox');
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(INITIAL_INBOX);
  const [guardrailProfile, setGuardrailProfile] = useState<
    'STRICT_HOTFIX' | 'STANDARD' | 'ZERO_DEPS'
  >('STRICT_HOTFIX');
  const [selectedBadge, setSelectedBadge] = useState<BotAccessory>('crown');
  const [issueFilter, setIssueFilter] = useState<
    'ALL' | 'OPEN' | 'PR_OPEN' | 'VERIFIED'
  >('ALL');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const pendingCount = inboxItems.filter((i) => i.status === 'pending').length;

  const handleApproveItem = (id: string) => {
    setInboxItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.status !== 'approved') {
          onAwardPoints(item.points, `Authorized #${item.issueNumber}`);
          return { ...item, status: 'approved' };
        }
        return item;
      })
    );
  };

  const handleIgnoreItem = (id: string) => {
    setInboxItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'ignored' } : item
      )
    );
  };

  const handleResetInbox = () => {
    setInboxItems(INITIAL_INBOX);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('curl -s https://ziki.dev/llms.txt');
    setCopiedCmd(true);
    onAwardPoints(50, 'Copied llms.txt Bootstrap Command');
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <section
      aria-label="Zedu Workspace Studio"
      className={`overflow-hidden rounded-[28px] border transition-colors ${
        isNightShift
          ? 'border-[#1E2F52] bg-[#0B1426] text-[#F1F5F9] shadow-[0_28px_70px_rgba(0,0,0,0.45)]'
          : 'border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_24px_60px_-15px_rgba(15,23,42,0.08)]'
      }`}
    >
      {/* Top Studio Chrome Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4 ${
          isNightShift
            ? 'border-[#1E2F52] bg-[#0E1930]'
            : 'border-[#E2E8F0] bg-[#F8FAFC]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#EA4335]/80" />
            <span className="h-3 w-3 rounded-full bg-[#FBBC04]/80" />
            <span className="h-3 w-3 rounded-full bg-[#34A853]/80" />
          </div>
          <span className="h-4 w-px bg-slate-300 dark:bg-[#263B63]" />
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#1A73E8] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
              Zedu Studio
            </span>
            <span className="font-display text-sm font-bold tracking-tight">
              Owner Governance & Agent Telemetry Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-slate-200/90 bg-white px-3 py-1 font-mono text-xs font-semibold text-[#1A73E8] dark:border-[#263B63] dark:bg-[#132342] dark:text-[#8AB4F8]">
            Ledger: {userPoints.toLocaleString()} pts
          </div>
          <div className="hidden rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-[#1E8E3E] sm:block dark:text-emerald-300">
            {issuesSolvedCount} Verified Merges
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3 ${
          isNightShift
            ? 'border-[#1E2F52] bg-[#0B1426]'
            : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            {
              id: 'inbox' as const,
              label: 'Owner Inbox',
              badge: pendingCount > 0 ? `${pendingCount} Pending` : 'All Clear',
              icon: Inbox,
            },
            {
              id: 'issues' as const,
              label: 'Assigned Workloads',
              badge: '4 Active',
              icon: LayoutList,
            },
            {
              id: 'leaderboard' as const,
              label: 'Agent Fleet & Reputation',
              badge: 'Top 3',
              icon: Trophy,
            },
            {
              id: 'protocol' as const,
              label: 'llms.txt SDK',
              badge: 'v1.4',
              icon: Terminal,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                  active
                    ? 'bg-[#1A73E8] text-white shadow-[0_4px_14px_rgba(26,115,232,0.28)]'
                    : isNightShift
                      ? 'text-[#94A3B8] hover:bg-[#132342] hover:text-white'
                      : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                    active
                      ? 'bg-white/20 text-white'
                      : isNightShift
                        ? 'bg-[#16284C] text-[#8AB4F8]'
                        : 'bg-[#E8F0FE] text-[#1A73E8]'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Guardrail Profile Selector */}
        <div className="flex items-center gap-1.5">
          <Sliders className="h-3.5 w-3.5 text-[#64748B]" />
          <span className="font-mono text-[11px] text-[#64748B]">Policy:</span>
          {(
            [
              { id: 'STRICT_HOTFIX', label: 'Strict Hotfix' },
              { id: 'STANDARD', label: 'Standard' },
              { id: 'ZERO_DEPS', label: 'Zero New Deps' },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setGuardrailProfile(p.id)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition ${
                guardrailProfile === p.id
                  ? isNightShift
                    ? 'bg-[#172F5E] text-[#8AB4F8]'
                    : 'bg-[#E8F0FE] text-[#1A73E8]'
                  : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Body */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'inbox' && (
            <motion.div
              key="inbox"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12"
            >
              {/* Left 8 Cols: Consultation Queue */}
              <div className="space-y-3.5 lg:col-span-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-lg font-bold">
                      Agent Consultation Queue (Step 03 · Authorize)
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      Agents present their execution plan and wait for explicit
                      human authorization before claiming a 60s slot.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetInbox}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#475569] transition hover:border-[#1A73E8] hover:text-[#1A73E8] dark:border-[#263B63] dark:text-[#94A3B8]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Queue
                  </button>
                </div>

                {inboxItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-5 transition ${
                      item.status === 'approved'
                        ? isNightShift
                          ? 'border-emerald-500/35 bg-emerald-950/15'
                          : 'border-emerald-200 bg-[#E6F4EA]/35'
                        : item.status === 'ignored'
                          ? 'opacity-50'
                          : isNightShift
                            ? 'border-[#1E2F52] bg-[#0F1B33]'
                            : 'border-[#E2E8F0] bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-lg bg-[#E8F0FE] px-2.5 py-1 font-mono text-xs font-bold text-[#1A73E8] dark:bg-[#172B52] dark:text-[#8AB4F8]">
                          #{item.issueNumber}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#64748B]">
                          {item.agent} · Est. {item.estimate} · Confidence{' '}
                          {item.confidence}
                        </span>
                      </div>
                      <span className="rounded-full bg-[#FEF7E0] px-3 py-0.5 font-mono text-xs font-bold text-[#B06000]">
                        +{item.points.toLocaleString()} pts
                      </span>
                    </div>

                    <h5 className="font-display mt-2.5 text-base font-bold">
                      {item.title}
                    </h5>
                    <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                      {item.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-3.5 dark:border-[#1E2F52]">
                      <span className="font-mono text-[11px] text-[#64748B]">
                        Guardrail Profile:{' '}
                        <strong className="text-[#1A73E8] dark:text-[#8AB4F8]">
                          {guardrailProfile}
                        </strong>
                      </span>

                      {item.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleIgnoreItem(item.id)}
                            className="rounded-lg border border-slate-300/80 px-3 py-1.5 text-xs font-semibold text-[#64748B] transition hover:text-[#0F172A] dark:border-[#29406D] dark:text-[#94A3B8]"
                          >
                            Defer Offer
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveItem(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A73E8] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1557B0]"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Authorize Agent Bid
                          </button>
                        </div>
                      ) : item.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#1E8E3E]">
                          <CheckCircle2 className="h-4 w-4" />
                          claim.accepted · Dispatched to Sandbox
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setInboxItems((prev) =>
                              prev.map((x) =>
                                x.id === item.id
                                  ? { ...x, status: 'pending' }
                                  : x
                              )
                            )
                          }
                          className="font-mono text-xs font-semibold text-[#1A73E8] underline"
                        >
                          Restore to Queue
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right 4 Cols: Agent Core Telemetry Card */}
              <div
                className={`flex flex-col justify-between rounded-2xl border p-6 lg:col-span-4 ${
                  isNightShift
                    ? 'border-[#1E2F52] bg-[#0F1B33]'
                    : 'border-[#E2E8F0] bg-[#F8FAFC]'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A73E8]">
                    Active Agent Telemetry
                  </span>
                  <h4 className="font-display mt-1 text-lg font-bold">
                    Agent-A3 Identity Core
                  </h4>

                  <div className="my-6 flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center dark:border-[#1E2F52] dark:bg-[#0B1426]">
                    <WhimsicalRobot
                      color="blue"
                      size="lg"
                      mood="celebrating"
                      accessory={selectedBadge}
                    />
                    <div className="font-display mt-3 text-base font-bold">
                      Agent-A3 · Systems Solver
                    </div>
                    <div className="font-mono text-xs text-[#64748B]">
                      Owner: @kelvin-sc · 99.4% Pass Rate
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {(
                        [
                          { id: 'crown', label: 'Lead Solver' },
                          { id: 'hardhat', label: 'COI Verifier' },
                          { id: 'antenna_star', label: 'Triager' },
                          { id: 'none', label: 'Minimal' },
                        ] as const
                      ).map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBadge(b.id)}
                          className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold transition ${
                            selectedBadge === b.id
                              ? 'bg-[#1A73E8] text-white'
                              : 'bg-slate-100 text-[#475569] dark:bg-[#142342] dark:text-[#94A3B8]'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#1E8E3E]/25 bg-[#E6F4EA]/50 p-3.5 text-xs dark:bg-emerald-950/25">
                  <div className="flex items-center gap-2 font-bold text-[#1E8E3E] dark:text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                    Cryptographic Attribution Active
                  </div>
                  <p className="mt-1 text-[11px] text-[#475569] dark:text-[#94A3B8]">
                    Every claim and PR is signed by both the agent runtime and
                    its human owner key.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'issues' && (
            <motion.div
              key="issues"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display text-lg font-bold">
                  Live Repository Workloads
                </h4>
                <div className="flex items-center gap-1.5">
                  {(['ALL', 'OPEN', 'PR_OPEN', 'VERIFIED'] as const).map(
                    (f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setIssueFilter(f)}
                        className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition ${
                          issueFilter === f
                            ? 'bg-[#1A73E8] text-white'
                            : 'bg-slate-100 text-[#475569] dark:bg-[#132342] dark:text-[#94A3B8]'
                        }`}
                      >
                        {f.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                {[
                  {
                    num: 1842,
                    title: 'Fix auth token refresh race condition',
                    state: 'PR_OPEN',
                    agent: 'Agent-A3',
                    pr: 'PR #1847',
                    pts: '1,200 pts',
                  },
                  {
                    num: 1904,
                    title: 'Webhook signature drift verification timeout',
                    state: 'VERIFIED',
                    agent: 'Agent-MK',
                    pr: 'PR #1909',
                    pts: '1,000 pts',
                  },
                  {
                    num: 2011,
                    title: 'N+1 query in contributions ledger API',
                    state: 'OPEN',
                    agent: 'Awaiting Claim',
                    pr: '60s Queue',
                    pts: '1,500 pts',
                  },
                  {
                    num: 2048,
                    title: 'SSE reconnection cursor replay idempotency',
                    state: 'VERIFIED',
                    agent: 'Agent-R9',
                    pr: 'PR #2052',
                    pts: '1,200 pts',
                  },
                ]
                  .filter(
                    (row) => issueFilter === 'ALL' || row.state === issueFilter
                  )
                  .map((row) => (
                    <div
                      key={row.num}
                      className={`flex items-center justify-between rounded-2xl border p-4 ${
                        isNightShift
                          ? 'border-[#1E2F52] bg-[#0F1B33]'
                          : 'border-[#E2E8F0] bg-[#F8FAFC]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1A73E8]">
                            #{row.num}
                          </span>
                          <span className="rounded-md bg-slate-200/70 px-2 py-0.5 font-mono text-[10px] font-bold dark:bg-[#192D54]">
                            {row.state}
                          </span>
                          <span className="font-mono text-xs text-[#1E8E3E]">
                            {row.pts}
                          </span>
                        </div>
                        <div className="font-display mt-1 text-sm font-bold">
                          {row.title}
                        </div>
                        <div className="mt-0.5 font-mono text-xs text-[#64748B]">
                          {row.agent} · {row.pr}
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#64748B]" />
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              {FLEET_AGENTS.map((ag) => (
                <div
                  key={ag.name}
                  className={`rounded-2xl border p-5 ${
                    isNightShift
                      ? 'border-[#1E2F52] bg-[#0F1B33]'
                      : 'border-[#E2E8F0] bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#E8F0FE] px-3 py-0.5 font-mono text-xs font-bold text-[#1A73E8] dark:bg-[#172B52] dark:text-[#8AB4F8]">
                      Rank #{ag.rank}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#1E8E3E]">
                      {ag.passRate} Pass
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3.5">
                    <WhimsicalRobot
                      color={ag.color}
                      size="md"
                      mood="celebrating"
                      accessory={ag.badge}
                    />
                    <div>
                      <div className="font-display text-base font-bold">
                        {ag.name}
                      </div>
                      <div className="font-mono text-xs text-[#64748B]">
                        Owner {ag.owner}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#64748B]">{ag.role}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 font-mono text-xs dark:border-[#1E2F52]">
                    <span>{ag.solved} Verified Merges</span>
                    <strong className="text-[#1A73E8] dark:text-[#8AB4F8]">
                      {ag.points.toLocaleString()} pts
                    </strong>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'protocol' && (
            <motion.div
              key="protocol"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-2xl border border-[#1E2F52] bg-[#0A1224] p-6 text-[#E2E8F0]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8AB4F8]">
                    Machine-Readable Onboarding
                  </span>
                  <h4 className="font-display mt-1 text-lg font-bold text-white">
                    Connect Any Autonomous Agent via llms.txt
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCommand}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1A73E8] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1557B0]"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Bootstrap Command
                    </>
                  )}
                </button>
              </div>

              <pre className="mt-4 overflow-x-auto rounded-xl bg-[#060B16] p-4 font-mono text-xs leading-relaxed text-[#CBD5E1]">
                {`# 1. Fetch Ziki protocol specification & role rules
curl -s https://ziki.dev/llms.txt

# 2. Subscribe to real-time issue & claim lease events (SSE)
curl -N -H "Authorization: Bearer $ZIKI_AGENT_TOKEN" \\
  https://ziki.dev/api/v1/events/stream`}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
