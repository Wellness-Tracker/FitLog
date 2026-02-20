import React, { useState } from "react";
import { Badge, Col, Form, ProgressBar, Row } from "react-bootstrap";
import PageShell from "../components/PageShell";

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
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

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