import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import PageShell from "../components/PageShell";
import { useAppDispatch, useAppState } from "../app/store";

export default function Settings() {
  const { settings } = useAppState();
  const dispatch = useAppDispatch();

  const [draft, setDraft] = useState(settings);

  function onChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  function saveSettings() {
    dispatch({ type: "UPDATE_SETTINGS", payload: draft });
  }

  return (
    <PageShell title="Settings" icon="bi-gear">
      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Daily Calorie Goal</Form.Label>
            <Form.Control
              type="number"
              name="calorieGoal"
              value={draft.calorieGoal}
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Protein Goal (g)</Form.Label>
            <Form.Control
              type="number"
              name="proteinGoal"
              value={draft.proteinGoal}
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Steps Goal</Form.Label>
            <Form.Control
              type="number"
              name="stepGoal"
              value={draft.stepGoal}
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Sleep Goal (hrs)</Form.Label>
            <Form.Control
              type="number"
              name="sleepGoal"
              value={draft.sleepGoal}
              onChange={onChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Water Goal (oz)</Form.Label>
            <Form.Control
              type="number"
              name="waterGoalOz"
              value={draft.waterGoalOz}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Button className="mt-3" onClick={saveSettings}>
        Save Settings
      </Button>
    </PageShell>
  );
}
