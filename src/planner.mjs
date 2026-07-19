import { basecamp, places, surfaceById, surfaces } from "./atlas-data.mjs";

const timeSlots = ["09:00", "12:00", "15:00"];

export function buildGroundedMission(input) {
  const context = inferContext(input);
  const ranked = places
    .map((place) => ({ place, score: scorePlace(place, context, input) }))
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name));

  const stopCount = Math.min(input.durationDays * 3, ranked.length);
  const selected = diversify(ranked, stopCount).map(({ place }) => place);
  const days = Array.from({ length: input.durationDays }, (_, index) => ({
    day: index + 1,
    theme: dayTheme(selected.slice(index * 3, index * 3 + 3), context),
    stops: selected.slice(index * 3, index * 3 + 3).map((place, stopIndex) =>
      missionStop(place, timeSlots[stopIndex], input)
    ),
  }));

  const usedSources = [...new Set(selected.map((place) => place.source))]
    .map(surfaceById);

  return {
    id: `ATLAS-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
    mode: "grounded-demo",
    model: "Deterministic guardrail engine",
    basecamp,
    request: input,
    headline: headline(context, input),
    rationale: rationale(context, input),
    days,
    operator: operatorView(context, input, selected),
    evidence: {
      principle: "Every recommendation must resolve to an owned Atlas source or be marked for live verification.",
      sources: usedSources,
      network: {
        curatedPoiNetwork: 240,
        demoRecordsEvaluated: places.length,
        connectedSurfaces: surfaces.length,
      },
    },
  };
}

export function inferContext(input) {
  const text = input.intent.toLowerCase();
  return {
    rain: /(rain|wet|storm|indoor|regen|schlecht)/.test(text),
    family: input.audience === "family" || /(child|children|kid|family|kinder|familie)/.test(text),
    wine: /(wine|riesling|winery|wein)/.test(text),
    castles: /(castle|burg|history|historic|heritage)/.test(text),
    hiking: input.pace === "active" || /(hik|walk|trail|wander)/.test(text),
    river: /(river|rhine|boat|ship|rhein|schiff)/.test(text),
    photo: /(photo|view|scenic|instagram|aussicht)/.test(text),
    carFree: input.mobility === "car-free" || /(no car|car-free|train|ohne auto)/.test(text),
  };
}

export function scorePlace(place, context, input) {
  let score = 10;
  const themeWeights = {
    wine: 6,
    castles: 5,
    hiking: 6,
    river: 5,
    photo: 4,
  };

  for (const [interest, weight] of Object.entries(themeWeights)) {
    if (context[interest] && place.themes.some((theme) => theme.includes(interest.replace("castles", "castle")))) {
      score += weight;
    }
  }

  if (context.castles && (place.category === "castle" || place.themes.includes("history"))) score += 6;
  if (context.river && ["river", "viewpoint"].includes(place.category)) score += 5;
  if (context.hiking && ["hike", "viewpoint"].includes(place.category)) score += 5;
  if (context.wine && place.category === "wine") score += 10;
  if (context.rain) score += place.indoorScore * 2 - (place.indoorScore === 0 ? 8 : 0);
  if (context.family) {
    score += place.familyScore * 1.5;
    if (place.category === "wine") score -= 14;
  }
  if (context.carFree) score += place.modes.includes("train") || place.modes.includes("walk") ? 4 : -10;
  if (input.pace === "slow" && place.duration <= 120) score += 4;
  if (input.pace === "active" && place.duration >= 150) score += 3;
  if (place.location === "Bacharach") score += 2;

  return score;
}

function diversify(ranked, limit) {
  const selected = [];
  const categoryCounts = new Map();

  for (const entry of ranked) {
    const count = categoryCounts.get(entry.place.category) || 0;
    if (count < 2 || selected.length + (ranked.length - ranked.indexOf(entry)) <= limit) {
      selected.push(entry);
      categoryCounts.set(entry.place.category, count + 1);
    }
    if (selected.length === limit) break;
  }

  return selected;
}

function missionStop(place, time, input) {
  const source = surfaceById(place.source);
  const transport = place.location === "Bacharach"
    ? "Walk from Basecamp"
    : input.mobility === "car"
      ? "Regional drive"
      : place.modes.includes("train")
        ? "Train + short walk"
        : "Walk / local connection";

  return {
    placeId: place.id,
    time,
    title: place.name,
    location: place.location,
    durationMinutes: place.duration,
    transport,
    reason: stopReason(place, input),
    action: place.action,
    sourceLabel: source.label,
    sourceUrl: source.url,
    verification: place.volatile ? "Live check required" : "Stable Atlas knowledge",
  };
}

function stopReason(place, input) {
  if (input.audience === "family" && place.familyScore >= 4) return "High family fit with a simple next action.";
  if (place.category === "wine") return "A walkable local evening turns guidance into regional value.";
  if (place.category === "castle") return "A signature Middle Rhine experience grounded in the Atlas map.";
  if (place.category === "hike") return "An active Basecamp route with a rail-supported return option.";
  return "Strong fit for the request without breaking the day’s travel logic.";
}

function dayTheme(stops, context) {
  if (context.rain) return "Weather-resilient Rhine culture";
  if (stops.some((stop) => stop.category === "castle")) return "Castles, context & river views";
  if (stops.some((stop) => stop.category === "hike")) return "Trail to town, without the car";
  return "Basecamp discoveries at human pace";
}

function headline(context, input) {
  const lead = context.carFree ? "A car-free" : "A connected";
  const audience = input.audience === "family" ? "family mission" : `${input.audience} mission`;
  return `${lead} ${input.durationDays}-day ${audience} from Bacharach`;
}

function rationale(context, input) {
  const signals = [
    context.rain ? "weather resilience" : "outdoor access",
    context.carFree ? "rail-and-walk continuity" : "regional reach",
    input.pace === "active" ? "active pacing" : "low-friction pacing",
  ];
  return `Atlas balanced ${signals.join(", ")} and conversion-ready actions. Volatile facts stay visibly marked instead of being guessed.`;
}

function operatorView(context, input, selected) {
  const volatileCount = selected.filter((place) => place.volatile).length;
  const localCount = selected.filter((place) => place.location === "Bacharach").length;
  const demandSignals = [
    context.carFree ? "Car-free itinerary intent" : "Regional mobility intent",
    context.family ? "Family suitability" : `${capitalize(input.audience)} experience fit`,
    context.rain ? "Weather-resilient alternatives" : "Signature outdoor experiences",
  ];
  if (context.wine) demandSignals.push("Walkable wine experience");
  if (context.castles) demandSignals.push("Castle-led trip motivation");

  return {
    metrics: [
      { label: "Trip fit", value: `${Math.min(96, 74 + selected.length * 2)}%` },
      { label: "Local value kept", value: `${Math.round((localCount / selected.length) * 100)}%` },
      { label: "Live checks", value: String(volatileCount) },
      { label: "Direct actions", value: "3" },
    ],
    demandSignals,
    opportunities: [
      {
        title: "Direct-stay conversion",
        impact: "High",
        nextAction: "Place Basecamp availability after the complete mission—not before trust is earned.",
      },
      {
        title: context.rain ? "Indoor partner inventory" : "Bookable local experience layer",
        impact: "Medium",
        nextAction: context.rain
          ? "Add verified same-day indoor capacity and opening signals."
          : "Connect one bookable local partner to the highest-intent stop.",
      },
      {
        title: "Demand-to-content loop",
        impact: "Moat",
        nextAction: `Create a reusable ${demandSignals[0].toLowerCase()} mission template from this anonymous pattern.`,
      },
    ],
    trustAlerts: volatileCount
      ? [
          `${volatileCount} selected experiences depend on schedules, access or opening status.`,
          "Atlas labels those facts for live verification instead of presenting stale certainty.",
        ]
      : ["All selected facts are stable Atlas knowledge; no live dependency was inferred."],
    conversionActions: [
      { label: "Check a matching stay", url: basecamp.bookingUrl },
      { label: "Continue in the Live Guide", url: surfaceById("live-guide").url },
      { label: "Refine with the AI Concierge", url: surfaceById("concierge").url },
    ],
  };
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
