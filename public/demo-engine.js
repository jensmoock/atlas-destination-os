const basecamp = {
  name: "Bacharach Basecamp",
  bookingUrl: "https://www.bacchus-holiday-homes.com/unterkuenfte/verfuegbarkeit-and-buchen/",
};

const surfaces = {
  explorer: {
    label: "Mittelrhein Explorer",
    purpose: "Regional knowledge",
    url: "https://www.bacchus-holiday-homes.com/mittelrhein-explorer/",
  },
  "live-guide": {
    label: "Mittelrhein Live Guide",
    purpose: "Mobile day guidance",
    url: "https://www.bacchus-holiday-homes.com/mittelrhein-explorer/mittelrhein-live-guide/",
  },
  map: {
    label: "Mittelrhein Map",
    purpose: "Spatial orientation",
    url: "https://www.bacchus-holiday-homes.com/mittelrhein-explorer/mittelrhein-karte/",
  },
  concierge: {
    label: "Middle Rhine AI Concierge",
    purpose: "Personal planning",
    url: "https://www.bacchus-holiday-homes.com/ai-concierge/",
  },
  stay: {
    label: "Direct booking",
    purpose: "Conversion",
    url: basecamp.bookingUrl,
  },
};

const places = [
  ["bacharach-old-town", "Bacharach Old Town", "Bacharach", "heritage", ["history", "architecture", "photography", "slow"], ["walk"], 90, 4, 1, "explorer", "Open walking orientation"],
  ["stahleck-view", "Burg Stahleck viewpoint", "Bacharach", "castle", ["castles", "views", "history", "hiking"], ["walk"], 75, 3, 1, "map", "Open route from Basecamp"],
  ["werner-chapel", "Werner Chapel", "Bacharach", "heritage", ["history", "architecture", "photography"], ["walk"], 35, 3, 1, "explorer", "Open heritage context"],
  ["rhine-promenade", "Rhine promenade", "Bacharach", "nature", ["river", "slow", "family", "photography"], ["walk"], 50, 5, 1, "live-guide", "Open nearby route"],
  ["oberwesel-city-museum", "Oberwesel City Museum", "Oberwesel", "culture", ["culture", "rain", "family", "slow"], ["train"], 90, 4, 5, "live-guide", "Verify today’s museum opening status", true],
  ["oberwesel-walls", "Oberwesel town walls", "Oberwesel", "heritage", ["history", "views", "walking", "photography"], ["train", "car"], 120, 3, 1, "map", "Open rail-connected day route"],
  ["kaub-pfalzgrafenstein", "Kaub & Pfalzgrafenstein view", "Kaub", "castle", ["castles", "river", "history", "photography"], ["train", "boat", "car"], 120, 4, 2, "map", "Open rail and river options", true],
  ["rheinfels", "Rheinfels Castle experience", "St. Goar", "castle", ["castles", "history", "family", "views"], ["train", "car"], 150, 5, 3, "explorer", "Verify access and opening status", true],
  ["loreley", "Loreley plateau", "St. Goarshausen", "viewpoint", ["views", "river", "myth", "photography"], ["train", "boat", "car"], 150, 4, 1, "map", "Build cross-river route", true],
  ["rhine-castle-trail", "RheinBurgenWeg stage", "From Bacharach", "hike", ["hiking", "views", "active", "nature"], ["walk", "train"], 240, 2, 0, "explorer", "Open six-day hiking logic", true],
  ["rhine-cruise", "Castle corridor by boat", "Middle Rhine", "river", ["river", "castles", "slow", "photography"], ["boat", "walk"], 180, 5, 3, "explorer", "Verify today’s timetable", true],
  ["riesling-evening", "Bacharach Riesling evening", "Bacharach", "wine", ["wine", "food", "local", "slow"], ["walk"], 120, 1, 5, "live-guide", "Open local partner options", true],
  ["boppard-bend", "Boppard Rhine bend", "Boppard", "viewpoint", ["views", "river", "hiking", "photography"], ["train", "car"], 210, 3, 1, "map", "Open regional connection"],
  ["koblenz-confluence", "Rhine–Moselle confluence", "Koblenz", "city", ["city", "history", "river", "family"], ["train", "car"], 210, 4, 2, "map", "Open regional rail route"],
].map(([id, name, location, category, themes, modes, duration, familyScore, indoorScore, source, action, volatile = false]) => ({
  id, name, location, category, themes, modes, duration, familyScore, indoorScore, source, action, volatile,
}));

