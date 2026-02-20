import React from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import PageShell from "../components/PageShell";

export default function Progress() {
  // Sample numbers for Tier 3
  const weekly = {
    caloriesIn: 11200,
    caloriesBurned: 2800,
    workouts: 5,
    proteinAvg: 92,
  };

  const net = weekly.caloriesIn - weekly.caloriesBurned;

  return (
    <PageShell title="Progress" icon="bi-graph-up">
      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Weekly Calories</Card.Title>
              <div>Calories In: {weekly.caloriesIn}</div>
              <div>Burned: {weekly.caloriesBurned}</div>
              <Badge bg={net <= 0 ? "success" : "warning"} className="mt-2">
                Net: {net}
              </Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Activity Summary</Card.Title>
              <div>Workouts: {weekly.workouts}</div>
              <div>Avg Protein: {weekly.proteinAvg} g</div>
              <div>Consistency improving 👍</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
}