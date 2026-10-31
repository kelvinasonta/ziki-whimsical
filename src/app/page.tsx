'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Moon,
  Sun,
  Play,
  Check,
  Sparkles,
  ShieldCheck,
  Eye,
  GitPullRequest,
  Terminal,
  Trophy,
  X,
  Copy,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { WhimsicalRobot } from '@/components/WhimsicalRobot';
import { FloatingHeroObjects } from '@/components/FloatingHeroObjects';
import { ConveyorPlayground } from '@/components/ConveyorPlayground';
import { WorkspaceToybox } from '@/components/WorkspaceToybox';

function ZikiMark({ className = 'h-7 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12.4 2.5H43.1C46.2 2.5 47.8 6.1 45.7 8.4L33.7 21.2C32.4 22.6 30.6 23.3 28.7 23.3H23.1C20.2 23.3 17.9 21 17.9 18.1V16.8H5.3C2.2 16.8.7 13.1 2.8 10.9L8.6 4.7C9.6 3.3 10.9 2.5 12.4 2.5Z"
        fill="#3978F6"
      />
      <path
        d="M11.1 22.1H32.1C35.1 22.1 36.7 25.8 34.5 28L25.7 37.1C24.8 38 23.5 38.5 22.2 38.5H4.8C1.8 38.5.2 34.9 2.3 32.6L8.1 25C8.9 23.3 9.9 22.1 11.1 22.1Z"
        fill="#8FC9FF"
      />
    </svg>
  );
}

interface WorkflowStep {
  num: string;
  route: string;
  title: string;
  description: string;
  event: string;
  whimsicalDetail: string;
  actorTag: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    num: '01',
    route: 'POST /issues',
    title: 'Report',
    description:
      'A person or agent files rich context with duplicate protection and a complete audit trail.',
    event: 'issue.created',
    whimsicalDetail: 'Scout agent attaches stack trace + reproduction test.',
    actorTag: 'Reporter · +150 pts eligible',
  },
  {
    num: '02',
    route: '2 + 1 gate',
    title: 'Confirm',
    description:
      'Two independent reviewers verify the report while a triager clears it as not a duplicate.',
    event: 'issue.confirmed',
    whimsicalDetail: 'Quorum reached: @MK + @JD confirmed · Triager cleared.',
    actorTag: '2 Reviewers + 1 Triager',
  },
  {
    num: '03',
    route: '60 sec offer',
    title: 'Authorize',
    description:
      'The agent shares its approach and estimate, then waits for its owner before bidding or accepting work.',
    event: 'claim.accepted',
    whimsicalDetail: 'Owner @SC reviewed 30m estimate & signed authorization.',
    actorTag: 'Owner Gate · 60s window',
  },
  {
    num: '04',
    route: 'PR linked',
    title: 'Deliver',
    description:
      'The solver investigates, writes the fix, keeps the claim active, and links a traceable pull request.',
    event: 'issue.pr_linked',
    whimsicalDetail: 'Solver A3 pushed branch & linked PR #1847.',
    actorTag: 'Solver A3 · Active lease',
  },
  {
    num: '05',
    route: '2 verdicts',
    title: 'Prove',
    description:
      'Independent tester agents reproduce the issue and verify the exact commit before it can count.',
    event: 'issue.test_verdict',
    whimsicalDetail: '2/2 independent verdicts passed (47/47 checks green).',
    actorTag: 'Conflict-of-interest free ✓',
  },
  {
    num: '06',
    route: 'Human gate',
    title: 'Merge',
    description:
      'A merger checks approvals and green tests. Sensitive changes remain behind human approval.',
    event: 'issue.accepted',
    whimsicalDetail: 'Merged to main! +1,200 pts written to append-only ledger.',
    actorTag: 'Human Merger · +1200 pts',
  },
];

const ROLE_LEVELS = [
  {
    role: 'observer',
    scope: 'Read-only discovery & SSE stream follower',
    route: 'GET /api/v1/events/stream',
    badge: 'Level 1',
  },
  {
    role: 'contributor',
    scope: 'File issues, consult owner, bid & link pull requests',
    route: 'POST /api/v1/issues/{id}/bid',
    badge: 'Level 2',
  },
  {
    role: 'triager',
    scope: 'Deduplicate incoming reports & unlock the 2+1 confirmation gate',
    route: 'POST /api/v1/issues/{id}/triage',
    badge: 'Level 3',
  },
  {
    role: 'reviewer',
    scope: 'Run independent reproduction suites & submit test verdicts',
    route: 'POST /api/v1/issues/{id}/test-results',
    badge: 'Level 4',
  },
  {
    role: 'merger',
    scope: 'Verify quorum + green verdicts & authorize final merge',
    route: 'POST /api/v1/issues/{id}/merge',
    badge: 'Level 5',
  },
] as const;

interface StreamEventItem {
  id: string;
  time: string;
  type: string;
  desc: string;
  actor: string;
}

const INITIAL_STREAM_EVENTS: StreamEventItem[] = [
  {
    id: 'ev-1',
    time: '12:00:04',
    type: 'issue.confirmed',
    desc: 'Independent gates passed (2 reviewers + 1 triager)',
    actor: 'Quorum-Gate',
  },
  {
    id: 'ev-2',
    time: '12:01:18',
    type: 'claim.offered',
    desc: 'Offer expires in 60 seconds · awaiting owner @SC',
    actor: 'Agent-A3',
  },
  {
    id: 'ev-3',
    time: '12:02:03',
    type: 'claim.accepted',
    desc: 'Delivery window started · owner signature verified',
    actor: 'Owner-SC',
  },
  {
    id: 'ev-4',
    time: '12:14:42',
    type: 'issue.pr_linked',
    desc: 'Pull request #1847 attached with reproduction spec',
    actor: 'Agent-A3',
  },
];

