import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Form,
  ProgressBar,
  Row,
  Table,
} from "react-bootstrap";
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
  const today = todayStr();

  // Seed sample data for today (optional)
  const seeded = makeEmptyDay();
  seeded.water = 52;
  seeded.waterUnit = "oz";
  seeded.steps = 7200;
  seeded.sleep = 6.8;
  seeded.protein = 85;
  seeded.stretchDone = false;
  seeded.noSugar = false;

  // habitsByDate[date] = { ...dynamic fields... }
  const [habitsByDate, setHabitsByDate] = useState({
    [today]: seeded,
  });

  const [selectedDate, setSelectedDate] = useState(today);

  const selectedSaved = habitsByDate[selectedDate] || makeEmptyDay();
  const [draft, setDraft] = useState({ ...selectedSaved });

  function onDateChange(date) {
    setSelectedDate(date);
    const existing = habitsByDate[date];
    setDraft(existing ? { ...existing } : makeEmptyDay());
  }

  function onChangeField(e) {
    const { name, value, type, checked } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function saveDay() {
    const cleaned = normalizeDay(draft);
    setHabitsByDate((prev) => ({ ...prev, [selectedDate]: cleaned }));
  }

  function clearDay() {
    const empty = makeEmptyDay();
    setDraft(empty);
    setHabitsByDate((prev) => ({ ...prev, [selectedDate]: empty }));
  }

  // Completion score: count habits that meet goal (numbers) or are checked (checkbox)
  const completion = useMemo(() => {
    let done = 0;
    let total = 0;

    for (const h of HABITS) {
      total += 1;

      if (h.kind === "checkbox") {
        if (Boolean(draft[h.key])) done += 1;
      } else {
        const goal = getGoal(h, draft);
        // If a number habit has no goal, treat >0 as "done"
        if (goal > 0) {
          if (toNum(draft[h.key]) >= goal) done += 1;
        } else {
          if (toNum(draft[h.key]) > 0) done += 1;
        }
      }
    }

    return { done, total, pct: Math.round((done / total) * 100) };
  }, [draft]);

  // Streak (based on stretchDone as "check-in" habit; you can change this to any checkbox habit)
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date(today);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      const entry = habitsByDate[key];
      if (!entry || !entry.stretchDone) break;
      count += 1;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [habitsByDate, today]);

  const badgeVariant =
    completion.pct >= 75 ? "success" : completion.pct >= 50 ? "warning" : "secondary";

  // Build last 7 days rows
  const historyRows = useMemo(() => {
    const rows = [];
    const d = new Date(today);
    for (let i = 0; i < 7; i++) {
      const date = d.toISOString().slice(0, 10);
      const entry = habitsByDate[date];
      rows.push({
        date,
        entry: entry || null,
      });
      d.setDate(d.getDate() - 1);
    }
    return rows;
  }, [habitsByDate, today]);

  // Render input rows for habits
  const habitInputs = HABITS.map((h) => {
    if (h.kind === "checkbox") {
      return (
        <Form.Check
          key={h.key}
          type="checkbox"
          id={h.key}
          name={h.key}
          checked={Boolean(draft[h.key])}
          onChange={onChangeField}
          label={h.label}
        />
      );
    }

    const goal = getGoal(h, draft);
    const value = toNum(draft[h.key]);
    const pct = clampPct(value, goal);

    return (
      <div key={h.key} className="d-flex flex-column gap-1">
        <div className="d-flex justify-content-between">
          <div className="fw-semibold">{h.label}</div>
          <div className="text-muted small">
            {goal > 0 ? Goal: ${goal}${h.goalsByUnit ? ` ${draft[h.unitKey]} : ""}` : "Goal: —"}
          </div>
        </div>

        <Row className="g-2 align-items-center">
          <Col xs={h.units?.length ? 8 : 12}>
            <Form.Control
              type="number"
              min={h.min ?? 0}
              step={h.step ?? 1}
              name={h.key}
              value={draft[h.key]}
              onChange={onChangeField}
            />
          </Col>

          {h.units?.length && h.unitKey ? (
            <Col xs={4}>
              <Form.Select
                name={h.unitKey}
                value={draft[h.unitKey]}
                onChange={onChangeField}
              >
                {h.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Form.Select>
            </Col>
          ) : null}
        </Row>

        <ProgressBar now={pct} label={${pct}%} />
      </div>
    );
  });

  return (
    <PageShell title="Habits" icon="bi-check2-square">
      {/* Header */}
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
          <Badge bg="info" text="dark" className="px-3 py-2">
            Stretch streak: {streak} day{streak === 1 ? "" : "s"}
          </Badge>
        </Col>

        <Col md={3} className="d-grid">
          <Button onClick={saveDay}>
            <i className="bi bi-check2 me-2" />
            Save Habits
          </Button>
        </Col>
      </Row>

      {/* Form + Summary */}
      <Row className="g-3">
        <Col lg={6}>
          <div className="d-flex flex-column gap-3">{habitInputs}</div>

          <div className="d-flex gap-2 mt-3">
            <Button variant="outline-secondary" onClick={() => onDateChange(today)}>
              <i className="bi bi-calendar2-week me-2" />
              Jump to Today
            </Button>
            <Button variant="outline-danger" onClick={clearDay}>
              <i className="bi bi-x-circle me-2" />
              Clear Day
            </Button>
          </div>
        </Col>

        <Col lg={6}>
          <div className="border rounded-3 p-3 bg-white shadow-sm">
            <div className="fw-semibold mb-2">Selected Day Summary</div>

            {HABITS.slice(0, 7).map((h) => (
              <div key={h.key} className="d-flex justify-content-between">
                <span className="text-muted">{h.label}</span>
                <span className="fw-semibold">{displayValue(h, draft)}</span>
              </div>
            ))}

            <div className="mt-3 text-muted small">
              Add new habits by editing the <b>HABITS</b> array at the top of this file.
            </div>
          </div>
        </Col>
      </Row>

      {/* History table */}
      <div className="mt-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="fw-semibold">Last 7 Days</div>
          <div className="text-muted small">(saved entries)</div>
        </div>

        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Date</th>
              {HISTORY_KEYS.map((k) => {
                const h = HABITS.find((x) => x.key === k);
                return <th key={k} className="text-end">{h ? h.label : k}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {historyRows.map(({ date, entry }) => (
              <tr key={date}>
                <td className={date === selectedDate ? "fw-semibold" : ""}>{date}</td>
                {HISTORY_KEYS.map((k) => {
                  const h = HABITS.find((x) => x.key === k);
                  const val = entry ? (h ? displayValue(h, entry) : entry[k]) : "—";
                  return (
                    <td key={k} className="text-end">
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </PageShell>
  );
}
