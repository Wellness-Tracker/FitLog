import React from "react";
import { Badge, Card, Col, ProgressBar, Row, Table } from "react-bootstrap";
import SummaryCard from "../components/SummaryCard";

export default function Dashboard() {
  // Sample data (Tier 1). Tier 4 will replace with global state.
  const today = {
    caloriesIn: 1650,
    caloriesBurned: 420,
    steps: 7200,
    waterOz: 52,
    sleepHrs: 6.8,
    calorieGoal: 1900,
    stepGoal: 9000,
    waterGoalOz: 80,
    sleepGoalHrs: 8,
  };

  const meals = [
    { time: "9:10 AM", name: "Oats + berries", calories: 380, protein: 18 },
    { time: "1:25 PM", name: "Chicken salad", calories: 520, protein: 42 },
    { time: "7:40 PM", name: "Paneer wrap", calories: 520, protein: 30 },
  ];

  const workouts = [
    { time: "6:30 PM", name: "Strength (Upper)", duration: 45, calories: 280 },
    { time: "8:10 PM", name: "Walk", duration: 20, calories: 140 },
  ];

  const net = today.caloriesIn - today.caloriesBurned;
  const pct = (value, goal) => Math.min(100, Math.round((value / goal) * 100));

  return (
    <div className="d-flex flex-column gap-3">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h1 className="h3 m-0">Dashboard</h1>
          <div className="text-muted">Today snapshot (sample data for Tier 1)</div>
        </div>
        <Badge bg={net <= 0 ? "success" : "warning"} className="px-3 py-2">
          Net: {net} cal {net <= 0 ? "(deficit)" : "(surplus)"}
        </Badge>
      </div>

      {/* Summary cards */}
      <Row className="g-3">
        <Col xs={12} md={6} lg={3}>
          <SummaryCard
            title="Calories In"
            value={`${today.caloriesIn} cal`}
            subtext={`Goal ${today.calorieGoal}`}
            icon="bi-fire"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <SummaryCard
            title="Calories Burned"
            value={`${today.caloriesBurned} cal`}
            subtext="Workouts + steps"
            icon="bi-lightning-charge"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <SummaryCard
            title="Steps"
            value={`${today.steps}`}
            subtext={`Goal ${today.stepGoal}`}
            icon="bi-person-walking"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <SummaryCard
            title="Sleep"
            value={`${today.sleepHrs} hrs`}
            subtext={`Goal ${today.sleepGoalHrs} hrs`}
            icon="bi-moon-stars"
          />
        </Col>
      </Row>

      {/* Progress bars */}
      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-3">Goal Progress</Card.Title>

              <div className="d-flex justify-content-between">
                <span className="text-muted">Calories</span>
                <span className="text-muted">
                  {today.caloriesIn}/{today.calorieGoal}
                </span>
              </div>
              <ProgressBar
                now={pct(today.caloriesIn, today.calorieGoal)}
                label={`${pct(today.caloriesIn, today.calorieGoal)}%`}
                className="mb-3"
              />

              <div className="d-flex justify-content-between">
                <span className="text-muted">Steps</span>
                <span className="text-muted">
                  {today.steps}/{today.stepGoal}
                </span>
              </div>
              <ProgressBar
                now={pct(today.steps, today.stepGoal)}
                label={`${pct(today.steps, today.stepGoal)}%`}
                className="mb-3"
              />

              <div className="d-flex justify-content-between">
                <span className="text-muted">Water (oz)</span>
                <span className="text-muted">
                  {today.waterOz}/{today.waterGoalOz}
                </span>
              </div>
              <ProgressBar
                now={pct(today.waterOz, today.waterGoalOz)}
                label={`${pct(today.waterOz, today.waterGoalOz)}%`}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-3">Today Notes</Card.Title>
              <ul className="mb-0">
                <li>Use the navbar to view Meals / Workouts / Habits pages.</li>
                <li>Tier 1 = styled dashboard + organized data.</li>
                <li>Tier 2 = routing across pages with URL changes.</li>
                <li>Tier 4 later will add real global state + forms.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tables */}
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
                  {meals.map((m, idx) => (
                    <tr key={idx}>
                      <td>{m.time}</td>
                      <td>{m.name}</td>
                      <td className="text-end">{m.calories}</td>
                      <td className="text-end">{m.protein}</td>
                    </tr>
                  ))}
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
                  {workouts.map((w, idx) => (
                    <tr key={idx}>
                      <td>{w.time}</td>
                      <td>{w.name}</td>
                      <td className="text-end">{w.duration} min</td>
                      <td className="text-end">{w.calories} cal</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
