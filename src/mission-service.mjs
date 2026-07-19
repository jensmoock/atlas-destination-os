import OpenAI from "openai";
import { buildGroundedMission } from "./planner.mjs";

// Build Week reasoning boundary: the deterministic planner selects and sources
// every place first; GPT-5.6 may refine interpretation, never destination facts.

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    rationale: { type: "string" },
    demandSignals: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" },
    },
    executiveInsight: { type: "string" },
    opportunityRewrite: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          impact: { type: "string", enum: ["High", "Medium", "Moat"] },
          nextAction: { type: "string" },
        },
        required: ["title", "impact", "nextAction"],
      },
    },
  },
  required: ["headline", "rationale", "demandSignals", "executiveInsight", "opportunityRewrite"],
};

export async function createMission(input, options = {}) {
  const grounded = buildGroundedMission(input);
  if (!options.apiKey) return grounded;

  try {
    const openai = new OpenAI({ apiKey: options.apiKey });
    const response = await openai.responses.create({
      model: options.model || "gpt-5.6",
      store: false,
      instructions: [
        "You are the reasoning layer inside Atlas Destination OS, a destination operations system for independent tourism businesses.",
        "Refine the deterministic mission without adding places, opening hours, prices, schedules, or facts.",
        "Treat volatile information as requiring a live check. Never imply that a booking or reservation has been completed.",
        "Write concise, presentation-ready English. Focus on the closed loop from visitor intent to operator action.",
      ].join(" "),
      input: JSON.stringify({
        travelerRequest: input,
        groundedMission: grounded,
      }),
      text: {
        format: {
          type: "json_schema",
          name: "atlas_mission_refinement",
          strict: true,
          schema: responseSchema,
        },
      },
    });

    const refinement = JSON.parse(response.output_text);
    return {
      ...grounded,
      mode: "gpt-5.6",
      model: options.model || "gpt-5.6",
      headline: refinement.headline,
      rationale: refinement.rationale,
      operator: {
        ...grounded.operator,
        demandSignals: refinement.demandSignals,
        opportunities: refinement.opportunityRewrite,
        executiveInsight: refinement.executiveInsight,
      },
    };
  } catch (error) {
    console.error("GPT-5.6 refinement failed; serving grounded mission:", error.message);
    return {
      ...grounded,
      mode: "grounded-fallback",
      model: options.model || "gpt-5.6",
      fallbackReason: "The live reasoning layer was unavailable; deterministic guardrails remained operational.",
    };
  }
}
