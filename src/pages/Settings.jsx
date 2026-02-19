import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import PageShell from "../components/PageShell";

export default function Settings() {
  const [settings, setSettings] = useState({
    calorieGoal: 1900,
    proteinGoal: 100,
    stepGoal: 9000,
    sleepGoal: 8,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  }

  function saveSettings() {
    alert("Settings saved (Tier 4 will persist this globally).");
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
              value={settings.calorieGoal}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Protein Goal (g)</Form.Label>
            <Form.Control
              type="number"
              name="proteinGoal"
              value={settings.proteinGoal}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Steps Goal</Form.Label>
            <Form.Control
              type="number"
              name="stepGoal"
              value={settings.stepGoal}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Sleep Goal (hrs)</Form.Label>
            <Form.Control
              type="number"
              name="sleepGoal"
              value={settings.sleepGoal}
              onChange={handleChange}
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
