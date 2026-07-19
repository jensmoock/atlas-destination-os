# OpenAI Build Week submission draft

The copy-paste-ready final field set is maintained in [`DEVPOST_FINAL.md`](DEVPOST_FINAL.md). The timed recording plan is in [`VIDEO_RECORDING.md`](VIDEO_RECORDING.md).

## Project name

**Atlas Destination OS — Mission Control**

## Tagline

**Turn one visitor request into a grounded journey—and a destination operating signal.**

## Track

**Work & Productivity**

## Short description

Atlas Mission Control is an AI destination operating system for independent tourism businesses. It converts a traveler’s intent into a source-backed, action-ready journey while simultaneously extracting anonymous demand, trust and conversion signals for the operator.

Unlike a generic itinerary generator, Atlas closes the loop. Recommendations resolve to owned destination sources, mutable facts are marked for live verification, every journey ends in a useful action, and each request reveals what the operator should improve next.

The prototype is the new Build Week extension of a real destination ecosystem operated by Bacchus Holiday Homes in Bacharach, Germany, inside the UNESCO Upper Middle Rhine Valley.

## The 14-month proof

In May 2025, Bacchus Holiday Homes started at zero: no established brand, no digital visitor journey and no connected destination infrastructure. Fourteen months later, Project Atlas connected three real accommodations and direct booking with roughly 240 curated regional points of interest, the Mittelrhein Explorer, an interactive map, a mobile Live Guide, an AI Concierge and the physical-digital Bacchus Traveller Hub.

This is not a speculative hackathon market. It is a functioning transformation in one of Europe’s UNESCO cultural landscapes. The pre-existing ecosystem proves the problem, audience and deployment path. **Atlas Mission Control is the clearly separated new Build Week extension submitted for judging.**

Rather than making an unsupported regional market-leader claim, we demonstrate digital leadership through the breadth of the live system, its external guest trust signals and the absence of a comparable all-in-one stack among the direct competitors reviewed in Bacharach.

## Inspiration

Small tourism businesses are expected to act like destination organizations, content teams, concierges and conversion experts at the same time. Their knowledge is valuable but fragmented. Travelers get disconnected pages; operators get no structured learning from what guests actually ask.

Project Atlas already connected accommodations, direct booking, regional discovery, a mobile guide, a map, an AI concierge and an on-site Traveller Hub. During Build Week, we added Mission Control to turn those surfaces into one measurable operating loop.

## What it does

1. Interprets a traveler’s audience, mobility, pace, weather sensitivity and interests.
2. Ranks a curated destination graph with deterministic guardrails.
3. Builds a coherent one-to-three-day journey from Bacharach Basecamp.
4. Links every stop to an owned Atlas source and flags facts that require a live check.
5. Produces direct guide, route and booking actions.
6. Converts the same request into anonymous operator demand signals and prioritised opportunities.

## How we built it

Codex built the application architecture, Node/Express API, scoring and diversity engine, source registry, GPT-5.6 structured-output integration, responsive product interface, tests and documentation.

The core product decision was a hybrid architecture. Atlas deterministically controls place selection, constraints and provenance. GPT-5.6 refines the grounded mission and translates it into concise operator insight through a strict JSON schema. If the reasoning layer is unavailable, the app remains functional and labels its fallback state.

## Challenges

- Separating stable destination knowledge from volatile schedules and availability.
- Preventing a creative model from inventing locally plausible but unverified facts.
- Serving two audiences without creating two disconnected products.
- Demonstrating a meaningful extension of a pre-existing real-world ecosystem within the Build Week window.

## Accomplishments

- A complete, runnable product rather than a concept mock-up.
- A visible provenance contract for every recommendation.
- A privacy-conscious intent-to-signal loop with no traveler profiling.
- A reliable no-key demo mode plus an optional live GPT-5.6 layer.
- Immediate applicability to the existing Atlas network of roughly 240 curated POIs and five connected visitor surfaces.

## What we learned

The strongest role for AI in destination management is not generating more tourism copy. It is connecting intent, evidence, action and organizational learning—while being honest about which facts can change.

## What’s next

- Add live timetable, weather and opening-status connectors with source-level freshness policies.
- Connect accommodation availability and consented local partner inventory.
- Aggregate anonymous demand patterns into a weekly Trust, Revenue and Moat sprint.
- Replicate the system for additional towns without losing local provenance.

## Three-minute demo script

### 0:00–0:20 — The problem

“In May 2025, we started at zero: no brand, no visitor journey and no digital destination system. Fourteen months later, Project Atlas connects three real accommodations, direct booking and roughly 240 curated places with a regional Explorer, map, Live Guide, AI Concierge and an on-site Traveller Hub.”

### 0:20–0:38 — The problem

“Independent tourism knowledge is still fragmented. Generic travel AI gives guests another answer, but it does not help the destination act or learn. During Build Week, Codex helped us add the missing operating loop: Atlas Mission Control.”

### 0:38–1:23 — Working guest journey

Select **Rainy family** and generate the mission.

“Atlas interprets mobility, audience, pace and weather sensitivity. A deterministic engine grounds and ranks the places first. The mission is coherent, car-free and action-ready. Every recommendation resolves to an owned Atlas source. Anything dependent on opening status, access or a timetable is explicitly marked for a live check.”

Open one source link.

### 1:23–2:03 — Operator value

Switch to **Mission control**.

“The same request now becomes structured demand: family suitability, car-free continuity and weather-resilient alternatives. Atlas surfaces trust risks and prioritises the next content, partner or conversion improvement. No personal profile is stored.”

### 2:03–2:33 — Technical implementation

“Codex built the full application, guardrail engine, API, interface, tests and documentation. GPT-5.6 receives only the grounded mission and returns strict structured output. It can refine interpretation, but it cannot invent places or mutable facts. If the model is unavailable, the deterministic product still works.”

Show the **Evidence** view and a passing test run.

### 2:33–2:58 — Impact

“Atlas turns one small hospitality operator into a destination operating system: better journeys for visitors, direct value for local businesses, and a self-improving knowledge loop for the region. The future of destination AI is not more answers. It is grounded action and learning.”

End card: **Atlas Destination OS — One request. A complete mission. A smarter destination.**

## Submission completion checklist

- [ ] Deploy a free public demo and verify it on desktop and mobile.
- [ ] Create the final dated Git repository and keep Build Week commit history.
- [ ] Add the Codex `/feedback` session ID for the thread containing the majority of the core build.
- [ ] Record the English demo at under 3:00 and upload it publicly to YouTube.
- [ ] Add repository, demo and video links to Devpost.
- [ ] State clearly which Atlas elements pre-dated July 13 and which Mission Control elements were added during Build Week.
- [ ] Submit before July 21, 2026 at 5:00 PM PDT.
