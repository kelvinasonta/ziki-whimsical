'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Hand,
  Wrench,
  SearchCheck,
  Trophy,
  Stamp,
  Bug,
  Play,
  RotateCcw,
  MessageSquareHeart,
  Check,
} from 'lucide-react';
import { WhimsicalRobot } from './WhimsicalRobot';

interface ConveyorPlaygroundProps {
  isNightShift: boolean;
  onAwardPoints: (pts: number, label: string) => void;
}

interface PresetTicket {
  id: string;
  num: number;
  title: string;
  tag: string;
  points: number;
  agentName: string;
  defaultNote: string;
}

const PRESET_TICKETS: PresetTicket[] = [
  {
    id: 't-238',
    num: 238,
    title: '[Bug] Desktop Magic link screen: pressing Enter in the input',
    tag: 'Fix · Low',
    points: 250,
    agentName: 'Solver Bolt',
    defaultNote: 'Use native form onSubmit instead of window keydown listener!',
  },
  {
    id: 't-182',
    num: 182,
    title: 'fix(auth): sign-out action misleadingly labeled with org name',
    tag: 'Fix · Medium',
    points: 400,
    agentName: 'Agent Pip',
    defaultNote: 'Keep backward-compatible aria-label on the sign-out menu item!',
  },
  {
    id: 't-699',
    num: 699,
    title: '[Bug] Desktop credits are loaded for the login organization',
    tag: 'Fix · High',
    points: 600,
    agentName: 'Solver A3',
    defaultNote: 'Scope query to activeWorkspaceId with zero schema changes!',
  },
];

const STATIONS = [
  {
    step: 1,
    name: '01 Bug Net',
    event: 'issue.created',
    desc: 'Scout Pip catches a wild issue & pins reproduction steps.',
    icon: Bug,
    color: 'bg-sky-100 text-sky-700 border-sky-300',
  },
  {
    step: 2,
    name: '02 Trio Stamp',
    event: 'issue.confirmed',
    desc: '2 Reviewers + 1 Triager rubber-stamp the ticket!',
    icon: Stamp,
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    step: 3,
    name: '03 High-Five Gate',
    event: 'claim.accepted',
    desc: '60s Owner pause! Whisper a tip or high-five your agent.',
    icon: Hand,
    color: 'bg-blue-100 text-blue-700 border-blue-400',
  },
  {
    step: 4,
    name: '04 Wrench Bench',
    event: 'issue.pr_linked',
    desc: 'Solver Bolt hammers out a clean PR obeying your note.',
    icon: Wrench,
    color: 'bg-violet-100 text-violet-700 border-violet-300',
  },
  {
    step: 5,
    name: '05 Twin Magnifier',
    event: 'issue.test_verdict',
    desc: '2 independent tester bots inspect every line (no COI!).',
    icon: SearchCheck,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    step: 6,
    name: '06 Coin Vault',
    event: 'issue.accepted',
    desc: 'PR merged! Gold bounty coins rain into your Ziki jar.',
    icon: Trophy,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  },
];