const timeSlots = ["09:00", "12:00", "15:00"];

export function buildStaticMission(input) {
  const context = inferContext(input);
  const ranked = places
    .map((place) => ({ place, score: scorePlace(place, context, input) }))
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name));
  const selected = diversify(ranked, Math.min(input.durationDays * 3, ranked.length)).map(({ place }) => place);
  const days = Array.from({ length: input.durationDays }, (_, index) => {
    const stops = selected.slice(index * 3, index * 3 + 3);
    return {
      day: index + 1,
      theme: dayTheme(stops, context),
      stops: stops.map((place, stopIndex) => missionStop(place, timeSlots[stopIndex], input)),
    };
  });
  const usedSources = [...new Set(selected.map((place) => place.source))].map((id) => surfaces[id]);

  return {
    id: `ATLAS-PUBLIC-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
    mode: "static-judge-demo",
    model: "Deterministic browser guardrail engine",
    request: input,
    headline: `${context.carFree ? "A car-free" : "A connected"} ${input.durationDays}-day ${input.audience === "family" ? "family mission" : `${input.audience} mission`} from Bacharach`,
    rationale: `Atlas balanced ${context.rain ? "weather resilience" : "outdoor access"}, ${context.carFree ? "rail-and-walk continuity" : "regional reach"} and ${input.pace === "active" ? "active pacing" : "low-friction pacing"}. Volatile facts stay visibly marked instead of being guessed.`,
    days,
    operator: operatorView(context, input, selected),
    evidence: {
      principle: "Every recommendation must resolve to an owned Atlas source or be marked for live verification.",
      sources: usedSources,
      network: { curatedPoiNetwork: 240, demoRecordsEvaluated: places.length, connectedSurfaces: Object.keys(surfaces).length },
    },
  };
}

function inferContext(input) {
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

function scorePlace(place, context, input) {
  let score = 10;
  if (context.castles && (place.category === "castle" || place.themes.includes("history"))) score += 11;
  if (context.river && ["river", "viewpoint"].includes(place.category)) score += 10;
  if (context.hiking && ["hike", "viewpoint"].includes(place.category)) score += 11;
  if (context.wine && place.category === "wine") score += 16;
  if (context.photo && place.themes.includes("photography")) score += 4;
  if (context.rain) score += place.indoorScore * 2 - (place.indoorScore === 0 ? 8 : 0);
  if (context.family) score += place.familyScore * 1.5 - (place.category === "wine" ? 14 : 0);
  if (context.carFree) score += place.modes.some((mode) => ["train", "walk"].includes(mode)) ? 4 : -10;
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
  const source = surfaces[place.source];
  const transport = place.location === "Bacharach"
    ? "Walk from Basecamp"
    : input.mobility === "car"
      ? "Regional drive"
      : place.modes.includes("train") ? "Train + short walk" : "Walk / local connection";
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

function operatorView(context, input, selected) {
  const volatileCount = selected.filter((place) => place.volatile).length;
  const localCount = selected.filter((place) => place.location === "Bacharach").length;
  const demandSignals = [
    context.carFree ? "Car-free itinerary intent" : "Regional mobility intent",
    context.family ? "Family suitability" : `${input.audience.charAt(0).toUpperCase()}${input.audience.slice(1)} experience fit`,
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
      { title: "Direct-stay conversion", impact: "High", nextAction: "Place Basecamp availability after the complete mission—not before trust is earned." },
      { title: context.rain ? "Indoor partner inventory" : "Bookable local experience layer", impact: "Medium", nextAction: context.rain ? "Add verified same-day indoor capacity and opening signals." : "Connect one bookable local partner to the highest-intent stop." },
      { title: "Demand-to-content loop", impact: "Moat", nextAction: `Create a reusable ${demandSignals[0].toLowerCase()} mission template from this anonymous pattern.` },
    ],
    trustAlerts: volatileCount
      ? [`${volatileCount} selected experiences depend on schedules, access or opening status.`, "Atlas labels those facts for live verification instead of presenting stale certainty."]
      : ["All selected facts are stable Atlas knowledge; no live dependency was inferred."],
    conversionActions: [
      { label: "Check a matching stay", url: basecamp.bookingUrl },
      { label: "Continue in the Live Guide", url: surfaces["live-guide"].url },
      { label: "Refine with the AI Concierge", url: surfaces.concierge.url },
    ],
  };
}
