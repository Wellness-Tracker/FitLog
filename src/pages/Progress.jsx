import React, { useMemo } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import PageShell from "../components/PageShell";
import { useAppState } from "../app/store";

// Recharts (charts)
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

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
  return out.reverse(); // oldest → newest
}

export default function Progress() {
  const state = useAppState();
  const last7Dates = useMemo(() => getLastNDates(7), []);

  // --------- WEEKLY AGGREGATED NUMBERS ----------
  const weekly = useMemo(() => {
    let caloriesIn = 0;
    let caloriesBurned = 0;
    let workoutsCount = 0;
    let proteinTotal = 0;
    let proteinDays = 0;

    for (const date of last7Dates) {
      const meals = state.meals.filter((m) => m.date === date);
      const workouts = state.workouts.filter((w) => w.date === date);

      caloriesIn += meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      caloriesBurned += workouts.reduce(
        (sum, w) => sum + (w.caloriesBurned || 0),
        0
      );
      workoutsCount += workouts.length;

      const protein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
      if (meals.length > 0) {
        proteinTotal += protein;
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

  // --------- CHART DATA GENERATION ----------
  const chartData = useMemo(() => {
    return last7Dates.map((date) => {
      const meals = state.meals.filter((m) => m.date === date);
      const workouts = state.workouts.filter((w) => w.date === date);

      return {
        date: date.slice(5), // MM-DD format
        caloriesIn: meals.reduce((sum, m) => sum + (m.calories || 0), 0),
        caloriesBurn: workouts.reduce(
          (sum, w) => sum + (w.caloriesBurned || 0),
          0
        ),
        workouts: workouts.length,
      };
    });
  }, [state.meals, state.workouts, last7Dates]);

  return (
    <PageShell title="Progress" icon="bi-graph-up">
      <Row className="g-4">

        {/* ---------- CALORIES SUMMARY ---------- */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Last 7 Days – Calories</Card.Title>

              <div>Calories In: {weekly.caloriesIn}</div>
              <div>Burned: {weekly.caloriesBurned}</div>

              <Badge
                bg={net <= 0 ? "success" : "warning"}
                className="mt-2"
              >
                Net: {net} cal {net <= 0 ? "(deficit)" : "(surplus)"}
              </Badge>

              {/* Line Chart */}
              <div style={{ height: 220 }} className="mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="caloriesIn"
                      stroke="#4a90e2"
                      strokeWidth={3}
                      name="Calories In"
                    />
                    <Line
                      type="monotone"
                      dataKey="caloriesBurn"
                      stroke="#f78da7"
                      strokeWidth={3}
                      name="Calories Burned"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ---------- ACTIVITY / PROTEIN ---------- */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Last 7 Days – Activity</Card.Title>

              <div>Workouts: {weekly.workoutsCount}</div>
              <div>Avg Protein (on logged days): {weekly.proteinAvg} g</div>

              {/* Bar Chart */}
              <div style={{ height: 220 }} className="mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="workouts"
                      fill="#ffb677"
                      name="Workouts Count"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </PageShell>
  );
}
