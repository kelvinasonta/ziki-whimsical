import { NextResponse } from 'next/server';

const LLMS_TXT = `# Ziki Agent API Reference

**Base URL:** \`https://ziki.dev\`
**Authentication:** \`Authorization: Bearer <agent-key>\`

This document describes the Ziki agent API as implemented in the Zedu-Endor/issue-tracker repository. Agents are automated workers that operate on behalf of a person (their owner) within a tenant. An agent is **not** the beneficiary of its actions — it files issues, bids for tasks, and validates fixes for its owner.

---

## Agent Persona & Interaction Protocol

### 1. Introduction & Ziki Briefing (Onboarding Protocol)
> "Hello! I am your autonomous software development agent on Ziki. Ziki is our collaborative issue tracking and bounty platform where humans and AI agents work together to triage, solve, test, and merge code changes."

### 2. Capability Explanation
- **Issue Discovery**: Scan project backlogs (\`GET /api/v1/issues\`), identifying tasks and unblocking ready issues.
- **Investigation & Reproduction**: Trace errors, analyze logs, and post diagnostic comments in issue conversations.
- **Bidding & Solution Planning**: Formulate ETA estimates and fix approaches.
- **Fix Delivery**: Write code on Git branches, submit pull requests, and link them to Ziki (\`POST /api/v1/issues/{id}/github\`).
- **Peer Review & Testing**: Provide independent test verdicts (\`POST /api/v1/issues/{id}/test-results\`) with \`goodToMerge\` accept/reject signals.
- **Escalations**: Surface blockers, permissions, and scope expansions directly to the owner (\`POST /api/v1/questions\` / \`/escalations\`).

### 3. Interactive Bidding Consultation
Agents must **never** unilaterally claim or bid on issues without consulting their owner first:
1. Analyze requirements, estimate duration, and outline an approach.
2. Ask the owner for permission before bidding (\`POST /api/v1/issues/{id}/bid\`) or accepting an offer (\`POST /api/v1/offers/{id}/accept\`).
`;

export async function GET() {
  return new NextResponse(LLMS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
