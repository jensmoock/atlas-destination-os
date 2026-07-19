# Atlas Destination OS — Mission Control

Atlas Mission Control turns one grounded visitor request into two useful outcomes:

1. a source-backed, action-ready guest journey; and
2. anonymous demand, trust and conversion signals for an independent tourism operator.

It is a Build Week extension of **Project Atlas**, the real Bacchus Holiday Homes destination ecosystem in Bacharach, Germany, inside the UNESCO Upper Middle Rhine Valley.

**[Open the public zero-account judge demo](https://jensmoock.github.io/atlas-destination-os/)**

## From zero to a live destination operating system in 14 months

Work on Bacchus Holiday Homes began in May 2025 with no established brand, no digital visitor journey and no connected destination infrastructure. By July 2026, the live Atlas foundation combined:

- three real accommodations in Bacharach with direct booking;
- the Bacharach Basecamp positioning and regional trip logic;
- roughly 240 curated points of interest;
- the Mittelrhein Explorer, interactive map and mobile Live Guide;
- the Middle Rhine AI Concierge;
- the physical-digital Bacchus Traveller Hub;
- external trust signals including Booking.com recognition, Airbnb Guest Favourite and Vrbo Premium Host status.

This history is context and proof of real-world execution; it is **not** presented as Build Week work. Mission Control is the new extension created during the submission period.

We deliberately avoid an unqualified “digital market leader” claim. Internal competitor reviews found no direct Bacharach competitor combining accommodation, regional planning, AI guidance, direct conversion and on-site visitor infrastructure in one system, but objective regional market leadership would require stronger third-party benchmarking and performance data. The product demonstrates leadership through scope and execution rather than asserting it as an unsupported fact.

## Why this exists

Independent tourism businesses know their region, guests and operational reality—but that knowledge is usually fragmented across accommodation pages, maps, guides, booking systems and conversations. Generic itinerary generators produce attractive text, but they rarely create a closed operational loop.

Atlas connects:

```text
visitor intent → trusted destination knowledge → coherent mission
               → direct next action → anonymous operator signal
```

The result is not only a better trip. It tells the operator what travelers need, which facts require live verification, where content is missing and which next improvement is most likely to create value.

## What existed before Build Week

Before July 13, 2026, Project Atlas already included the Bacchus Holiday Homes accommodations and direct-booking layer, Bacharach Basecamp, the Mittelrhein Explorer, a regional map, a mobile Live Guide, the Middle Rhine AI Concierge and the physical Bacchus Traveller Hub concept. The wider content network contains roughly 240 curated regional points of interest.

## What was meaningfully added during Build Week

**Atlas Mission Control is the new competition work.** It adds:

- a runnable intent-to-mission application;
- a deterministic grounding and ranking engine with mobility, weather, audience and pace constraints;
- a hybrid GPT-5.6 reasoning layer that cannot invent places or live facts;
- explicit provenance and live-verification labels;
- a dual-view experience for travelers and operators;
- anonymous demand-signal extraction;
- prioritised trust, content, partner and conversion opportunities;
- automated tests and a no-key fallback for reliable judging.

Only this new extension is presented for Build Week judging. Dated commits and the Codex `/feedback` session ID document the work completed during the submission period.

## Technical architecture

- **Client:** dependency-free responsive HTML, CSS and JavaScript interface.
- **API:** Node.js and Express.
- **Guardrail engine:** deterministic constraint inference, place scoring, diversity control, itinerary assembly and source mapping.
- **Reasoning layer:** OpenAI Responses API with `gpt-5.6` and strict structured output.
- **Reliability:** if the model/API is unavailable, the grounded mission still works and is visibly labelled as a fallback.
- **Privacy:** requests are processed in memory and are not persisted by the application. The OpenAI request sets `store: false`.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm start
```

Open <http://localhost:3000>.

The app works immediately in grounded demo mode. To enable the GPT-5.6 refinement layer, copy `.env.example` to `.env`, add `OPENAI_API_KEY`, and run `npm run start:env`. Never commit the key.

## Public judge demo

The `public/` directory also contains a browser-native deterministic engine. GitHub Pages deploys it automatically through `.github/workflows/pages.yml`, so judges can test Atlas without an account, API key or rebuild. The public demo is visibly labelled **Static judge demo**; the repository and local server retain the full GPT-5.6 integration.

After publishing the repository, open **Settings → Pages** and select **GitHub Actions** as the source. The next run of **Deploy public judge demo** publishes the site.

## Tests

```bash
npm test
```

The tests cover intent inference, constraint-based ranking, multi-day mission completeness, source provenance and weather-resilient family logic.

## Where Codex and GPT-5.6 contributed

Codex was used to turn the product concept into the complete runnable system: architecture, data model, hybrid planning algorithm, API integration, product interface, responsive design, tests, safeguards and documentation.

GPT-5.6 is used in the optional live reasoning layer to refine the grounded mission and translate visitor intent into concise operator opportunities. The deterministic engine chooses and sources the places first. GPT-5.6 receives the grounded mission, cannot add places or mutable facts, and returns strict JSON. This division was a deliberate product decision: creativity belongs in interpretation; factual destination control remains deterministic and traceable.

## Judge path

1. Open the app and choose **Rainy family** to see constraint-aware planning.
2. Generate the mission and inspect the **Guest journey**.
3. Open **Mission control** to see how the same request becomes operational priorities.
4. Open **Evidence** to inspect the provenance contract and live Atlas sources.
5. Try the active three-day example to see the itinerary and signals adapt.

## Real Atlas sources

- [Mittelrhein Explorer](https://www.bacchus-holiday-homes.com/mittelrhein-explorer/)
- [Mittelrhein Live Guide](https://www.bacchus-holiday-homes.com/mittelrhein-explorer/mittelrhein-live-guide/)
- [Mittelrhein Map](https://www.bacchus-holiday-homes.com/mittelrhein-explorer/mittelrhein-karte/)
- [Middle Rhine AI Concierge](https://www.bacchus-holiday-homes.com/ai-concierge/)
- [Direct booking](https://www.bacchus-holiday-homes.com/unterkuenfte/verfuegbarkeit-and-buchen/)

## Competition track

**Work & Productivity** — Atlas helps small tourism and hospitality operators create coherent visitor guidance, conversion paths and evidence-based operating priorities from infrastructure they already own.

## License

Released under the [MIT License](LICENSE).
