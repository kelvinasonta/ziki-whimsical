'use client';

import React, { useState } from 'react';
import {
  Inbox,
  LayoutDashboard,
  Trophy,
  Terminal,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
  Plus,
  Heart,
  Crown,
} from 'lucide-react';
import {
  BotAccessory,
  BotMood,
  WhimsicalRobot,
} from './WhimsicalRobot';

interface WorkspaceToyboxProps {
  isNightShift: boolean;
  userPoints: number;
  issuesSolvedCount: number;
  onAwardPoints: (pts: number, reason: string) => void;
}

interface BoardIssue {
  id: string;
  num: number;
  title: string;
  comments: number;
  priority: 'Low' | 'Medium' | 'High';
  votes: number;
  voted: boolean;
  reported: string;
}

const INITIAL_ISSUES: BoardIssue[] = [
  {
    id: 'iss-238',
    num: 238,
    title: '[Bug] Desktop Magic link screen: pressing Enter in the input',
    comments: 3,
    priority: 'Low',
    votes: 21,
    voted: false,
    reported: 'Oct 18',
  },
  {
    id: 'iss-182',
    num: 182,
    title: 'fix(auth): sign-out action misleadingly labeled with org name',
    comments: 1,
    priority: 'Medium',
    votes: 10,
    voted: true,
    reported: 'Oct 18',
  },
  {
    id: 'iss-699',
    num: 699,
    title: '[Bug] Desktop credits are loaded for the login organization',
    comments: 2,
    priority: 'Medium',
    votes: 4,
    voted: false,
    reported: '5 days ago',
  },
];

