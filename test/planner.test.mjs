import test from "node:test";
import assert from "node:assert/strict";
import { buildGroundedMission, inferContext, scorePlace } from "../src/planner.mjs";
import { places } from "../src/atlas-data.mjs";
import { buildStaticMission } from "../public/demo-engine.js";

const baseInput = {
  intent: "Plan a car-free Rhine trip with castles and local wine.",
  durationDays: 2,
  mobility: "car-free",
  pace: "balanced",
  audience: "couple",
};

test("infers relevant visitor constraints", () => {
  const context = inferContext(baseInput);
  assert.equal(context.carFree, true);
  assert.equal(context.castles, true);
  assert.equal(context.wine, true);
});

test("ranks walkable wine higher for a wine-led request", () => {
  const context = inferContext(baseInput);
  const wine = places.find((place) => place.id === "riesling-evening");
  const remoteCity = places.find((place) => place.id === "koblenz-confluence");
  assert.ok(scorePlace(wine, context, baseInput) > scorePlace(remoteCity, context, baseInput));
});

test("builds a complete, source-grounded two-day mission", () => {
  const mission = buildGroundedMission(baseInput);
  assert.equal(mission.days.length, 2);
  assert.equal(mission.days.flatMap((day) => day.stops).length, 6);
  assert.ok(mission.days.every((day) => day.stops.every((stop) => stop.sourceUrl.startsWith("https://"))));
  assert.equal(mission.operator.conversionActions.length, 3);
  assert.equal(mission.evidence.network.curatedPoiNetwork, 240);
});

test("rainy family requests prioritize weather resilience", () => {
  const mission = buildGroundedMission({
    intent: "Two rainy days with children and no car.",
    durationDays: 2,
    mobility: "car-free",
    pace: "slow",
    audience: "family",
  });
  assert.match(mission.days[0].theme, /Weather-resilient/);
  assert.ok(mission.operator.demandSignals.includes("Weather-resilient alternatives"));
  assert.ok(!mission.days.flatMap((day) => day.stops).some((stop) => stop.placeId === "riesling-evening"));
});

test("public judge demo runs fully in the browser without an API key", () => {
  const mission = buildStaticMission(baseInput);
  assert.equal(mission.mode, "static-judge-demo");
  assert.equal(mission.days.length, 2);
  assert.equal(mission.days.flatMap((day) => day.stops).length, 6);
  assert.ok(mission.evidence.sources.every((source) => source.url.startsWith("https://")));
});