export function ConveyorPlayground({
  isNightShift,
  onAwardPoints,
}: ConveyorPlaygroundProps) {
  const [selectedTicket, setSelectedTicket] = useState<PresetTicket>(
    PRESET_TICKETS[0]
  );
  const [activeStation, setActiveStation] = useState<number>(3);
  const [ownerWhisper, setOwnerWhisper] = useState<string>(
    PRESET_TICKETS[0].defaultNote
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logBanner, setLogBanner] = useState<string>(
    'Paused at Station 03 (High-Five Gate)! Add a secret owner note or pull the blue launch lever.'
  );

  const handleSelectTicket = (t: PresetTicket) => {
    setSelectedTicket(t);
    setOwnerWhisper(t.defaultNote);
    setActiveStation(3);
    setIsRunning(false);
    setLogBanner(
      `Loaded #${t.num} onto the conveyor! Waiting for your Owner High-Five at Station 03.`
    );
  };

  const handlePullLever = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStation(3);
    setLogBanner(
      `🙌 High-Five confirmed! Bound note: "${ownerWhisper}" -> Sending to Station 04...`
    );

    setTimeout(() => {
      setActiveStation(4);
      setLogBanner(
        `🔧 Station 04 (issue.pr_linked): ${selectedTicket.agentName} opened PR #${
          selectedTicket.num + 400
        } following your note!`
      );
    }, 1100);

    setTimeout(() => {
      setActiveStation(5);
      setLogBanner(
        `🔍 Station 05 (issue.test_verdict): Reviewer Beta & QA-Bot verified 2/2 independent checks!`
      );
    }, 2300);

    setTimeout(() => {
      setActiveStation(6);
      setIsRunning(false);
      setLogBanner(
        `🎉 Station 06 (issue.accepted): Merged! +${selectedTicket.points} pts minted into Kelvo's Trophy Jar!`
      );
      onAwardPoints(selectedTicket.points, `Solved #${selectedTicket.num}`);
    }, 3500);
  };

  const handleResetConveyor = () => {
    setIsRunning(false);
    setActiveStation(1);
    setLogBanner('Ticket dropped at Station 01 (Bug Net)! Advancing to Station 03...');
    setTimeout(() => setActiveStation(2), 500);
    setTimeout(() => {
      setActiveStation(3);
      setLogBanner(
        'Stopped at Station 03 (High-Five Gate)! Your agent is waiting for your blessing.'
      );
    }, 1000);
  };

  return (
    <section
      id="conveyor-machine"
      className={`rounded-[32px] border-2 border-[#0F172A] p-6 transition-colors sm:p-8 ${
        isNightShift
          ? 'bg-[#111C38] text-white shadow-[0_8px_0_#070B19]'
          : 'bg-white text-[#0F172A] shadow-[0_8px_0_#0F172A]'
      }`}
    >
      {/* Top Header of the Whimsical Conveyor Machine */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-slate-300/70 pb-5">
        <div className="flex items-center gap-3.5">
          <WhimsicalRobot
            color="orange"
            mood={activeStation === 6 ? 'celebrating' : isRunning ? 'working' : 'happy'}
            accessory={activeStation === 6 ? 'crown' : 'hardhat'}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border-2 border-[#0F172A] bg-[#FEF3C7] px-3 py-0.5 font-mono text-xs font-extrabold text-[#92400E]">
                INTERACTIVE GADGET
              </span>
              <span className="font-mono text-xs font-bold text-[#2563EB]">
                GET /api/v1/events/stream
              </span>
            </div>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
              The 6-Station Ziki Issue Express
            </h2>
            <p
              className={`text-xs sm:text-sm ${
                isNightShift ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Pick a real Ziki ticket below, whisper an owner tweak at Station 03, and
              pull the blue lever to mint points!
            </p>
          </div>
        </div>

        {/* Ticket Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_TICKETS.map((t) => {
            const active = selectedTicket.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTicket(t)}
                className={`rounded-2xl border-2 border-[#0F172A] px-3.5 py-2 text-left text-xs font-bold transition active:translate-y-0.5 ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-[0_3px_0_#0F172A]'
                    : isNightShift
                    ? 'bg-[#1E293B] text-slate-200 hover:bg-slate-700'
                    : 'bg-[#F8FAFF] text-slate-800 shadow-[0_3px_0_#0F172A] hover:bg-[#EEF4FF]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono">#{t.num}</span>
                  <span className="rounded-full bg-amber-300 px-1.5 py-0.2 font-mono text-[10px] font-extrabold text-slate-900">
                    +{t.points} pts
                  </span>
                </div>
                <div className="mt-0.5 max-w-[170px] truncate text-[11px] opacity-90">
                  {t.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6-Station Conveyor Track */}
      <div className="relative mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STATIONS.map((st) => {
            const Icon = st.icon;
            const isPassed = st.step < activeStation;
            const isCurrent = st.step === activeStation;

            return (
              <div
                key={st.step}
                onClick={() => {
                  if (!isRunning && st.step <= 3) {
                    setActiveStation(st.step);
                  }
                }}
                className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-3.5 transition-all ${
                  isCurrent
                    ? ' -translate-y-1 border-[#0F172A] bg-[#EEF4FF] text-slate-900 shadow-[0_5px_0_#2563EB]'
                    : isPassed
                    ? isNightShift
                      ? 'border-emerald-400/60 bg-emerald-950/40 text-emerald-100'
                      : 'border-[#0F172A] bg-emerald-50/90 text-slate-900 shadow-[0_3px_0_#0F172A]'
                    : isNightShift
                    ? 'border-slate-700 bg-slate-800/60 text-slate-400'
                    : 'border-slate-300 bg-slate-50/80 text-slate-500'
                }`}
              >
                {/* Floating Ticket / Bot Token on Current Station */}
                <AnimatePresence>
                  {isCurrent && (
                    <motion.div
                      layoutId="conveyor-bot-token"
                      className=" -top-3.5 right-2.5 absolute inline-flex items-center gap-1 rounded-full border-2 border-[#0F172A] bg-[#FFEDD5] px-2 py-0.5 font-mono text-[10px] font-extrabold text-[#C2410C] shadow-xs"
                    >
                      <Sparkles className="h-3 w-3" />#{selectedTicket.num}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#0F172A] ${st.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {isPassed && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2.5 text-xs font-extrabold tracking-tight">
                    {st.name}
                  </h3>
                  <p className="mt-1 text-[11px] leading-snug opacity-80">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-3 border-t border-slate-300/50 pt-1.5 font-mono text-[10px] font-bold text-[#2563EB]">
                  {st.event}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Station 03 Control Console ("Whisper to your Agent & Pull the Lever") */}
      <div
        className={`mt-6 grid grid-cols-1 items-center gap-4 rounded-2xl border-2 border-[#0F172A] p-4 lg:grid-cols-12 ${
          isNightShift ? 'bg-[#1E293B]' : 'bg-[#F8FAFF]'
        }`}
      >
        <div className="lg:col-span-7">
          <label
            htmlFor="owner-whisper-input"
            className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#2563EB]"
          >
            <MessageSquareHeart className="h-4 w-4" />
            Station 03 Owner Secret Note (Steer {selectedTicket.agentName} before launch)
          </label>
          <div className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap">
            <input
              id="owner-whisper-input"
              type="text"
              value={ownerWhisper}
              onChange={(e) => setOwnerWhisper(e.target.value)}
              className={`w-full rounded-xl border-2 border-[#0F172A] px-3.5 py-2 text-xs font-semibold focus:outline-none ${
                isNightShift
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-white text-slate-900'
              }`}
              placeholder="Tell your agent how to build this fix..."
            />
          </div>
          <p className="mt-2 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {logBanner}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 lg:col-span-5">
          <button
            type="button"
            onClick={handleResetConveyor}
            className={`inline-flex items-center gap-1.5 rounded-full border-2 border-[#0F172A] px-4 py-2.5 text-xs font-extrabold transition active:translate-y-0.5 ${
              isNightShift
                ? 'bg-slate-800 text-white shadow-[0_4px_0_#000]'
                : 'bg-white text-slate-900 shadow-[0_4px_0_#0F172A] hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Re-drop Bug
          </button>

          <button
            type="button"
            disabled={isRunning}
            onClick={handlePullLever}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#0F172A] bg-[#2563EB] px-6 py-2.5 text-sm font-extrabold text-white shadow-[0_5px_0_#0F172A] transition hover:bg-[#1D4ED8] active:translate-y-[3px] active:shadow-[0_2px_0_#0F172A] disabled:opacity-60"
          >
            <Play className="h-4 w-4 fill-current" />
            {isRunning
              ? 'Conveyor Whirring...'
              : `High-Five & Ship (+${selectedTicket.points} pts) →`}
          </button>
        </div>
      </div>
    </section>
  );
}
