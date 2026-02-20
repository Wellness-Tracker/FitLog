import React, { useMemo } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import PageShell from "../components/PageShell";
import { useAppState } from "../app/store";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getLastNDates(n) {
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() - 1);
  }
  return out;
}

export default function Progress() {
  const state = useAppState();
  const today = todayStr();

  const last7Dates = useMemo(() => getLastNDates(7), []);

  const weekly = useMemo(() => {
    let caloriesIn = 0;
    let caloriesBurned = 0;
    let workoutsCount = 0;
    let proteinTotal = 0;
    let proteinDays = 0;

    for (const date of last7Dates) {
      const dayMeals = state.meals.filter((m) => m.date === date);
      const dayWorkouts = state.workouts.filter((w) => w.date === date);

      const dayCalsIn = dayMeals.reduce(
        (sum, m) => sum + (m.calories || 0),
        0
      );
      const dayProtein = dayMeals.reduce(
        (sum, m) => sum + (m.protein || 0),
        0
      );
      const dayCalsBurn = dayWorkouts.reduce(
        (sum, w) => sum + (w.caloriesBurned || 0),
        0
      );

      caloriesIn += dayCalsIn;
      caloriesBurned += dayCalsBurn;
      workoutsCount += dayWorkouts.length;

      if (dayMeals.length > 0) {
        proteinTotal += dayProtein;
        proteinDays += 1;
      }
    }

    return {
      caloriesIn,
      caloriesBurned,
      workoutsCount,
      proteinAvg:
        proteinDays > 0 ? Math.round(proteinTotal / proteinDays) : 0,
    };
  }, [state.meals, state.workouts, last7Dates]);

  const net = weekly.caloriesIn - weekly.caloriesBurned;

  return (
    <PageShell title="Progress" icon="bi-graph-up">
      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Last 7 Days – Calories</Card.Title>
              <div>Calories In: {weekly.caloriesIn}</div>
              <div>Burned: {weekly.caloriesBurned}</div>
              <Badge bg={net <= 0 ? "success" : "warning"} className="mt-2">
                Net: {net} cal {net <= 0 ? "(deficit)" : "(surplus)"}
              </Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Last 7 Days – Activity</Card.Title>
              <div>Workouts: {weekly.workoutsCount}</div>
              <div>Avg Protein on logged days: {weekly.proteinAvg} g</div>
              <div className="text-muted small mt-2">
                Charts can be added later with Recharts if you want visuals.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
}