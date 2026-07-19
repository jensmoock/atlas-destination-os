import { buildStaticMission } from "./demo-engine.js";

const $ = (selector) => document.querySelector(selector);

const examples = {
  couple: {
    intent: "We are a couple without a car. Plan two days with castles, Rhine views and a relaxed Riesling evening. Avoid stressful connections.",
    duration: "2", audience: "couple", mobility: "car-free", pace: "balanced",
  },
  family: {
    intent: "We have two rainy days with children, no car and need a flexible plan with indoor fallbacks and short transfers.",
    duration: "2", audience: "family", mobility: "car-free", pace: "slow",
  },
  active: {
    intent: "Build an active three-day Basecamp plan with one major hike, castle views and rail-supported returns to Bacharach.",
    duration: "3", audience: "solo", mobility: "car-free", pace: "active",
  },
};

let currentMission;

bootstrap();

async function bootstrap() {
  bindEvents();
  try {
    const response = await fetch("/api/health");
    const health = await response.json();
    $("#system-status").textContent = health.mode === "gpt-5.6"
      ? `GPT-5.6 reasoning layer ready`
      : "Grounded demo · GPT-5.6 ready when connected";
  } catch {
    $("#system-status").textContent = "Public judge demo · runs without an account";
  }
}

function bindEvents() {
  $("#generate").addEventListener("click", generateMission);
  document.querySelectorAll(".example").forEach((button) => {
    button.addEventListener("click", () => applyExample(button.dataset.example));
  });
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });
}

function applyExample(key) {
  const example = examples[key];
  $("#intent").value = example.intent;
  $("#duration").value = example.duration;
  $("#audience").value = example.audience;
  $("#mobility").value = example.mobility;
  $("#pace").value = example.pace;
}

async function generateMission() {
  const button = $("#generate");
  const intent = $("#intent").value.trim();
  if (intent.length < 12) {
    $("#intent").focus();
    return;
  }

  button.disabled = true;
  $("#empty-state").classList.add("hidden");
  $("#mission").classList.add("hidden");
  $("#loading-state").classList.remove("hidden");
  animateLoadingCopy();

  const payload = {
    intent,
    durationDays: Number($("#duration").value),
    audience: $("#audience").value,
    mobility: $("#mobility").value,
    pace: $("#pace").value,
  };

  try {
    const response = await fetch("/api/mission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();
    currentMission = data;
    renderMission(data);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 450));
    currentMission = buildStaticMission(payload);
    renderMission(currentMission);
  } finally {
    $("#loading-state").classList.add("hidden");
    button.disabled = false;
  }
}

function animateLoadingCopy() {
  const messages = [
    "Grounding the request in verified destination knowledge…",
    "Balancing mobility, pace and experience fit…",
    "Converting the journey into operator signals…",
  ];
  let index = 0;
  const timer = setInterval(() => {
    if ($("#loading-state").classList.contains("hidden")) return clearInterval(timer);
    index = (index + 1) % messages.length;
    $("#loading-copy").textContent = messages[index];
  }, 900);
}

function renderMission(mission) {
  $("#mission-id").textContent = `${mission.id} · ${new Date(mission.generatedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`;
  $("#mission-headline").textContent = mission.headline;
  $("#mission-rationale").textContent = mission.rationale;
  $("#mode-pill").textContent = mission.mode === "gpt-5.6"
    ? "GPT-5.6 + guardrails"
    : mission.mode === "static-judge-demo"
      ? "Static judge demo"
      : "Grounded demo";
  $("#tab-journey").innerHTML = journeyHtml(mission);
  $("#tab-operator").innerHTML = operatorHtml(mission.operator);
  $("#tab-evidence").innerHTML = evidenceHtml(mission.evidence);
  $("#mission").classList.remove("hidden");
  switchTab("journey");
}

function journeyHtml(mission) {
  return mission.days.map((day) => `
    <section class="day">
      <div class="day-heading"><h3>Day ${day.day}</h3><span>${escapeHtml(day.theme)}</span></div>
      <div class="stop-list">
        ${day.stops.map((stop) => `
          <article class="stop-card">
            <div class="stop-time"><span>${escapeHtml(stop.time)} · ${stop.durationMinutes} min</span><span class="verification">${escapeHtml(stop.verification)}</span></div>
            <h4>${escapeHtml(stop.title)}</h4>
            <p class="location">${escapeHtml(stop.location)}</p>
            <p class="stop-reason">${escapeHtml(stop.reason)}</p>
            <p class="route">${escapeHtml(stop.transport)} · ${escapeHtml(stop.action)}</p>
            <a class="source-link" href="${safeUrl(stop.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(stop.sourceLabel)} ↗</a>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function operatorHtml(operator) {
  return `
    <div class="metric-grid">
      ${operator.metrics.map((metric) => `<div class="metric"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`).join("")}
    </div>
    <div class="operator-grid">
      <div>
        <section class="operator-section">
          <h3>Demand signals</h3>
          <div class="signal-list">${operator.demandSignals.map((signal) => `<span class="signal">${escapeHtml(signal)}</span>`).join("")}</div>
        </section>
        <section class="operator-section">
          <h3>Trust layer</h3>
          <ul class="trust-list">${operator.trustAlerts.map((alert) => `<li>${escapeHtml(alert)}</li>`).join("")}</ul>
        </section>
      </div>
      <section class="operator-section">
        <h3>Prioritised opportunities</h3>
        ${operator.opportunities.map((item) => `
          <article class="opportunity">
            <h4>${escapeHtml(item.title)}</h4><span class="impact">${escapeHtml(item.impact)}</span>
            <p>${escapeHtml(item.nextAction)}</p>
          </article>
        `).join("")}
        <div class="action-row">${operator.conversionActions.map((action) => `<a href="${safeUrl(action.url)}" target="_blank" rel="noreferrer">${escapeHtml(action.label)} ↗</a>`).join("")}</div>
      </section>
    </div>
  `;
}

function evidenceHtml(evidence) {
  return `
    <p class="evidence-summary">${escapeHtml(evidence.principle)}</p>
    <div class="metric-grid">
      <div class="metric"><strong>${evidence.network.curatedPoiNetwork}</strong><span>POIs in source network</span></div>
      <div class="metric"><strong>${evidence.network.demoRecordsEvaluated}</strong><span>Demo records evaluated</span></div>
      <div class="metric"><strong>${evidence.network.connectedSurfaces}</strong><span>Connected surfaces</span></div>
      <div class="metric"><strong>0</strong><span>Invented live facts</span></div>
    </div>
    <div class="evidence-grid">
      ${evidence.sources.map((source) => `
        <article class="evidence-card">
          <span>${escapeHtml(source.purpose)}</span>
          <h4>${escapeHtml(source.label)}</h4>
          <p>Owned Atlas source used to ground this mission.</p>
          <a href="${safeUrl(source.url)}" target="_blank" rel="noreferrer">Inspect source ↗</a>
        </article>
      `).join("")}
    </div>
  `;
}

function switchTab(name) {
  document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("active", button.dataset.tab === name));
  document.querySelectorAll(".tab-content").forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${name}`));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
}
