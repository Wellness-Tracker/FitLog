import React, { useMemo } from "react";
import { Badge, Card, Col, ProgressBar, Row, Table } from "react-bootstrap";
import SummaryCard from "../components/SummaryCard";
import { useAppState } from "../app/store";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const state = useAppState();
  const today = todayStr();

  const todayMeals = state.meals.filter((m) => m.date === today);
  const todayWorkouts = state.workouts.filter((w) => w.date === today);
  const habits = state.habitsByDate[today] || {};

  const totals = useMemo(() => {
    const caloriesIn = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const protein = todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
    const caloriesBurned = todayWorkouts.reduce(
      (sum, w) => sum + (w.caloriesBurned || 0),
      0
    );
    const steps = habits.steps || 0;
    const waterOz = habits.waterOz || 0;
    const sleepHrs = habits.sleepHrs || 0;

    return {
      caloriesIn,
      protein,
      caloriesBurned,
      steps,
      waterOz,
      sleepHrs,
    };
  }, [todayMeals, todayWorkouts, habits]);

  const goals = state.settings;
  const net = totals.caloriesIn - totals.caloriesBurned;

  const pct = (value, goal) =>
    goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h1 className="h3 m-0">Dashboard</h1>
          <div className="text-muted">Today snapshot based on your logs</div>
        </div>
        <Badge bg={net <= 0 ? "success" : "warning"} className="px-3 py-2">
          Net: {net} cal {net <= 0 ? "(deficit)" : "(surplus)"}
        </Badge>
      </div>

      <Row className="g-3">
        <Col xs={12} md={6} lg={3}>
          <SummaryCard
            title="Calories In"
            value={`${totals.caloriesIn} cal`}
            subtext={`Goal ${goals.calorieGoal}`}
            icon="bi-fire"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <SummaryCard
            title="Calories Burned"
            value={`${totals.caloriesBurned} cal`}
            subtext="Workouts + movement"
            icon="bi-lightning-charge"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <SummaryCard
            title="Steps"
            value={`${totals.steps}`}
            subtext={`Goal ${goals.stepGoal}`}
            icon="bi-person-walking"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <SummaryCard
            title="Sleep"
            value={`${totals.sleepHrs.toFixed(1)} hrs`}
            subtext={`Goal ${goals.sleepGoal} hrs`}
            icon="bi-moon-stars"
          />
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-3">Goal Progress</Card.Title>

              <div className="d-flex justify-content-between">
                <span className="text-muted">Calories</span>
                <span className="text-muted">
                  {totals.caloriesIn}/{goals.calorieGoal}
                </span>
              </div>
              <ProgressBar
                now={pct(totals.caloriesIn, goals.calorieGoal)}
                label={`${pct(totals.caloriesIn, goals.calorieGoal)}%`}
                className="mb-3"
              />

              <div className="d-flex justify-content-between">
                <span className="text-muted">Steps</span>
                <span className="text-muted">
                  {totals.steps}/{goals.stepGoal}
                </span>
              </div>
              <ProgressBar
                now={pct(totals.steps, goals.stepGoal)}
                label={`${pct(totals.steps, goals.stepGoal)}%`}
                className="mb-3"
              />

              <div className="d-flex justify-content-between">
                <span className="text-muted">Water (oz)</span>
                <span className="text-muted">
                  {totals.waterOz}/{goals.waterGoalOz}
                </span>
              </div>
              <ProgressBar
                now={pct(totals.waterOz, goals.waterGoalOz)}
                label={`${pct(totals.waterOz, goals.waterGoalOz)}%`}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-3">Today Notes</Card.Title>
              <ul className="mb-0">
                <li>Log meals and workouts to keep this dashboard accurate.</li>
                <li>Update water, steps, and sleep in the Habits page.</li>
                <li>Adjust your targets from the Settings page.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Today’s Meals</Card.Title>
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Meal</th>
                    <th className="text-end">Calories</th>
                    <th className="text-end">Protein (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {todayMeals.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        No meals logged yet for today.
                      </td>
                    </tr>
                  ) : (
                    todayMeals.map((m) => (
                      <tr key={m.id}>
                        <td>{m.time}</td>
                        <td>{m.name}</td>
                        <td className="text-end">{m.calories}</td>
                        <td className="text-end">{m.protein}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Today’s Workouts</Card.Title>
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Workout</th>
                    <th className="text-end">Duration</th>
                    <th className="text-end">Burned</th>
                  </tr>
                </thead>
                <tbody>
                  {todayWorkouts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        No workouts logged yet for today.
                      </td>
                    </tr>
                  ) : (
                    todayWorkouts.map((w) => (
                      <tr key={w.id}>
                        <td>{w.time}</td>
                        <td>{w.name}</td>
                        <td className="text-end">{w.durationMin} min</td>
                        <td className="text-end">{w.caloriesBurned} cal</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}