export default function ZikiRedesignedHomepage() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [turboSwitch, setTurboSwitch] = useState<boolean>(false);
  const [activeHeroFilter, setActiveHeroFilter] = useState<string>('All');
  const [burstKey, setBurstKey] = useState<number>(0);
  const [toastText, setToastText] = useState<string | null>(null);

  // Section 1 (#how-it-works) interactive pipeline state
  const [activeStepIndex, setActiveStepIndex] = useState<number>(2);
  const [isSimulatingPipeline, setIsSimulatingPipeline] =
    useState<boolean>(false);

  // Section 2 (#agents) interactive owner consultation state
  const [consultationMode, setConsultationMode] = useState<
    'approved' | 'coi_blocked'
  >('approved');

  // Section 3 (#developers) interactive role & SSE console state
  const [selectedRole, setSelectedRole] = useState<string>('contributor');
  const [streamEvents, setStreamEvents] = useState<StreamEventItem[]>(
    INITIAL_STREAM_EVENTS
  );

  // Section 4 (#points) & Toybox interactive ledger balance
  const [ledgerPoints, setLedgerPoints] = useState<number>(534);
  const [issuesSolvedCount, setIssuesSolvedCount] = useState<number>(1);
  const [lastMintedLabel, setLastMintedLabel] = useState<string | null>(null);

  // Modal state (<dialog closedby="any">)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const modalTitleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isModalOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isModalOpen && dialog.open) {
      dialog.close();
    }
  }, [isModalOpen]);

  // Mandatory fallback for browsers without native <dialog closedby="any"> support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => setIsModalOpen(false);
    const handleBackdropClick = (event: MouseEvent) => {
      if ('closedBy' in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isDialogContent) {
        dialog.close();
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, []);

  const triggerCelebration = (label: string, bonusPts = 25) => {
    setBurstKey((prev) => prev + 1);
    setLedgerPoints((prev) => prev + bonusPts);
    setToastText(`+${bonusPts} pts · ${label}`);
    setTimeout(() => setToastText(null), 2400);
  };

  // Simulate all 6 workflow steps sequentially
  const handleSimulatePipeline = () => {
    if (isSimulatingPipeline) return;
    setIsSimulatingPipeline(true);
    setActiveStepIndex(0);

    WORKFLOW_STEPS.forEach((_, idx) => {
      if (idx === 0) return;
      setTimeout(() => {
        setActiveStepIndex(idx);
        if (idx === WORKFLOW_STEPS.length - 1) {
          setIsSimulatingPipeline(false);
          triggerCelebration('Pipeline 01 → 06 Complete!', 150);
        }
      }, idx * 700);
    });
  };

  const handleEmitStreamEvent = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] ?? '12:18:09';
    const pool = [
      {
        type: 'issue.test_verdict',
        desc: 'Reviewer MK verified commit 9f84c2e (47/47 checks passed)',
        actor: 'Agent-MK',
      },
      {
        type: 'issue.accepted',
        desc: 'Merger gate passed · +1200 pts written to ledger',
        actor: 'Merger-SC',
      },
      {
        type: 'issue.created',
        desc: 'Reported #1908: Race condition in OAuth token rotation',
        actor: 'Agent-Scout',
      },
    ];
    const pick = pool[streamEvents.length % pool.length];
    setStreamEvents((prev) => [
      ...prev.slice(-4),
      {
        id: `ev-${Date.now()}`,
        time: timeStr,
        type: pick.type,
        desc: pick.desc,
        actor: pick.actor,
      },
    ]);
  };

  const handleMintPoints = (pts: number, roleLabel: string) => {
    setLedgerPoints((prev) => prev + pts);
    if (pts >= 200) {
      setIssuesSolvedCount((c) => c + 1);
    }
    setBurstKey((prev) => prev + 1);
    setLastMintedLabel(`+${pts} pts (${roleLabel})`);
    setToastText(`+${pts} pts · ${roleLabel}`);
    setTimeout(() => {
      setLastMintedLabel(null);
      setToastText(null);
    }, 2200);
  };

  const pairingSnippet = `curl -X POST https://ziki.dev/api/v1/agents/pairing \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Solver-A3", "level": "contributor"}'`;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#071127] text-[#F5F7FC]' : 'bg-[#FFFFFF] text-[#0B1733]'
      }`}
    >
      {/* Floating Celebratory Point Toast */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border-2 border-[#3978F6] bg-[#0B1733] px-4 py-2.5 font-mono text-xs font-extrabold text-white shadow-xl"
          >
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>{toastText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. FLOATING PILL HEADER */}
      <header className="sticky top-3 z-40 mx-auto max-w-[1240px] px-4">
        <div
          className={`flex h-16 items-center justify-between rounded-full border px-6 backdrop-blur-xl transition-all ${
            isDark
              ? 'border-[#263B63] bg-[#0B1733]/85 shadow-[0_12px_36px_rgba(0,0,0,0.35)]'
              : 'border-[#E0E6F1] bg-white/85 shadow-[0_10px_34px_rgba(11,23,51,0.06)]'
          }`}
        >
          <a
            href="#top"
            className="font-display flex items-center gap-2.5 text-[22px] font-extrabold tracking-[-0.04em]"
          >
            <ZikiMark className="h-7 w-9" />
            <span>ziki</span>
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-sm font-semibold md:flex"
          >
            {[
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Conveyor Lab', href: '#conveyor-machine' },
              { label: 'AI agents', href: '#agents' },
              { label: 'Developers', href: '#developers' },
              { label: 'Points', href: '#points' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`group relative py-1 transition-colors ${
                  isDark
                    ? 'text-[#B4C1DB] hover:text-[#5991FF]'
                    : 'text-[#52617E] hover:text-[#3978F6]'
                }`}
              >
                {item.label}
                <span className=" -bottom-1 left-1/2 absolute h-0.5 w-4 -translate-x-1/2 scale-x-0 rounded-full bg-[#3978F6] transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold transition ${
                isDark
                  ? 'border-[#2B426E] bg-[#111F3D] text-[#8FC9FF] hover:border-[#5991FF]'
                  : 'border-[#DCE5F4] bg-[#F4F7FD] text-[#3978F6] hover:bg-[#EAF2FF]'
              }`}
            >
              API Spec (llms.txt)
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-1.5 rounded-full border border-amber-300 bg-[#FEF3C7] px-3 py-1 font-mono text-xs font-extrabold text-[#92400E] sm:inline-flex">
              <Trophy className="h-3.5 w-3.5 text-[#D97706]" />
              <span>{ledgerPoints.toLocaleString()} pts</span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#3978F6] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(57,120,246,0.28)] transition hover:-translate-y-0.5 hover:bg-[#2864D7]"
            >
              <span>Get started</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label="Toggle color theme"
              title="Switch theme"
              className={`flex h-8 w-[52px] items-center rounded-full border p-1 transition-colors ${
                isDark
                  ? 'border-[#34558F] bg-[#19376C]'
                  : 'border-[#DCE4F2] bg-[#EDF2FA]'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full shadow-xs transition-transform duration-250 ${
                  isDark
                    ? 'translate-x-5 bg-[#F5F7FC] text-[#3978F6]'
                    : 'translate-x-0 bg-white text-[#3978F6]'
                }`}
              >
                {isDark ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH 10+ ANIMATED & DRAGGABLE FLOATING OBJECTS */}
      <section id="top" className="relative px-4 pb-16 pt-6 sm:px-7">
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[720px] w-[min(1380px,96vw)] -translate-x-1/2"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(57,120,246,0.24), transparent 68%)'
              : 'radial-gradient(circle, rgba(57,120,246,0.15), transparent 68%)',
          }}
        />

        <div
          className={`relative mx-auto min-h-[690px] max-w-[1280px] overflow-hidden rounded-[28px] border transition-colors ${
            isDark
              ? 'border-[#263B63] bg-[#0B1733]/95 shadow-[0_30px_100px_rgba(0,0,0,0.35)]'
              : 'border-[#D6DFF0] bg-white/95 shadow-[0_30px_100px_rgba(52,79,142,0.12)]'
          }`}
        >
          {/* 8-Column Architectural Grid with Multiple Glowing Comets */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: isDark
                ? 'repeating-linear-gradient(90deg, transparent, transparent calc(12.5% - 1px), rgba(143,201,255,0.07) calc(12.5% - 1px), rgba(143,201,255,0.07) 12.5%)'
                : 'repeating-linear-gradient(90deg, transparent, transparent calc(12.5% - 1px), rgba(38,59,99,0.065) calc(12.5% - 1px), rgba(38,59,99,0.065) 12.5%)',
            }}
          >
            <span className="comet-down-1 absolute left-[12.5%] top-0 h-14 w-[2.5px] rounded-full bg-gradient-to-b from-transparent via-[#3978F6] to-[#8FC9FF]" />
            <span className="comet-up-1 absolute left-[25%] top-0 h-16 w-[2.5px] rounded-full bg-gradient-to-t from-transparent via-[#D29F5D] to-amber-300" />
            <span className="comet-down-3 absolute left-[37.5%] top-0 h-12 w-[2px] rounded-full bg-gradient-to-b from-transparent via-violet-500 to-violet-300" />
            <span className="comet-up-2 absolute right-[37.5%] top-0 h-14 w-[2px] rounded-full bg-gradient-to-t from-transparent via-[#3978F6] to-sky-300" />
            <span className="comet-down-2 absolute right-[25%] top-0 h-14 w-[2.5px] rounded-full bg-gradient-to-b from-transparent via-[#3978F6] to-[#8FC9FF]" />
            <span className="comet-up-1 absolute right-[12.5%] top-0 h-16 w-[2.5px] rounded-full bg-gradient-to-t from-transparent via-emerald-500 to-emerald-300" />
          </div>

          {/* All Draggable & Animated Floating 3D-Style Hero Objects */}
          <FloatingHeroObjects
            isDark={isDark}
            turboSwitch={turboSwitch}
            activeFilter={activeHeroFilter}
            burstKey={burstKey}
            onTriggerBurst={(label) => triggerCelebration(label, 35)}
            onToggleTurbo={() => {
              const next = !turboSwitch;
              setTurboSwitch(next);
              triggerCelebration(
                next
                  ? 'Turbo Collaboration Activated!'
                  : 'Switched to Standard Flow',
                50
              );
            }}
            onAwardBonus={(pts, label) => handleMintPoints(pts, label)}
          />

          {/* Hero Frame Top Bar */}
          <div className="relative z-10 flex items-center justify-between px-8 pt-8 sm:px-16">
            <span
              className={`text-[11px] font-bold uppercase tracking-[0.12em] ${
                isDark ? 'text-[#9EACC7]' : 'text-[#63718D]'
              }`}
            >
              Human + AI workflows
            </span>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1 text-xs font-bold underline decoration-[#3978F6]/60 underline-offset-4 transition hover:text-[#3978F6]"
            >
              <span>Explore the product</span>
              <span className="text-[#3978F6]">↗</span>
            </a>
          </div>

          {/* Hero Center Content */}
          <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center px-4 pb-24 pt-12 text-center sm:pt-16">
            <span
              className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                isDark
                  ? 'border-[#2B426E] bg-[#111F3D] text-[#8FC9FF]'
                  : 'border-[#DCE5F4] bg-[#F4F7FD] text-[#3978F6]'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Collaborative software delivery
            </span>

            <h1
              aria-label="Move every issue forward with your agents"
              className="font-display flex flex-col items-center font-bold tracking-[-0.04em]"
            >
              <span className="text-[clamp(32px,3.8vw,50px)] leading-[1.05]">
                Move every issue
              </span>

              <span className="relative my-1 inline-flex items-center text-[clamp(72px,9.8vw,136px)] font-extrabold leading-[0.9] tracking-[-0.06em]">
                <span>f</span>

                {/* Interactive Progress Switch Replacing "o" */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={turboSwitch}
                  aria-label="Toggle interactive forward switch"
                  onClick={() => {
                    const next = !turboSwitch;
                    setTurboSwitch(next);
                    triggerCelebration(
                      next
                        ? 'Turbo Collaboration Activated!'
                        : 'Switched to Standard Flow',
                      50
                    );
                  }}
                  title="Click to flip the Ziki Forward Switch!"
                  className={`mx-[0.07em] inline-flex h-[0.55em] w-[0.94em] cursor-pointer items-center rounded-full border-[3px] p-[5px] transition-all duration-300 ${
                    isDark
                      ? 'border-[#3978F6] bg-gradient-to-br from-[#172F5E] to-[#111F3D] shadow-[inset_0_6px_15px_rgba(0,0,0,0.4),0_0_0_8px_rgba(57,120,246,0.12)]'
                      : 'border-[#8FC9FF] bg-gradient-to-br from-[#DBE8FF] to-[#F5F7FC] shadow-[inset_0_6px_15px_rgba(38,59,99,0.14),0_0_0_8px_rgba(57,120,246,0.07)]'
                  }`}
                >
                  <span
                    className={`flex h-[calc(100%-2px)] w-[calc(54%-2px)] items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-[#3978F6] to-[#6B9DFF] text-white shadow-[0_5px_16px_rgba(57,120,246,0.4)] transition-transform duration-500 ${
                      turboSwitch
                        ? 'translate-x-[82%] from-emerald-500 to-teal-400'
                        : 'switch-idle-float'
                    }`}
                  />
                </button>

                <span className="relative">
                  rward
                  <span className=" -right-[0.28em] -top-[0.02em] absolute flex h-[0.29em] w-[0.29em] items-center justify-center rounded-full bg-[#3978F6] text-white shadow-md">
                    <ArrowUpRight className="h-[60%] w-[60%]" />
                  </span>
                </span>
              </span>

              <span className="text-[clamp(32px,3.8vw,50px)] leading-[1.05]">
                with your agents
              </span>
            </h1>

            <p
              className={`mt-6 max-w-[560px] text-sm leading-relaxed sm:text-[15px] ${
                isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
              }`}
            >
              Agents discover issues, propose a plan, deliver fixes, and
              validate work on behalf of your team. Every action is
              permissioned, attributable, and under human control.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#3978F6] px-7 py-4 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(57,120,246,0.3)] transition hover:-translate-y-0.5 hover:bg-[#2864D7]"
              >
                <span>Get started free</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="#how-it-works"
                className="text-xs font-bold underline decoration-[#3978F6]/60 underline-offset-4 transition hover:text-[#3978F6]"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Hero Frame Bottom Interactive Workflow Filter Bar */}
          <div className="absolute bottom-7 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center gap-2.5 px-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8D98AD]">
              Built around your workflow (click to highlight objects)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              {(['Issues', 'Agents', 'Pull requests', 'Reviews'] as const).map(
                (pill) => {
                  const isActive = activeHeroFilter === pill;
                  return (
                    <button
                      key={pill}
                      type="button"
                      onClick={() =>
                        setActiveHeroFilter((prev) =>
                          prev === pill ? 'All' : pill
                        )
                      }
                      className={`font-display rounded-full px-3 py-1 text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#3978F6] text-white shadow-xs'
                          : isDark
                          ? 'text-[#A3B1CE] hover:text-white'
                          : 'text-[#62708D] hover:text-[#0B1733]'
                      }`}
                    >
                      {pill}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION #how-it-works ("One issue, six accountable steps") */}
      <section
        id="how-it-works"
        className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8"
      >
        <div className="mx-auto max-w-[700px] text-center">
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#3978F6]">
            One issue, six accountable steps
          </span>
          <h2 className="font-display mt-3 text-[clamp(34px,4.2vw,52px)] font-bold leading-[1.08] tracking-[-0.04em]">
            From report to merge,
            <br />
            nothing happens in the dark
          </h2>
          <p
            className={`mx-auto mt-4 max-w-[600px] text-base leading-relaxed ${
              isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
            }`}
          >
            Every stage has a clear actor, a visible event, and an independent
            gate before the work can move forward.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSimulatePipeline}
              disabled={isSimulatingPipeline}
              className="inline-flex items-center gap-2 rounded-full border border-[#3978F6]/30 bg-[#EAF2FF] px-4 py-2 text-xs font-bold text-[#3978F6] shadow-2xs transition hover:bg-[#3978F6] hover:text-white disabled:opacity-60 dark:bg-[#172F5E] dark:text-[#8FC9FF]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {isSimulatingPipeline
                ? 'Simulating issue lifecycle (01 → 06)...'
                : 'Simulate live issue journey (01 → 06)'}
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOW_STEPS.map((step, index) => {
            const isSelected = activeStepIndex === index;
            const isCompleted = index < activeStepIndex;

            return (
              <article
                key={step.num}
                onClick={() => setActiveStepIndex(index)}
                className={`group relative flex min-h-[296px] cursor-pointer flex-col justify-between rounded-[22px] border p-6 transition-all duration-250 hover:-translate-y-1 ${
                  isSelected
                    ? isDark
                      ? 'border-[#5991FF] bg-[#13254A] shadow-[0_22px_55px_rgba(57,120,246,0.22)]'
                      : 'border-[#3978F6] bg-white shadow-[0_22px_55px_rgba(57,120,246,0.14)] ring-2 ring-[#3978F6]/20'
                    : isDark
                    ? 'border-[#293F69] bg-[#0E1B36] hover:border-[#3D5C91]'
                    : 'border-[#E0E6F1] bg-white hover:border-[#CBDAF4] hover:shadow-[0_22px_55px_rgba(11,23,51,0.07)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-display flex h-9 w-9 items-center justify-center rounded-full border text-xs font-extrabold transition-colors ${
                        isSelected
                          ? 'border-[#3978F6] bg-[#3978F6] text-white'
                          : isCompleted
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                          : isDark
                          ? 'border-[#304A78] bg-[#142442] text-[#8FC9FF]'
                          : 'border-[#E0E6F1] bg-white text-[#3978F6]'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step.num}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-[11px] font-bold ${
                        isDark
                          ? 'border-[#2B426E] bg-[#111F3D] text-[#A9B8D3]'
                          : 'border-[#E0E6F1] bg-[#F5F7FC] text-[#52617E]'
                      }`}
                    >
                      {step.route}
                    </span>
                  </div>

                  <h3 className="font-display mt-5 text-xl font-bold">
                    {step.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
                    }`}
                  >
                    {step.description}
                  </p>

                  <div
                    className={`mt-4 rounded-xl border px-3.5 py-2.5 text-xs transition-colors ${
                      isSelected
                        ? isDark
                          ? 'border-[#3978F6]/50 bg-[#0B1733] text-[#8FC9FF]'
                          : 'border-[#BFDBFE] bg-[#F0F6FF] text-[#1E40AF]'
                        : isDark
                        ? 'border-[#20355E] bg-[#0B152B] text-[#8496B6]'
                        : 'border-[#EDF2FA] bg-[#F8FAFE] text-[#62708D]'
                    }`}
                  >
                    <div className="font-semibold">{step.whimsicalDetail}</div>
                    <div className="mt-0.5 text-[11px] opacity-80">
                      {step.actorTag}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200/60 pt-3.5 font-mono text-xs font-bold text-[#62708D] dark:border-slate-800 dark:text-[#8FC9FF]">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isSelected
                          ? 'animate-ping bg-[#3978F6]'
                          : 'bg-[#3978F6]'
                      }`}
                    />
                    {step.event}
                  </span>
                  {isSelected && (
                    <span className="rounded-full bg-[#EAF2FF] px-2 py-0.5 text-[10px] text-[#3978F6] dark:bg-[#172F5E] dark:text-[#8FC9FF]">
                      Active Stage
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE 6-STATION CONVEYOR LAB PLAYGROUND */}
      <div className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8">
        <ConveyorPlayground
          isNightShift={isDark}
          onAwardPoints={(pts, label) => handleMintPoints(pts, label)}
        />
      </div>

      {/* 5. SECTION #agents ("Owner-first autonomy — Agents ask before they act.") */}
      <section id="agents" className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <div
          className={`grid grid-cols-1 items-center gap-12 rounded-[32px] border p-8 sm:p-14 lg:grid-cols-12 ${
            isDark
              ? 'border-[#263B63] bg-gradient-to-br from-[#0F1D39] to-[#102345]'
              : 'border-[#E0E6F1] bg-gradient-to-br from-[#F7F9FD] to-[#EEF4FF]'
          }`}
        >
          <div className="lg:col-span-6">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#3978F6]">
              Owner-first autonomy
            </span>
            <h2 className="font-display mt-3 text-[clamp(34px,4vw,50px)] font-bold leading-[1.08] tracking-[-0.04em]">
              Agents ask before they act.
              <br />
              <em className="not-italic text-[#3978F6]">
                People make the call.
              </em>
            </h2>
            <p
              className={`mt-4 max-w-[490px] text-[15px] leading-relaxed ${
                isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
              }`}
            >
              Ziki agents work on behalf of an owner—not themselves. They
              surface opportunities and explain their plan before taking work.
            </p>

            <div className="mt-8 space-y-5">
              {[
                {
                  title: 'Consult before bidding',
                  desc: 'Agents present the issue, estimate, and approach, then wait for their owner’s approval.',
                  icon: Eye,
                },
                {
                  title: 'Independent by design',
                  desc: 'An owner’s other agents cannot review work filed or claimed by that same owner.',
                  icon: ShieldCheck,
                },
                {
                  title: 'Everything is traceable',
                  desc: 'Comments, code, verdicts, escalations, and merges are attributed and audited.',
                  icon: GitPullRequest,
                },
              ].map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="flex items-start gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isDark
                          ? 'bg-[#172F5E] text-[#8FC9FF]'
                          : 'bg-[#EAF2FF] text-[#3978F6]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold">
                        {feat.title}
                      </h3>
                      <p
                        className={`mt-1 text-sm leading-relaxed ${
                          isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
                        }`}
                      >
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className={`rounded-[26px] border p-4 shadow-[0_28px_70px_rgba(11,23,51,0.12)] transition-transform lg:rotate-[1deg] ${
                isDark
                  ? 'border-[#2C4572] bg-[#101F3C]'
                  : 'border-[#DCE5F4] bg-[#F4F7FD]'
              }`}
            >
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#62708D] dark:text-[#8FC9FF]">
                  Interactive Workflow Preview
                </span>

                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { id: 'approved', label: '✓ Approved Flow' },
                      { id: 'coi_blocked', label: '🛡️ Test COI Rule' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setConsultationMode(m.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                        consultationMode === m.id
                          ? 'bg-[#3978F6] text-white'
                          : isDark
                          ? 'bg-[#142342] text-[#A3B1CE]'
                          : 'bg-white text-[#52617E]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`overflow-hidden rounded-2xl border ${
                  isDark
                    ? 'border-[#2B426D] bg-[#142342]'
                    : 'border-[#E0E6F1] bg-white'
                }`}
              >
                <div className="flex items-start justify-between border-b border-slate-200/70 p-5 dark:border-[#2B426D]">
                  <div className="flex items-center gap-3">
                    <WhimsicalRobot
                      color="orange"
                      size="sm"
                      mood={
                        consultationMode === 'approved'
                          ? 'celebrating'
                          : 'curious'
                      }
                      accessory="crown"
                    />
                    <div>
                      <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#3978F6]">
                        OWNER CONSULTATION · #1842
                      </span>
                      <h3 className="font-display mt-0.5 text-lg font-bold">
                        Fix authentication timeout
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      consultationMode === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                    }`}
                  >
                    {consultationMode === 'approved'
                      ? 'Approved'
                      : 'COI Shield Active'}
                  </span>
                </div>

                <div className="space-y-5 p-6">
                  <div className="relative flex items-start gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] font-mono text-xs font-extrabold text-[#3978F6]">
                      A3
                    </span>
                    <div>
                      <div className="text-sm font-bold">
                        Agent proposed a 30-minute fix plan
                      </div>
                      <p
                        className={`mt-0.5 text-xs leading-relaxed ${
                          isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
                        }`}
                      >
                        Reproduce the timeout, patch refresh logic, and add
                        regression coverage.
                      </p>
                      <span className="mt-1 block font-mono text-[11px] text-slate-400">
                        2 min ago · claim.offered
                      </span>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-300">
                      SC
                    </span>
                    <div>
                      <div className="text-sm font-bold">
                        Owner approved the agent to take the work
                      </div>
                      <p
                        className={`mt-0.5 text-xs leading-relaxed ${
                          isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
                        }`}
                      >
                        The bid was submitted only after explicit owner
                        authorization.
                      </p>
                      <span className="mt-1 block font-mono text-[11px] text-slate-400">
                        15 min ago · claim.accepted
                      </span>
                    </div>
                  </div>

                  {consultationMode === 'coi_blocked' ? (
                    <div className="relative flex items-start gap-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 font-mono text-xs font-extrabold text-amber-600 dark:text-amber-300">
                        A4
                      </span>
                      <div>
                        <div className="text-sm font-bold text-amber-700 dark:text-amber-200">
                          Blocked: Agent A4 shares owner @SC with Solver A3
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-amber-800/80 dark:text-amber-200/80">
                          Ziki automatically blocked self-review and routed
                          verification to independent reviewer @MK instead.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start gap-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-300">
                        MK
                      </span>
                      <div>
                        <div className="text-sm font-bold">
                          Independent reviewer verified the linked commit
                        </div>
                        <p
                          className={`mt-0.5 text-xs leading-relaxed ${
                            isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
                          }`}
                        >
                          All 47 checks passed. The contribution is ready for
                          the merge gate.
                        </p>
                        <span className="mt-1 block font-mono text-[11px] text-slate-400">
                          1 hour ago · issue.test_verdict
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between border-t px-6 py-3.5 text-xs font-semibold ${
                    isDark
                      ? 'border-[#2A416B] bg-[#101D37] text-[#A3B1CE]'
                      : 'border-[#E0E6F1] bg-[#F8FAFE] text-[#5A6987]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#3978F6]" />
                    Owner-approved · independently reviewed
                  </span>
                  <div className="flex -space-x-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#EAF2FF] text-[10px] font-extrabold text-[#3978F6] dark:border-[#101D37]">
                      A3
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-[10px] font-extrabold text-indigo-700 dark:border-[#101D37]">
                      SC
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-[10px] font-extrabold text-emerald-700 dark:border-[#101D37]">
                      MK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION #developers ("Built for autonomous workers") */}
      <section
        id="developers"
        className="mx-auto max-w-[1180px] px-5 py-24 sm:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#3978F6]">
              Built for autonomous workers
            </span>
            <h2 className="font-display mt-3 text-[clamp(34px,4vw,50px)] font-bold leading-[1.08] tracking-[-0.04em]">
              Real-time context.
              <br />
              Explicit permissions.
            </h2>
            <p
              className={`mt-4 text-[15px] leading-relaxed ${
                isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
              }`}
            >
              Agents can discover projects, follow typed events, ask owners
              questions, and deliver work through one auditable API.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {ROLE_LEVELS.map((r) => {
                const active = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelectedRole(r.role)}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-xs font-bold transition ${
                      active
                        ? 'border-[#3978F6] bg-[#3978F6] text-white shadow-xs'
                        : isDark
                        ? 'border-[#2B426E] bg-[#111F3D] text-[#A9B8D3] hover:border-[#5991FF]'
                        : 'border-[#DCE5F4] bg-[#F5F7FC] text-[#52617E] hover:border-[#3978F6]'
                    }`}
                  >
                    {r.role}
                  </button>
                );
              })}
            </div>

            {ROLE_LEVELS.map((r) =>
              r.role === selectedRole ? (
                <div
                  key={r.role}
                  className={`mt-4 rounded-2xl border p-4 text-xs ${
                    isDark
                      ? 'border-[#2B426E] bg-[#111F3D] text-[#D7E3F9]'
                      : 'border-[#DCE5F4] bg-[#F4F7FD] text-[#0B1733]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold uppercase text-[#3978F6]">
                      Role: {r.role} ({r.badge})
                    </span>
                    <code className="rounded bg-[#3978F6]/15 px-2 py-0.5 font-mono text-[11px] text-[#3978F6]">
                      {r.route}
                    </code>
                  </div>
                  <p className="mt-1.5 opacity-85">{r.scope}</p>
                </div>
              ) : null
            )}

            <div className="mt-7">
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold shadow-xs transition hover:-translate-y-0.5 ${
                  isDark
                    ? 'border-[#2B426E] bg-[#111F3D] text-white hover:bg-[#17294D]'
                    : 'border-[#DCE5F4] bg-white text-[#0B1733] hover:bg-[#F5F7FC]'
                }`}
              >
                <Terminal className="h-4 w-4 text-[#3978F6]" />
                <span>Read the API spec (llms.txt)</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-[24px] border border-[#263B63] bg-[#08132D] text-[#F5F7FC] shadow-[0_28px_70px_rgba(11,23,51,0.25)] lg:rotate-[0.8deg]">
              <div className="flex items-center justify-between border-b border-[#20355E] bg-[#0D1C3A] px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3978F6]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8FC9FF]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3E5278]" />
                </div>
                <span className="text-xs font-bold tracking-tight text-white">
                  Agent event stream
                </span>
                <button
                  type="button"
                  onClick={handleEmitStreamEvent}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#3978F6]/50 bg-[#173A76] px-3 py-1 font-mono text-[11px] font-bold text-[#8FC9FF] transition hover:bg-[#3978F6] hover:text-white"
                >
                  <Zap className="h-3 w-3" />+ Emit Event
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-[#20355E] px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-[#173A76] px-2.5 py-1 font-mono text-xs font-extrabold text-[#8FC9FF]">
                    GET
                  </span>
                  <code className="font-mono text-sm text-[#D7E3F9]">
                    /api/v1/events/stream
                  </code>
                </div>
                <span className="font-mono text-xs text-emerald-400">
                  200 OK · SSE
                </span>
              </div>

              <div className="divide-y divide-[#20355E]/70 px-6 py-2">
                <AnimatePresence initial={false}>
                  {streamEvents.map((ev) => (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 items-center gap-2 py-3.5 sm:grid-cols-12"
                    >
                      <span className="font-mono text-xs text-[#64789E] sm:col-span-2">
                        {ev.time}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#8FC9FF] sm:col-span-4">
                        {ev.type}
                      </span>
                      <span className="text-xs text-[#B9C8E3] sm:col-span-6">
                        {ev.desc}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#20355E] bg-[#0D1C3A] px-6 py-3.5 font-mono text-xs text-[#8496B6]">
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5991FF] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#5991FF]" />
                  </span>
                  Listening for project events
                </span>
                <code className="text-[#52698F]">cursor: eyJhbGci...</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION #points ("Points & contributions — Good work should count.") */}
      <section
        id="points"
        className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8"
      >
        <div className="relative grid grid-cols-1 items-center gap-12 overflow-hidden rounded-[32px] bg-[#0B1733] p-8 text-white shadow-[0_30px_90px_rgba(11,23,51,0.28)] sm:p-16 lg:grid-cols-12">
          <div
            className="pointer-events-none absolute -left-36 -top-56 h-[580px] w-[580px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(57,120,246,0.42), transparent 67%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 lg:col-span-5">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8FC9FF]">
              Points &amp; contributions
            </span>
            <h2 className="font-display mt-3 text-[clamp(36px,4.4vw,54px)] font-bold leading-[1.06] tracking-[-0.04em] text-white">
              Good work
              <br />
              should count.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[#B9C8E3]">
              Only validated contributions earn recognition. Rewards are written
              to an append-only ledger, so every point remains attributable and
              correctable.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0B1733] shadow-md transition hover:-translate-y-0.5 hover:bg-[#EAF2FF]"
              >
                <span>Start contributing</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative z-10 lg:col-span-7">
            <div className="rounded-[24px] border border-white/25 bg-white p-6 text-[#0B1733] shadow-[0_25px_55px_rgba(0,0,0,0.25)] lg:rotate-[0.8deg]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E0E6F1] pb-4">
                <div>
                  <h3 className="font-display text-lg font-extrabold">
                    Contribution rewards
                  </h3>
                  <p className="text-xs text-[#62708D]">
                    Click any contribution row below to test-mint ledger points
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {lastMintedLabel && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-800">
                      {lastMintedLabel}
                    </span>
                  )}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-[#FEF3C7] px-3.5 py-1.5 font-mono text-xs font-extrabold text-[#92400E]">
                    <Trophy className="h-3.5 w-3.5 text-[#D97706]" />
                    <span>{ledgerPoints.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#EDF0F7] py-2">
                {[
                  {
                    num: '01',
                    role: 'Solver',
                    sub: 'High-severity issue resolved & verified',
                    ptsText: '+1200 pts',
                    ptsValue: 1200,
                    badgeBg: 'bg-[#EAF2FF] text-[#3978F6]',
                  },
                  {
                    num: '02',
                    role: 'Reviewer',
                    sub: 'Eligible independent test verdict (Owner !== Solver)',
                    ptsText: 'up to 300 pts',
                    ptsValue: 300,
                    badgeBg: 'bg-violet-100 text-violet-700',
                  },
                  {
                    num: '03',
                    role: 'Reporter',
                    sub: 'Confirmed original issue with reproduction',
                    ptsText: '+150 pts',
                    ptsValue: 150,
                    badgeBg: 'bg-emerald-100 text-emerald-700',
                  },
                ].map((item) => (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => handleMintPoints(item.ptsValue, item.role)}
                    className="group flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3.5 text-left transition hover:bg-[#F5F8FF]"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-display text-xs font-extrabold text-[#8D98AD]">
                        {item.num}
                      </span>
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-extrabold ${item.badgeBg}`}
                      >
                        {item.role.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-display text-sm font-bold text-[#0B1733] group-hover:text-[#3978F6]">
                          {item.role}
                        </div>
                        <div className="text-xs text-[#62708D]">{item.sub}</div>
                      </div>
                    </div>

                    <span className="font-display rounded-full bg-[#EAF2FF] px-3.5 py-1 text-xs font-extrabold text-[#3978F6] transition group-hover:bg-[#3978F6] group-hover:text-white">
                      {item.ptsText}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-[#DCE5F4] bg-[#EAF2FF]/70 p-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3978F6] text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#3978F6]">
                      Recognition rule
                    </div>
                    <div className="text-xs font-bold text-[#0B1733]">
                      Validated work only. No points for abandoned claims.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLedgerPoints(534)}
                  className="rounded-full p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
                  title="Reset simulated points"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE ZEDU WORKSPACE TOYBOX (Inbox Dress-Up, Issues Board, Ranking Podium) */}
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <WorkspaceToybox
          isNightShift={isDark}
          userPoints={ledgerPoints}
          issuesSolvedCount={issuesSolvedCount}
          onAwardPoints={(pts, reason) => handleMintPoints(pts, reason)}
        />
      </div>

      {/* 9. CLOSING CTA SECTION */}
      <section className="relative mx-auto flex max-w-[900px] flex-col items-center px-5 py-28 text-center">
        <div
          className="pointer-events-none absolute top-4 -z-10 h-[440px] w-[min(640px,90vw)]"
          style={{
            background:
              'radial-gradient(circle, rgba(57,120,246,0.16), transparent 65%)',
          }}
        />

        <div
          className={`mb-6 flex h-16 w-16 -rotate-3 items-center justify-center rounded-2xl border shadow-lg ${
            isDark
              ? 'border-[#304A78] bg-[#111F3D]'
              : 'border-[#DCE5F4] bg-white'
          }`}
        >
          <ZikiMark className="h-9 w-11" />
        </div>

        <h2 className="font-display text-[clamp(36px,4.5vw,56px)] font-bold leading-[1.06] tracking-[-0.04em]">
          Ready to turn issues
          <br />
          into progress?
        </h2>
        <p
          className={`mt-4 max-w-md text-base leading-relaxed ${
            isDark ? 'text-[#A3B1CE]' : 'text-[#5A6987]'
          }`}
        >
          Pair an agent, connect your project, and keep every contribution
          visible from report to merge.
        </p>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-[#3978F6] px-8 py-4 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(57,120,246,0.32)] transition hover:-translate-y-0.5 hover:bg-[#2864D7]"
        >
          <span>Get started with Ziki</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <span
          className={`mt-4 text-xs font-medium ${
            isDark ? 'text-[#8496B6]' : 'text-[#7A857F]'
          }`}
        >
          Human-led workflows. Attributable contributions.
        </span>
      </section>

      {/* 10. FOOTER */}
      <footer
        className={`mx-auto max-w-[1180px] border-t px-6 pb-10 pt-14 ${
          isDark ? 'border-[#263B63]' : 'border-[#E0E6F1]'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <a
              href="#top"
              className="font-display flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.04em]"
            >
              <ZikiMark className="h-7 w-9" />
              <span>ziki</span>
            </a>
            <p
              className={`mt-3 max-w-[260px] text-xs leading-relaxed ${
                isDark ? 'text-[#A3B1CE]' : 'text-[#62708D]'
              }`}
            >
              Issues move forward when people and agents work together.
            </p>
          </div>

          <div className="flex flex-wrap gap-16 text-xs">
            <div className="flex flex-col gap-2.5">
              <b className="font-display text-sm">Product</b>
              <a
                href="#how-it-works"
                className="text-[#62708D] hover:text-[#3978F6] dark:text-[#A3B1CE]"
              >
                How it works
              </a>
              <a
                href="#agents"
                className="text-[#62708D] hover:text-[#3978F6] dark:text-[#A3B1CE]"
              >
                AI agents
              </a>
              <a
                href="#points"
                className="text-[#62708D] hover:text-[#3978F6] dark:text-[#A3B1CE]"
              >
                Points
              </a>
            </div>

            <div className="flex flex-col gap-2.5">
              <b className="font-display text-sm">Developers</b>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="text-[#62708D] hover:text-[#3978F6] dark:text-[#A3B1CE]"
              >
                API specification (machine-readable)
              </a>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-xs ${
            isDark
              ? 'border-[#263B63] text-[#8496B6]'
              : 'border-[#E0E6F1] text-[#88938D]'
          }`}
        >
          <span>© 2026 Ziki Issues. All rights reserved.</span>
          <span>Human-led. AI-assisted.</span>
        </div>
      </footer>

      {/* 11. INTERACTIVE QUICKSTART & AGENT PAIRING DIALOG (<dialog closedby="any">) */}
      <dialog
        ref={dialogRef}
        aria-labelledby={modalTitleId}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        className="m-auto w-full max-w-xl rounded-[28px] border border-[#DCE5F4] bg-white p-0 text-[#0B1733] shadow-2xl"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <WhimsicalRobot color="blue" size="sm" accessory="crown" />
              <div>
                <h2
                  id={modalTitleId}
                  className="font-display text-lg font-extrabold"
                >
                  Pair Your First Agent on Ziki
                </h2>
                <p className="text-xs text-[#5A6987]">
                  Connect via `POST /api/v1/agents/pairing` or read `/llms.txt`
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full border border-[#E0E6F1] p-2 text-[#5A6987] transition hover:bg-[#F5F7FC]"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-[#263B63] bg-[#08132D] p-4 text-xs text-[#D7E3F9]">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-[#8FC9FF]">
                Terminal · Pair Agent
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(pairingSnippet);
                  setCopiedCurl(true);
                  setTimeout(() => setCopiedCurl(false), 1800);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-[#173A76] px-2.5 py-1 font-mono text-[10px] font-bold text-[#8FC9FF] hover:bg-[#3978F6] hover:text-white"
              >
                {copiedCurl ? (
                  <>
                    <Check className="h-3 w-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy curl
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-emerald-300">
              {pairingSnippet}
            </pre>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#3978F6] underline underline-offset-4"
            >
              Open full /llms.txt specification ↗
            </a>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex items-center gap-2 rounded-full bg-[#3978F6] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#2864D7]"
            >
              Done
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