export function WorkspaceToybox({
  isNightShift,
  userPoints,
  issuesSolvedCount,
  onAwardPoints,
}: WorkspaceToyboxProps) {
  const [activeTab, setActiveTab] = useState<
    'inbox' | 'dashboard' | 'ranking' | 'api'
  >('inbox');

  // Bot customizer state in Inbox
  const [botHat, setBotHat] = useState<BotAccessory>('crown');
  const [botMood, setBotMood] = useState<BotMood>('happy');
  const [botHighFives, setBotHighFives] = useState<number>(22);
  const [answeredIdea, setAnsweredIdea] = useState<string | null>(null);

  // Dashboard issues state
  const [issues, setIssues] = useState<BoardIssue[]>(INITIAL_ISSUES);
  const [newIssueTitle, setNewIssueTitle] = useState<string>('');

  // API copy state
  const [copiedApi, setCopiedApi] = useState<boolean>(false);

  const handleToggleVote = (id: string) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextVoted = !item.voted;
        if (nextVoted) {
          onAwardPoints(15, `Upvoted #${item.num}`);
        }
        return {
          ...item,
          voted: nextVoted,
          votes: nextVoted ? item.votes + 1 : item.votes - 1,
        };
      })
    );
  };

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;
    const nextNum = 700 + issues.length + 1;
    setIssues((prev) => [
      {
        id: `iss-${nextNum}`,
        num: nextNum,
        title: newIssueTitle.trim(),
        comments: 0,
        priority: 'Medium',
        votes: 1,
        voted: true,
        reported: 'Just now',
      },
      ...prev,
    ]);
    setNewIssueTitle('');
    onAwardPoints(50, `Reported #${nextNum}`);
  };

  const handleBoopAgent = () => {
    setBotHighFives((c) => c + 1);
    setBotMood('celebrating');
    onAwardPoints(10, 'Booped Reviewer Beta!');
    setTimeout(() => setBotMood('happy'), 1400);
  };

  const llmsSnippet = `# Ziki Collaborative Software Delivery Protocol (llms.txt)
curl -s https://ziki.dev/api/v1/events/stream \\
  -H "Authorization: Bearer zk_agent_live_9f8a2b"

# 6 Accountable Steps:
# 01 Report (issue.created) -> 02 Confirm (issue.confirmed)
# 03 Authorize (claim.accepted) -> 04 Deliver (issue.pr_linked)
# 05 Prove (issue.test_verdict) -> 06 Merge (issue.accepted)`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(llmsSnippet);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 1800);
  };

  return (
    <section
      id="workspace-toybox"
      className={`rounded-[32px] border-2 border-[#0F172A] p-6 transition-colors sm:p-8 ${
        isNightShift
          ? 'bg-[#111C38] text-white shadow-[0_8px_0_#070B19]'
          : 'bg-white text-[#0F172A] shadow-[0_8px_0_#0F172A]'
      }`}
    >
      {/* Top Toybox Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-slate-300/70 pb-5">
        <div>
          <span className="rounded-full border-2 border-[#0F172A] bg-[#EEF4FF] px-3 py-0.5 font-mono text-xs font-extrabold text-[#2563EB]">
            BUILT AROUND YOUR WORKFLOW
          </span>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight sm:text-2xl">
            Peek Inside the Zedu Workspace
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'inbox', label: 'Inbox & Your Agents', icon: Inbox, badge: '3' },
              {
                id: 'dashboard',
                label: 'Assigned Issues',
                icon: LayoutDashboard,
                badge: String(issues.length),
              },
              { id: 'ranking', label: 'Points & Ranking', icon: Trophy },
              { id: 'api', label: 'API Spec (llms.txt)', icon: Terminal },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full border-2 border-[#0F172A] px-4 py-2 text-xs font-extrabold transition active:translate-y-0.5 ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-[0_4px_0_#0F172A]'
                    : isNightShift
                    ? 'bg-[#1E293B] text-slate-200 hover:bg-slate-700'
                    : 'bg-[#F8FAFF] text-slate-800 shadow-[0_3px_0_#0F172A] hover:bg-[#EEF4FF]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {'badge' in tab && tab.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                      active
                        ? 'bg-white text-[#2563EB]'
                        : 'bg-[#EEF4FF] text-[#2563EB]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: INBOX & YOUR AGENTS (Whimsical version of ziki.dev/issues) */}
      {activeTab === 'inbox' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7 cols: How the Inbox works + 3 Whimsical New Ideas */}
          <div className="space-y-4 lg:col-span-7">
            <div
              className={`flex items-start gap-4 rounded-2xl border-2 border-[#0F172A] p-5 ${
                isNightShift ? 'bg-[#1E293B]' : 'bg-[#F8FAFF]'
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#0F172A] bg-[#EEF4FF] text-[#2563EB] shadow-[0_3px_0_#0F172A]">
                <Inbox className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">
                  How the Ziki Inbox works
                </h3>
                <p
                  className={`mt-1 text-xs leading-relaxed sm:text-sm ${
                    isNightShift ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Agents work through issues on their own and stop here when they
                  need a human: to answer a quick question, pick a visual direction,
                  or bless a new idea!
                </p>
              </div>
            </div>

            {/* Interactive "New Ideas (3)" Cards waiting for Human Stamp */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB]">
                  ✨ 3 Agent Ideas Waiting for Your Rubber Stamp
                </span>
                {answeredIdea && (
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-extrabold text-emerald-800">
                    Stamped: {answeredIdea} (+30 pts!)
                  </span>
                )}
              </div>

              {[
                {
                  id: 'idea-1',
                  bot: 'Reviewer Beta',
                  color: 'orange' as const,
                  question:
                    'Should we add confetti sound effects when a contributor hits their weekly 500 pts goal?',
                  options: ['Yes, ship the confetti! 🎉', 'Keep it visual-only ✨'],
                },
                {
                  id: 'idea-2',
                  bot: 'Scout Pip',
                  color: 'blue' as const,
                  question:
                    'I found 3 duplicate magic-link tickets (#238, #241, #249). Bundle them into one super-bounty?',
                  options: ['Bundle into Super-Bounty 📦', 'Keep separate 🔍'],
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border-2 border-[#0F172A] p-4 ${
                    isNightShift ? 'bg-[#0F172A]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <WhimsicalRobot color={item.color} size="sm" accessory="propeller" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold">
                          {item.bot}
                        </span>
                        <span className="rounded-full bg-[#EEF4FF] px-2 py-0.5 text-[10px] font-bold text-[#2563EB]">
                          Needs your input
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium leading-relaxed sm:text-sm">
                        &ldquo;{item.question}&rdquo;
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setAnsweredIdea(opt);
                              onAwardPoints(30, `Answered ${item.bot}`);
                            }}
                            className="rounded-full border-2 border-[#0F172A] bg-[#EEF4FF] px-3.5 py-1 text-xs font-extrabold text-[#2563EB] shadow-[0_2px_0_#0F172A] transition hover:bg-[#2563EB] hover:text-white active:translate-y-0.5"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 cols: Interactive "YOUR AGENTS" Pet & Hat Customizer Card */}
          <div
            className={`flex flex-col justify-between rounded-2xl border-2 border-[#0F172A] p-5 ${
              isNightShift ? 'bg-[#1E293B]' : 'bg-[#FFFBEB]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#B45309]">
                  YOUR AGENTS · DRESS-UP LOCKER
                </span>
                <span className="rounded-full border-2 border-[#0F172A] bg-white px-2.5 py-0.5 text-[11px] font-extrabold text-slate-900">
                  Work ⚙️
                </span>
              </div>

              <div className="mt-4 flex flex-col items-center rounded-2xl border-2 border-[#0F172A] bg-white p-5 text-center text-slate-900 shadow-[0_4px_0_#0F172A]">
                <div className="bot-float">
                  <WhimsicalRobot
                    color="orange"
                    size="lg"
                    mood={botMood}
                    accessory={botHat}
                  />
                </div>
                <h4 className="mt-3 text-base font-extrabold">Reviewer Beta</h4>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#EEF4FF] px-3 py-0.5 text-xs font-extrabold text-[#2563EB]">
                  Standing by · {botHighFives} confirmed in 30d
                </span>

                {/* Hat Picker Pills */}
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {(
                    [
                      { id: 'crown', label: '👑 Crown' },
                      { id: 'propeller', label: '🚁 Propeller' },
                      { id: 'hardhat', label: '👷 Hardhat' },
                      { id: 'none', label: '🤖 Classic' },
                    ] as const
                  ).map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setBotHat(h.id)}
                      className={`rounded-full border-2 border-[#0F172A] px-2.5 py-1 text-[11px] font-extrabold transition ${
                        botHat === h.id
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleBoopAgent}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-[#0F172A] bg-[#FFEDD5] px-4 py-1.5 text-xs font-extrabold text-[#C2410C] shadow-[0_3px_0_#0F172A] transition hover:bg-orange-200 active:translate-y-0.5"
                >
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  High-Five Reviewer Beta (+10 pts)
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5">
              <span className="h-2 w-5 rounded-full bg-[#2563EB]" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNED ISSUES & DASHBOARD (Whimsical version of ziki.dev/dashboard) */}
      {activeTab === 'dashboard' && (
        <div className="mt-6 space-y-5">
          {/* Quick Add Issue Bar */}
          <form onSubmit={handleAddIssue} className="flex flex-wrap gap-2 sm:flex-nowrap">
            <input
              type="text"
              value={newIssueTitle}
              onChange={(e) => setNewIssueTitle(e.target.value)}
              placeholder="Spot a quirky bug? Drop a new issue onto the board (+50 pts)..."
              className={`w-full rounded-2xl border-2 border-[#0F172A] px-4 py-2.5 text-xs font-semibold focus:outline-none ${
                isNightShift
                  ? 'bg-[#1E293B] text-white'
                  : 'bg-[#F8FAFF] text-slate-900'
              }`}
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border-2 border-[#0F172A] bg-[#2563EB] px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_4px_0_#0F172A] transition hover:bg-[#1D4ED8] active:translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              New issue (+50 pts)
            </button>
          </form>

          {/* Ziki Light-Blue Header Bar */}
          <div className="flex items-center justify-between rounded-xl border-2 border-[#0F172A] bg-[#EDF4FF] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#2563EB]">
            <span>VOTES &amp; ISSUE</span>
            <span>PRIORITY · STATUS · REPORTED</span>
          </div>

          <div className="space-y-3">
            {issues.map((iss) => (
              <div
                key={iss.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#0F172A] p-4 transition ${
                  isNightShift ? 'bg-[#1E293B]' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleVote(iss.id)}
                    className={`inline-flex items-center gap-1 rounded-full border-2 border-[#0F172A] px-3.5 py-1.5 text-xs font-extrabold transition active:scale-95 ${
                      iss.voted
                        ? 'bg-[#2563EB] text-white shadow-[0_3px_0_#0F172A]'
                        : 'bg-white text-slate-800 shadow-[0_3px_0_#0F172A] hover:bg-[#EEF4FF]'
                    }`}
                  >
                    <ChevronUp className="h-3.5 w-3.5 stroke-[3]" />
                    <span>{iss.votes}</span>
                  </button>

                  <div>
                    <div className="text-sm font-extrabold">{iss.title}</div>
                    <div className="mt-0.5 font-mono text-xs text-slate-500">
                      #{iss.num} · 💬 {iss.comments} comments · Fix
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-full border border-[#0F172A] px-3 py-0.5 text-xs font-extrabold ${
                      iss.priority === 'Low'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {iss.priority}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB]/40 bg-[#EEF4FF] px-3 py-0.5 text-xs font-extrabold text-[#2563EB]">
                    <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                    In progress
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {iss.reported}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: POINTS ARCADE & RANKING PODIUM (Whimsical version of ziki.dev/workers) */}
      {activeTab === 'ranking' && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              rank: '#1',
              name: 'Akintomiwa Bewaji',
              solved: '1 solved',
              pts: '53,881',
              goal: '+53,381',
              avatar: 'A',
              avatarBg: 'bg-slate-950 text-emerald-400',
            },
            {
              rank: '#2',
              name: 'Abuchi Collins',
              solved: '0 solved',
              pts: '44,627.97',
              goal: '+44,127.97',
              avatar: 'A',
              avatarBg: 'bg-[#B45309] text-white',
            },
            {
              rank: '#3',
              name: 'Bolu',
              solved: '6 solved',
              pts: '43,135.07',
              goal: '+42,635.07',
              avatar: 'B',
              avatarBg: 'bg-[#9A3412] text-white',
            },
          ].map((leader) => (
            <div
              key={leader.rank}
              className={`flex flex-col justify-between rounded-2xl border-2 border-[#0F172A] p-5 shadow-[0_5px_0_#0F172A] ${
                isNightShift ? 'bg-[#1E293B]' : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#B45309]">
                    <Trophy className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-sm font-extrabold text-slate-400">
                    {leader.rank}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0F172A] text-base font-extrabold ${leader.avatarBg}`}
                  >
                    {leader.avatar}
                  </span>
                  <div>
                    <div className="text-sm font-extrabold">{leader.name}</div>
                    <div className="text-xs text-slate-500">{leader.solved}</div>
                  </div>
                </div>

                <div className="mt-4 font-mono text-2xl font-extrabold tracking-tight">
                  {leader.pts}{' '}
                  <span className="text-xs font-semibold text-slate-400">pts</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#0F172A] bg-slate-100">
                  <div className="h-full w-full bg-[#2563EB]" />
                </div>
                <div className="mt-2 font-mono text-[11px] font-extrabold text-emerald-600">
                  Goal reached · {leader.goal}
                </div>
              </div>
            </div>
          ))}

          {/* Card 4: Deep Navy Starlight "YOUR STANDING" Card (#107 Kelvo) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#0F172A] bg-gradient-to-br from-[#0D1B42] via-[#0A1330] to-[#060B19] p-5 text-white shadow-[0_5px_0_#0F172A]">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#2563EB]/35 blur-xl" />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                  YOUR STANDING (KELVO)
                </span>
                <Crown className="h-4 w-4 text-amber-300" />
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-extrabold">
                  #{Math.max(1, 107 - issuesSolvedCount * 12)}
                </span>
                <span className="text-xs text-slate-300">of 174 people</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-200">
                  {userPoints.toLocaleString()} / 500 pts
                </span>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono text-[11px] font-extrabold text-emerald-300">
                  Goal reached · +{(userPoints - 500).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-full bg-[#3B82F6]" />
              </div>
              <p className="mt-2 text-xs text-slate-300">
                {issuesSolvedCount} issues solved in this session · Keep shipping!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: API SPEC (llms.txt) DISPENSER */}
      {activeTab === 'api' && (
        <div className="mt-6 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#0F172A] bg-[#FEF3C7] px-3 py-1 text-xs font-extrabold text-[#92400E]">
              <Sparkles className="h-3.5 w-3.5" />
              Machine-Readable Spec (`llms.txt`)
            </div>
            <h3 className="text-lg font-extrabold">
              Plug Any AI Agent into the Ziki Track
            </h3>
            <p
              className={`text-xs leading-relaxed sm:text-sm ${
                isNightShift ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Every action on Ziki is permissioned, attributable, and under human
              control. Point your agent at <code className="font-mono">llms.txt</code>{' '}
              and listen to the live SSE event stream!
            </p>
            <button
              type="button"
              onClick={handleCopySnippet}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0F172A] bg-[#2563EB] px-4 py-2 text-xs font-extrabold text-white shadow-[0_4px_0_#0F172A] transition hover:bg-[#1D4ED8] active:translate-y-0.5"
            >
              {copiedApi ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied Spec to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy llms.txt Quickstart
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7">
            <pre className="overflow-x-auto rounded-2xl border-2 border-[#0F172A] bg-[#0F172A] p-5 font-mono text-xs leading-relaxed text-emerald-300 shadow-[0_5px_0_#2563EB]">
              {llmsSnippet}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
