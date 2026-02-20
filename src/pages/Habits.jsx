import React, { useState } from "react";
import { Badge, Button, Col, Form, ProgressBar, Row } from "react-bootstrap";
import PageShell from "../components/PageShell";

// ---------- Helpers ----------
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function clampPct(value, goal) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

// ---------- Habit Definitions (EDIT THIS to add new habits) ----------
const HABITS = [
  // Water with unit selection + per-unit goals
  {
    key: "water",
    label: "Water",
    kind: "number",
    unitKey: "waterUnit",
    units: ["oz", "L"],
    goalsByUnit: { oz: 80, L: 2.5 },
    step: 0.1,
    min: 0,
  },
  { key: "steps", label: "Steps", kind: "number", goal: 9000, step: 100, min: 0 },
  { key: "sleep", label: "Sleep (hrs)", kind: "number", goal: 8, step: 0.1, min: 0 },
  { key: "stretchDone", label: "Stretch / Mobility", kind: "checkbox" },

  // Add more habits here anytime 👇
  { key: "protein", label: "Protein (g)", kind: "number", goal: 100, step: 1, min: 0 },
  { key: "meditation", label: "Meditation (min)", kind: "number", goal: 10, step: 1, min: 0 },
  { key: "noSugar", label: "No Sugar", kind: "checkbox" },
];

// Optional: which habits to show in the 7-day table columns (keep it readable)
const HISTORY_KEYS = ["water", "steps", "sleep", "protein", "stretchDone", "noSugar"];

// Create an empty day object based on HABITS
function makeEmptyDay() {
  const obj = {};
  for (const h of HABITS) {
    if (h.kind === "checkbox") obj[h.key] = false;
    else obj[h.key] = 0;

    if (h.units?.length && h.unitKey) obj[h.unitKey] = h.units[0]; // default first unit
  }
  return obj;
}

// Normalize draft into saved (numbers + booleans)
function normalizeDay(draft) {
  const out = {};
  for (const h of HABITS) {
    if (h.kind === "checkbox") out[h.key] = Boolean(draft[h.key]);
    else out[h.key] = toNum(draft[h.key]);

    if (h.units?.length && h.unitKey) out[h.unitKey] = draft[h.unitKey] || h.units[0];
  }
  return out;
}

// Get the goal for a habit for a given day (handles unit goals)
function getGoal(habit, dayObj) {
  if (habit.goalsByUnit && habit.unitKey) {
    const unit = dayObj?.[habit.unitKey] || habit.units?.[0];
    return habit.goalsByUnit[unit] ?? 0;
  }
  return habit.goal ?? 0;
}

// Display value nicely
function displayValue(habit, dayObj) {
  const v = dayObj?.[habit.key];
  if (habit.kind === "checkbox") return v ? "Yes" : "No";

  if (habit.goalsByUnit && habit.unitKey) {
    const unit = dayObj?.[habit.unitKey] || habit.units?.[0];
    return ${toNum(v)} ${unit};
  }
  return ${toNum(v)};
}

export default function Habits() {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);

  const [habits, setHabits] = useState({
    stretch: false,
    read: false,
    vitamins: false,
    noSugar: false,
    walk20: false,
  });

  function toggleHabit(e) {
    const { name, checked } = e.target;
    setHabits((prev) => ({ ...prev, [name]: checked }));
  }

  const total = Object.keys(habits).length;
  const done = Object.values(habits).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  const variant = pct >= 75 ? "success" : pct >= 50 ? "warning" : "secondary";

  return (
    <PageShell title="Habits" icon="bi-check2-square">
      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Col>

        <Col md={6} className="d-flex align-items-end">
          <Badge bg={variant} className="px-3 py-2">
            Completion: {done}/{total} ({pct}%)
          </Badge>
        </Col>
      </Row>

      <div className="d-flex flex-column gap-2">
        <Form.Check
          type="checkbox"
          name="stretch"
          checked={habits.stretch}
          onChange={toggleHabit}
          label="Stretch / Mobility"
        />
        <Form.Check
          type="checkbox"
          name="read"
          checked={habits.read}
          onChange={toggleHabit}
          label="Read today"
        />
        <Form.Check
          type="checkbox"
          name="vitamins"
          checked={habits.vitamins}
          onChange={toggleHabit}
          label="Took vitamins"
        />
        <Form.Check
          type="checkbox"
          name="noSugar"
          checked={habits.noSugar}
          onChange={toggleHabit}
          label="No sugary drinks"
        />
        <Form.Check
          type="checkbox"
          name="walk20"
          checked={habits.walk20}
          onChange={toggleHabit}
          label="Walked 20 minutes"
        />
      </div>

      <ProgressBar now={pct} label={`${pct}%`} className="mt-3" />
    </PageShell>
  );
}