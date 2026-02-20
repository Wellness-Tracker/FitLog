import React, { useMemo, useState } from "react";
import { Badge, Button, Col, Form, ProgressBar, Row } from "react-bootstrap";
import PageShell from "../components/PageShell";
import { useAppDispatch, useAppState } from "../app/store";

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
    return `${toNum(v)} ${unit}`;
  }
  return `${toNum(v)}`;
}

export default function Habits() {
  const { habitsByDate, settings } = useAppState();
  const dispatch = useAppDispatch();

  const today = todayStr();
  const [selectedDate, setSelectedDate] = useState(today);

  const existing = habitsByDate[selectedDate] || {
    waterOz: 0,
    steps: 0,
    sleepHrs: 0,
    stretchDone: false,
    readDone: false,
    vitaminsDone: false,
    noSugarDone: false,
    walk20Done: false,
  };

  const [draft, setDraft] = useState(existing);

  function onDateChange(date) {
    setSelectedDate(date);
    const next = habitsByDate[date] || {
      waterOz: 0,
      steps: 0,
      sleepHrs: 0,
      stretchDone: false,
      readDone: false,
      vitaminsDone: false,
      noSugarDone: false,
      walk20Done: false,
    };
    setDraft(next);
  }

  function onChange(e) {
    const { name, type, checked, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function saveDay() {
    const normalized = {
      waterOz: toNum(draft.waterOz),
      steps: toNum(draft.steps),
      sleepHrs: toNum(draft.sleepHrs),
      stretchDone: !!draft.stretchDone,
      readDone: !!draft.readDone,
      vitaminsDone: !!draft.vitaminsDone,
      noSugarDone: !!draft.noSugarDone,
      walk20Done: !!draft.walk20Done,
    };

    dispatch({
      type: "UPSERT_HABITS_FOR_DATE",
      payload: { date: selectedDate, habits: normalized },
    });
  }

  function clearDay() {
    const empty = {
      waterOz: 0,
      steps: 0,
      sleepHrs: 0,
      stretchDone: false,
      readDone: false,
      vitaminsDone: false,
      noSugarDone: false,
      walk20Done: false,
    };
    setDraft(empty);
    dispatch({
      type: "UPSERT_HABITS_FOR_DATE",
      payload: { date: selectedDate, habits: empty },
    });
  }

  const completion = useMemo(() => {
    const bools = [
      !!draft.stretchDone,
      !!draft.readDone,
      !!draft.vitaminsDone,
      !!draft.noSugarDone,
      !!draft.walk20Done,
    ];
    const done = bools.filter(Boolean).length;
    const total = bools.length;
    const pct = Math.round((done / total) * 100);
    return { done, total, pct };
  }, [draft]);

  const badgeVariant =
    completion.pct >= 75 ? "success" : completion.pct >= 50 ? "warning" : "secondary";

  const waterPct = Math.min(
    100,
    Math.round((toNum(draft.waterOz) / settings.waterGoalOz) * 100 || 0)
  );
  const stepsPct = Math.min(
    100,
    Math.round((toNum(draft.steps) / settings.stepGoal) * 100 || 0)
  );
  const sleepPct = Math.min(
    100,
    Math.round((toNum(draft.sleepHrs) / settings.sleepGoal) * 100 || 0)
  );

  return (
    <PageShell title="Habits" icon="bi-check2-square">
      <Row className="g-2 align-items-end mb-3">
        <Col md={3}>
          <Form.Label className="text-muted small">Date</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </Col>

        <Col md={6} className="d-flex gap-2 align-items-end flex-wrap">
          <Badge bg={badgeVariant} className="px-3 py-2">
            Completion: {completion.done}/{completion.total} ({completion.pct}%)
          </Badge>
        </Col>

        <Col md={3} className="d-grid">
          <Button onClick={saveDay}>
            <i className="bi bi-check2 me-2" />
            Save Habits
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={6}>
          <div className="d-flex flex-column gap-3">
            <div>
              <div className="d-flex justify-content-between">
                <div className="fw-semibold">Water (oz)</div>
                <div className="text-muted small">
                  Goal: {settings.waterGoalOz} oz
                </div>
              </div>
              <Form.Control
                className="mt-1"
                type="number"
                min="0"
                name="waterOz"
                value={draft.waterOz}
                onChange={onChange}
              />
              <ProgressBar className="mt-2" now={waterPct} label={`${waterPct}%`} />
            </div>

            <div>
              <div className="d-flex justify-content-between">
                <div className="fw-semibold">Steps</div>
                <div className="text-muted small">Goal: {settings.stepGoal}</div>
              </div>
              <Form.Control
                className="mt-1"
                type="number"
                min="0"
                name="steps"
                value={draft.steps}
                onChange={onChange}
              />
              <ProgressBar className="mt-2" now={stepsPct} label={`${stepsPct}%`} />
            </div>

            <div>
              <div className="d-flex justify-content-between">
                <div className="fw-semibold">Sleep</div>
                <div className="text-muted small">
                  Goal: {settings.sleepGoal} hrs
                </div>
              </div>
              <Form.Control
                className="mt-1"
                type="number"
                min="0"
                step="0.1"
                name="sleepHrs"
                value={draft.sleepHrs}
                onChange={onChange}
              />
              <ProgressBar className="mt-2" now={sleepPct} label={`${sleepPct}%`} />
            </div>

            <Form.Check
              type="checkbox"
              id="stretchDone"
              name="stretchDone"
              checked={!!draft.stretchDone}
              onChange={onChange}
              label="Stretch / Mobility done"
            />
            <Form.Check
              type="checkbox"
              id="readDone"
              name="readDone"
              checked={!!draft.readDone}
              onChange={onChange}
              label="Read today"
            />
            <Form.Check
              type="checkbox"
              id="vitaminsDone"
              name="vitaminsDone"
              checked={!!draft.vitaminsDone}
              onChange={onChange}
              label="Took vitamins"
            />
            <Form.Check
              type="checkbox"
              id="noSugarDone"
              name="noSugarDone"
              checked={!!draft.noSugarDone}
              onChange={onChange}
              label="No sugary drinks"
            />
            <Form.Check
              type="checkbox"
              id="walk20Done"
              name="walk20Done"
              checked={!!draft.walk20Done}
              onChange={onChange}
              label="Walked 20 minutes"
            />

            <div className="d-flex gap-2 mt-2">
              <Button variant="outline-secondary" onClick={() => onDateChange(today)}>
                <i className="bi bi-calendar2-week me-2" />
                Jump to Today
              </Button>
              <Button variant="outline-danger" onClick={clearDay}>
                <i className="bi bi-x-circle me-2" />
                Clear Day
              </Button>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="border rounded-3 p-3 bg-white shadow-sm">
            <div className="fw-semibold mb-2">Selected Day Summary</div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Water</span>
              <span className="fw-semibold">{toNum(draft.waterOz)} oz</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Steps</span>
              <span className="fw-semibold">{toNum(draft.steps)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Sleep</span>
              <span className="fw-semibold">{toNum(draft.sleepHrs)} hrs</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Stretch</span>
              <span className="fw-semibold">
                {draft.stretchDone ? "Yes" : "No"}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Read</span>
              <span className="fw-semibold">{draft.readDone ? "Yes" : "No"}</span>
            </div>
          </div>
        </Col>
      </Row>
    </PageShell>
  );
}