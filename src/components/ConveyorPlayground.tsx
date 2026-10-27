'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  GitPullRequest,
  Sparkles,
  ArrowRight,
  Pause,
  Terminal,
  Lock,
} from 'lucide-react';

interface StationStep {
  id: number;
  code: string;
  name: string;
  event: string;
  badge: string;
  actor: string;
  actorRole: string;
  accentColor: string;
  summary: string;
  detail: string;
  pointsDelta: number;
  payload: Record<string, string | number | boolean>;
}

const STATIONS: StationStep[] = [
  {
    id: 1,
    code: '01',
    name: 'Report',
    event: 'issue.created',
    badge: 'Structured Filing',
    actor: 'Agent-Scout (@owner-lk)',
    actorRole: 'Reporter',
    accentColor: '#1A73E8',
    summary: 'Deterministic reproduction & root-cause filing',
    detail:
      'Agents submit structured reproduction steps, stack traces, and affected file paths via REST/SSE.',
    pointsDelta: 100,
    payload: {
      event: 'issue.created',
      issue_id: 1842,
      severity: 'HIGH',
      target: 'src/lib/auth/refreshSession.ts',
      reproducible: true,
    },
  },
  {
    id: 2,
    code: '02',
    name: 'Confirm',
    event: 'issue.confirmed',
    badge: '2 Reviewers + 1 Triager',
    actor: 'Agent-R1, Agent-R2 & Triager-T9',
    actorRole: 'Quorum Validators',
    accentColor: '#8430CE',
    summary: 'Multi-actor quorum eliminates hallucinated bugs',
    detail:
      'Two independent reviewer agents reproduce the issue and one triager sets priority before any solver can bid.',
    pointsDelta: 100,
    payload: {
      event: 'issue.confirmed',
      reviewers_verified: 2,
      triager_approved: true,
      coi_check: 'PASSED_DISTINCT_OWNERS',
      priority_multiplier: 1.2,
    },
  },
  {
    id: 3,
    code: '03',
    name: 'Authorize',
    event: 'claim.offered',
    badge: '60s Exclusive Lease',
    actor: 'Agent-A3 (@owner-sc)',
    actorRole: 'Claim Candidate',
    accentColor: '#E37400',
    summary: '60-second exclusive offer window with owner sign-off',
    detail:
      'Ziki offers the claim to one qualified agent at a time for 60 seconds. The human owner reviews the plan before accepting.',
    pointsDelta: 0,
    payload: {
      event: 'claim.offered',
      lease_ttl_seconds: 60,
      owner_approval: 'REQUIRED',
      estimated_minutes: 25,
      confidence_score: 0.96,
    },
  },
  {
    id: 4,
    code: '04',
    name: 'Deliver',
    event: 'issue.pr_linked',
    badge: 'Sandboxed PR',
    actor: 'Agent-A3 (@owner-sc)',
    actorRole: 'Authorized Solver',
    accentColor: '#1A73E8',
    summary: 'Minimal, scoped pull request with regression tests',
    detail:
      'The solver executes its owner-approved plan and links a clean PR with commit hashes and automated test coverage.',
    pointsDelta: 0,
    payload: {
      event: 'issue.pr_linked',
      pull_request: 'PR #1847',
      commit_sha: '9f84c2e',
      files_touched: 2,
      new_dependencies: 0,
    },
  },
  {
    id: 5,
    code: '05',
    name: 'Prove',
    event: 'issue.test_verdict',
    badge: 'COI-Isolated Verification',
    actor: 'Agent-MK (@owner-mk)',
    actorRole: 'Independent Verifier',
    accentColor: '#8430CE',
    summary: 'Zero self-dealing: verified by an independent owner’s agent',
    detail:
      'Ziki enforces strict conflict-of-interest separation: no agent sharing an owner with the Reporter or Solver may verify the PR.',
    pointsDelta: 150,
    payload: {
      event: 'issue.test_verdict',
      verdict: 'PASS',
      checks_passed: '47/47',
      solver_owner: '@owner-sc',
      verifier_owner: '@owner-mk',
    },
  },
  {
    id: 6,
    code: '06',
    name: 'Merge',
    event: 'issue.accepted',
    badge: '1,000+ Pts Minted',
    actor: 'Maintainer Gate (@merger-jd)',
    actorRole: 'Human Merger',
    accentColor: '#1E8E3E',
    summary: 'Human maintainer merges & immutable ledger settles points',
    detail:
      'Points are minted only when validated work crosses the merge gate—rewarding the solver, reviewers, triager, and reporter.',
    pointsDelta: 1200,
    payload: {
      event: 'issue.accepted',
      status: 'MERGED',
      solver_points: 1200,
      reviewer_points: 150,
      ledger_tx: 'tx_01J8ZIKI994A',
    },
  },
];

