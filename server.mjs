import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createMission } from "./src/mission-service.mjs";

const app = express();
const port = Number(process.env.PORT || 3000);
const root = path.dirname(fileURLToPath(import.meta.url));

app.disable("x-powered-by");
app.use(express.json({ limit: "64kb" }));
app.use(express.static(path.join(root, "public"), {
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
}));

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    mode: process.env.OPENAI_API_KEY ? "gpt-5.6" : "grounded-demo",
    model: process.env.OPENAI_MODEL || "gpt-5.6",
    privacy: "No traveler request is stored by Atlas.",
  });
});

app.post("/api/mission", async (request, response) => {
  try {
    const payload = validatePayload(request.body);
    const mission = await createMission(payload, {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-5.6",
    });

    response.json(mission);
  } catch (error) {
    const status = error.statusCode || 500;
    response.status(status).json({
      error: status === 500 ? "Mission generation failed." : error.message,
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("*splat", (_request, response) => {
  response.sendFile(path.join(root, "public", "index.html"));
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Atlas Mission Control is running on http://localhost:${port}`);
  });
}

function validatePayload(value) {
  const intent = typeof value?.intent === "string" ? value.intent.trim() : "";
  if (intent.length < 12 || intent.length > 800) {
    const error = new Error("Describe the trip in 12–800 characters.");
    error.statusCode = 400;
    throw error;
  }

  const durationDays = Number(value?.durationDays);
  if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 3) {
    const error = new Error("Choose a duration between one and three days.");
    error.statusCode = 400;
    throw error;
  }

  return {
    intent,
    durationDays,
    mobility: ["car-free", "mixed", "car"].includes(value?.mobility)
      ? value.mobility
      : "car-free",
    pace: ["slow", "balanced", "active"].includes(value?.pace)
      ? value.pace
      : "balanced",
    audience: ["couple", "family", "friends", "solo"].includes(value?.audience)
      ? value.audience
      : "couple",
  };
}
