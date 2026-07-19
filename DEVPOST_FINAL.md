# Atlas Build Week — final Devpost copy

## Required fields

**Project name**

Atlas Destination OS — Mission Control

**Tagline**

Turn one visitor request into a grounded journey—and a destination operating signal.

**Track**

Work & Productivity

**Repository URL**

`https://github.com/jensmoock/atlas-destination-os`

**Public demo URL**

`https://jensmoock.github.io/atlas-destination-os/`

**YouTube URL**

`[PASTE PUBLIC YOUTUBE URL]`

**Codex /feedback Session ID**

`[PASTE SESSION ID FROM THE PRIMARY ATLAS BUILD THREAD]`

## Short description

Atlas Mission Control is an AI destination operating system for independent tourism businesses. It converts a traveler’s intent into a source-backed, action-ready journey while simultaneously extracting anonymous demand, trust and conversion signals for the operator.

Unlike a generic itinerary generator, Atlas closes the loop. Recommendations resolve to owned destination sources, mutable facts are marked for live verification, every journey ends in a useful action, and each request reveals what the operator should improve next.

Mission Control is the new OpenAI Build Week extension of Project Atlas, a real destination ecosystem operated by Bacchus Holiday Homes in Bacharach, Germany, inside the UNESCO Upper Middle Rhine Valley.

## Inspiration

Independent tourism businesses are expected to act like destination organizations, content teams, concierges and conversion experts at the same time. Their knowledge is valuable but fragmented across accommodation pages, maps, guides, booking systems and conversations. Travelers get disconnected information; operators learn almost nothing from what guests actually ask.

Project Atlas already connected three accommodations, direct booking, roughly 240 curated regional points of interest, a regional Explorer, interactive map, mobile Live Guide, AI Concierge and on-site Traveller Hub. During Build Week, we added Mission Control to turn those surfaces into one measurable operating loop.

## What it does

Atlas interprets a traveler’s audience, mobility, pace, weather sensitivity and interests. A deterministic engine ranks curated destination knowledge, assembles a coherent one-to-three-day journey and maps every stop to an owned Atlas source. Facts that can change—such as opening status, access or timetables—are visibly marked for live verification.

The same request then becomes an operator view containing anonymous demand signals, trust alerts, direct conversion actions and prioritized content or partner opportunities. The guest receives a better mission; the operator receives a better next decision.

## How we built it

Codex helped us turn the product concept into a complete runnable system: architecture, Node/Express API, destination data model, constraint inference, ranking and diversity engine, GPT-5.6 integration, responsive interface, tests, safeguards, public judge mode and documentation.

The key engineering decision was a hybrid architecture. The deterministic layer controls place selection, constraints and provenance. GPT-5.6 receives only the grounded mission and refines its interpretation and operator opportunities through strict structured output. It cannot introduce places, opening hours, schedules, prices or other mutable facts. OpenAI requests use `store: false`. If the model or API is unavailable, the grounded application remains functional and visibly labels the fallback.

## The 14-month proof and Build Week boundary

In May 2025, Bacchus Holiday Homes started with no established brand, no digital visitor journey and no connected destination infrastructure. Fourteen months later, Project Atlas connected three real accommodations and direct booking with roughly 240 curated points of interest, the Mittelrhein Explorer, an interactive map, a mobile Live Guide, an AI Concierge and the physical-digital Bacchus Traveller Hub.

That pre-existing system proves the problem, audience and deployment path; it is not claimed as Build Week work. Atlas Mission Control is the clearly separated new work: the runnable intent-to-mission application, deterministic grounding engine, GPT-5.6 reasoning layer, provenance contract, dual guest/operator experience, anonymous demand-signal extraction, public judge mode and automated tests. The dated Git history and primary Codex `/feedback` Session ID document this extension.

## Challenges

- Separating stable destination knowledge from volatile schedules and availability.
- Preventing a creative model from inventing locally plausible but unverified facts.
- Serving guests and operators in one coherent product rather than two dashboards.
- Demonstrating a meaningful new extension of a functioning pre-existing ecosystem inside the submission window.

## Accomplishments

- A complete runnable product rather than a concept mock-up.
- A visible provenance and live-verification contract for every recommendation.
- A privacy-conscious intent-to-signal loop with no traveler profiling.
- A no-account public demo plus an optional live GPT-5.6 layer.
- Immediate applicability to a real destination network and three operating accommodations.

## What we learned

The strongest role for AI in destination management is not generating more tourism copy. It is connecting intent, evidence, action and organizational learning while staying honest about which facts can change.

## What’s next

- Add timetable, weather and opening-status connectors with source-level freshness policies.
- Connect accommodation availability and consented local partner inventory.
- Aggregate anonymous demand patterns into a weekly trust, revenue and product sprint.
- Replicate the operating model for additional towns without losing local provenance.

## Judge test path

1. Open the public demo; no account or API key is required.
2. Choose **Rainy family** and generate the mission.
3. Inspect the **Guest journey** and its verification labels.
4. Open **Mission control** to see the operator demand and opportunity layer.
5. Open **Evidence** and follow a live Atlas source.
6. In the repository, inspect `src/mission-service.mjs` for the GPT-5.6 structured-output integration and run `npm test`.

## Criterion map

- **Technological Implementation:** non-trivial deterministic planning, strict GPT-5.6 structured output, privacy control, fallback resilience, tests and dated commits.
- **Design:** one coherent product with guest, operator and evidence views, plus a zero-account public judge path.
- **Potential Impact:** solves a real workflow for independent tourism operators and is grounded in a functioning 14-month deployment.
- **Quality of the Idea:** closes the loop from traveler intent to destination action and learning instead of producing another isolated itinerary.

## Submission gate

- [ ] Public repository opens in a logged-out browser.
- [ ] License choice is final and visible.
- [ ] Public demo works on desktop and mobile.
- [ ] Public YouTube video is 3:00 or less and contains English audio.
- [ ] Video explicitly covers what was built, Codex and GPT-5.6.
- [ ] `/feedback` Session ID is pasted from the primary Atlas build thread.
- [ ] All four URLs/IDs above are pasted into Devpost.
- [ ] Submission is entered before **July 21, 2026 at 5:00 PM PDT / July 22 at 02:00 CEST**.
- [ ] Final submission page is saved as PDF or screenshots for proof.