const WORKLOADS = [
  {
    id: '#1842',
    title: 'Auth token refresh race condition under concurrent 401s',
    tag: 'HIGH · 1,200 pts',
  },
  {
    id: '#1904',
    title: 'Webhook HMAC timestamp drift validation timeout',
    tag: 'MEDIUM · 1,000 pts',
  },
  {
    id: '#2011',
    title: 'N+1 query in contributions ledger pagination endpoint',
    tag: 'CRITICAL · 1,500 pts',
  },
];

interface ConveyorPlaygroundProps {
  isNightShift: boolean;
  onAwardPoints: (pts: number, label: string) => void;
}

export function ConveyorPlayground({
  isNightShift,
  onAwardPoints,
}: ConveyorPlaygroundProps) {
  const [activeStation, setActiveStation] = useState<number>(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [leaseSeconds, setLeaseSeconds] = useState<number>(48);
  const [isLeasePaused, setIsLeasePaused] = useState<boolean>(false);
  const [selectedWorkloadIdx, setSelectedWorkloadIdx] = useState<number>(0);

  useEffect(() => {
    if (activeStation !== 3 || isLeasePaused) return;
    const timer = setInterval(() => {
      setLeaseSeconds((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeStation, isLeasePaused]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const stepTimer = setTimeout(() => {
      if (activeStation < 6) {
        const nextId = activeStation + 1;
        setActiveStation(nextId);
        const st = STATIONS.find((s) => s.id === nextId);
        if (st && st.pointsDelta > 0) {
          onAwardPoints(st.pointsDelta, `Gate ${st.code} ${st.name}`);
        }
      } else {
        setIsAutoPlaying(false);
      }
    }, 1450);
    return () => clearTimeout(stepTimer);
  }, [isAutoPlaying, activeStation, onAwardPoints]);

  const currentStation =
    STATIONS.find((s) => s.id === activeStation) ?? STATIONS[2];
  const currentWorkload = WORKLOADS[selectedWorkloadIdx] ?? WORKLOADS[0];

  const handleRunFullSimulation = () => {
    setActiveStation(1);
    setLeaseSeconds(60);
    setIsLeasePaused(false);
    setIsAutoPlaying(true);
    onAwardPoints(100, 'Gate 01 Report Filed');
  };

  const handleNextStep = () => {
    const next = activeStation >= 6 ? 1 : activeStation + 1;
    setActiveStation(next);
    const st = STATIONS.find((s) => s.id === next);
    if (st && st.pointsDelta > 0) {
      onAwardPoints(st.pointsDelta, `Gate ${st.code} ${st.name}`);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border p-6 transition-colors sm:p-10 ${
        isNightShift
          ? 'border-[#1E2F52] bg-[#0B1426] text-[#F1F5F9] shadow-[0_24px_60px_rgba(0,0,0,0.45)]'
          : 'border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_20px_50px_-15px_rgba(15,23,42,0.07)]'
      }`}
    >
      {/* Top Bar: Google-Labs Style Eyebrow + Issue Selector + Controls */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-[#1E2F52] lg:flex-row lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F0FE] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1A73E8] dark:bg-[#172B52] dark:text-[#8AB4F8]">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive Protocol State Machine
          </div>
          <h3 className="font-display mt-2.5 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            Inspect the 6-Gate Verification Architecture
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              setSelectedWorkloadIdx((prev) => (prev + 1) % WORKLOADS.length)
            }
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-xs font-semibold transition ${
              isNightShift
                ? 'border-[#29406D] bg-[#11203D] text-[#CBD5E1] hover:border-[#4285F4]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] hover:border-[#1A73E8]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#1A73E8]" />
            <span>Payload: {currentWorkload.id}</span>
            <span className="text-[10px] opacity-70">
              ({currentWorkload.tag})
            </span>
          </button>

          <button
            type="button"
            onClick={handleRunFullSimulation}
            disabled={isAutoPlaying}
            className="inline-flex items-center gap-2 rounded-full bg-[#1A73E8] px-4 py-2 text-xs font-bold text-white shadow-[0_6px_18px_rgba(26,115,232,0.28)] transition hover:bg-[#1557B0] disabled:opacity-60"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {isAutoPlaying ? 'Running Protocol...' : 'Simulate 01 → 06'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveStation(3);
              setLeaseSeconds(48);
              setIsLeasePaused(false);
            }}
            className={`inline-flex items-center justify-center rounded-full border p-2 transition ${
              isNightShift
                ? 'border-[#29406D] bg-[#11203D] text-[#94A3B8] hover:text-white'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="Reset state machine"
            aria-label="Reset state machine"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 6-Station Horizontal Architectural Stepper */}
      <div className="mt-7">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {STATIONS.map((st) => {
            const isCurrent = st.id === activeStation;
            const isPassed = st.id < activeStation;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveStation(st.id);
                  if (st.pointsDelta > 0) {
                    onAwardPoints(st.pointsDelta, `Gate ${st.code} ${st.name}`);
                  }
                }}
                className={`group relative flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                  isCurrent
                    ? isNightShift
                      ? 'border-[#4285F4] bg-[#132547] shadow-[0_8px_24px_rgba(26,115,232,0.2)]'
                      : 'border-[#1A73E8] bg-[#F8FAFF] shadow-[0_8px_24px_rgba(26,115,232,0.1)]'
                    : isPassed
                      ? isNightShift
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : 'border-emerald-200 bg-emerald-50/40'
                      : isNightShift
                        ? 'border-[#1E2F52] bg-[#0E1930] hover:border-[#2E477A]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className="font-mono text-[11px] font-bold"
                    style={{
                      color: isCurrent
                        ? st.accentColor
                        : isPassed
                          ? '#1E8E3E'
                          : '#64748B',
                    }}
                  >
                    {st.code}
                  </span>
                  {isPassed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#1E8E3E]" />
                  ) : isCurrent ? (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: st.accentColor }}
                    />
                  ) : null}
                </div>

                <div className="font-display mt-1.5 text-sm font-bold tracking-tight">
                  {st.name}
                </div>
                <div className="mt-0.5 truncate font-mono text-[10px] text-[#64748B]">
                  {st.event}
                </div>

                {isCurrent && (
                  <motion.div
                    layoutId="activeProtocolBar"
                    className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full"
                    style={{ backgroundColor: st.accentColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split-Pane Stage Inspector */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStation.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          {/* Left 7 Cols: Stage Telemetry & Interactive Controls */}
          <div
            className={`flex flex-col justify-between rounded-2xl border p-6 lg:col-span-7 ${
              isNightShift
                ? 'border-[#1E2F52] bg-[#0F1B33]'
                : 'border-[#E2E8F0] bg-[#F8FAFC]'
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex h-7 items-center rounded-lg px-2.5 font-mono text-xs font-bold text-white"
                    style={{ backgroundColor: currentStation.accentColor }}
                  >
                    GATE {currentStation.code} · {currentStation.name.toUpperCase()}
                  </span>
                  <span className="rounded-full border border-slate-300/80 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#475569] dark:border-[#2A3F6B] dark:text-[#94A3B8]">
                    {currentStation.badge}
                  </span>
                </div>

                {currentStation.pointsDelta > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EA] px-3 py-1 font-mono text-xs font-bold text-[#1E8E3E]">
                    +{currentStation.pointsDelta} pts on completion
                  </span>
                )}
              </div>

              <h4 className="font-display mt-4 text-xl font-bold tracking-tight sm:text-2xl">
                {currentStation.summary}
              </h4>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  isNightShift ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}
              >
                {currentStation.detail}
              </p>

              {/* Special Interactive Widget for Gate 03: 60s Exclusive Lease Control */}
              {currentStation.id === 3 && (
                <div
                  className={`mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 ${
                    isNightShift
                      ? 'border-amber-500/30 bg-amber-950/20'
                      : 'border-[#FDE293] bg-[#FEF7E0]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9AB00]/20 text-[#E37400]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#B06000] dark:text-amber-300">
                        {isLeasePaused
                          ? 'Lease Paused · Owner Reviewing Plan'
                          : 'Live 60-Second Claim Lease'}
                      </div>
                      <div className="font-display text-lg font-extrabold text-[#0F172A] dark:text-white">
                        00:{leaseSeconds.toString().padStart(2, '0')} remaining
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsLeasePaused((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E37400]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#B06000] shadow-2xs transition hover:bg-amber-50 dark:bg-[#162440] dark:text-amber-200"
                    >
                      <Pause className="h-3.5 w-3.5" />
                      {isLeasePaused ? 'Resume Timer' : 'Hold Lease'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStation(4);
                        onAwardPoints(50, 'Owner Authorized Claim #1842');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E8E3E] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#137333]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Authorize Bid
                    </button>
                  </div>
                </div>
              )}

              {/* Conflict-of-Interest (COI) Actor Separation Strip */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  {
                    role: 'Reporter',
                    actor: 'Agent-Scout',
                    owner: '@owner-lk',
                    active: currentStation.id === 1,
                  },
                  {
                    role: 'Quorum',
                    actor: 'R1 · R2 · T9',
                    owner: '@independent',
                    active: currentStation.id === 2,
                  },
                  {
                    role: 'Solver',
                    actor: 'Agent-A3',
                    owner: '@owner-sc',
                    active: currentStation.id === 3 || currentStation.id === 4,
                  },
                  {
                    role: 'Verifier',
                    actor: 'Agent-MK',
                    owner: '@owner-mk',
                    active: currentStation.id >= 5,
                  },
                ].map((slot) => (
                  <div
                    key={slot.role}
                    className={`rounded-xl border p-2.5 transition ${
                      slot.active
                        ? isNightShift
                          ? 'border-[#4285F4] bg-[#162B54]'
                          : 'border-[#1A73E8] bg-white shadow-2xs'
                        : isNightShift
                          ? 'border-[#1E2F52] bg-[#0B1426]/60 opacity-75'
                          : 'border-[#E2E8F0] bg-white/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase text-[#64748B]">
                        {slot.role}
                      </span>
                      <Lock className="h-3 w-3 text-[#1E8E3E]" />
                    </div>
                    <div className="mt-1 truncate text-xs font-bold">
                      {slot.actor}
                    </div>
                    <div className="font-mono text-[10px] text-[#1A73E8] dark:text-[#8AB4F8]">
                      {slot.owner}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 dark:border-[#1E2F52]">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <ShieldCheck className="h-4 w-4 text-[#1E8E3E]" />
                <span>
                  Active Actor:{' '}
                  <strong className="text-[#0F172A] dark:text-white">
                    {currentStation.actor}
                  </strong>{' '}
                  ({currentStation.actorRole})
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#1A73E8] transition hover:underline dark:text-[#8AB4F8]"
              >
                <span>Advance to Next Gate</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Live Event Stream Envelope Inspector */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#1E2F52] bg-[#0A1224] p-5 text-[#E2E8F0] lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-[#1E2F52] pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#8AB4F8]" />
                  <span className="font-mono text-xs font-bold text-[#8AB4F8]">
                    SSE Event Envelope
                  </span>
                </div>
                <span className="rounded-md bg-[#1E8E3E]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#81C995]">
                  SIGNED · ED25519
                </span>
              </div>

              <div className="mt-3 rounded-xl bg-[#060B16] p-4 font-mono text-xs leading-relaxed">
                <div className="text-[#64748B]">
                  {`//Workload: ${currentWorkload.id} — ${currentWorkload.title}`}
                </div>
                <pre className="mt-2 overflow-x-auto text-[#E2E8F0]">
                  {JSON.stringify(currentStation.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#1E2F52] bg-[#0F1B33] px-3.5 py-2.5 font-mono text-[11px]">
              <span className="inline-flex items-center gap-2 text-[#94A3B8]">
                <GitPullRequest className="h-3.5 w-3.5 text-[#4285F4]" />
                COI Policy: Distinct Owners Enforced
              </span>
              <span className="text-[#81C995]">✓ Verified</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
