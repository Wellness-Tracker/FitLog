import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Form,
  Modal,
  Row,
  Table,
  InputGroup,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import PageShell from "../components/PageShell";

export default function Workouts() {
  // --- Tier 3 local state (later: move to global state + localStorage)
  const [workouts, setWorkouts] = useState([
    {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
      time: "18:30",
      type: "Strength",
      name: "Upper Body (Machines + DB)",
      durationMin: 45,
      caloriesBurned: 280,
    },
    {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10),
      time: "20:10",
      type: "Cardio",
      name: "Incline Walk",
      durationMin: 20,
      caloriesBurned: 140,
    },
  ]);

  // --- UI state
  const [showModal, setShowModal] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const [filters, setFilters] = useState({
    date: today,
    search: "",
    type: "All",
  });

  const [form, setForm] = useState({
    date: today,
    time: "18:00",
    type: "Strength",
    name: "",
    durationMin: "",
    caloriesBurned: "",
  });

  function openModal() {
    setForm({
      date: filters.date || today,
      time: "18:00",
      type: "Strength",
      name: "",
      durationMin: "",
      caloriesBurned: "",
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function onFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addWorkout(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const durationNum = Number(form.durationMin);
    const burnedNum = Number(form.caloriesBurned);

    const newWorkout = {
      id: uuidv4(),
      date: form.date,
      time: form.time,
      type: form.type,
      name: form.name.trim(),
      durationMin: Number.isFinite(durationNum) ? durationNum : 0,
      caloriesBurned: Number.isFinite(burnedNum) ? burnedNum : 0,
    };

    setWorkouts((prev) => [newWorkout, ...prev]);
    setShowModal(false);
  }

  function deleteWorkout(id) {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }

  const filteredWorkouts = useMemo(() => {
    return workouts
      .filter((w) => (filters.date ? w.date === filters.date : true))
      .filter((w) => (filters.type === "All" ? true : w.type === filters.type))
      .filter((w) => {
        const s = filters.search.trim().toLowerCase();
        if (!s) return true;
        return (
          w.name.toLowerCase().includes(s) || w.type.toLowerCase().includes(s)
        );
      })
      .sort((a, b) => (a.time < b.time ? 1 : -1));
  }, [workouts, filters]);

  const totals = useMemo(() => {
    const minutes = filteredWorkouts.reduce(
      (acc, w) => acc + (w.durationMin || 0),
      0
    );
    const burned = filteredWorkouts.reduce(
      (acc, w) => acc + (w.caloriesBurned || 0),
      0
    );
    return { minutes, burned };
  }, [filteredWorkouts]);

  // helper for nice pill color
  const typeBadge = (type) => {
    if (type === "Cardio") return { bg: "info", text: "dark" };
    if (type === "Strength") return { bg: "primary", text: "light" };
    if (type === "Core") return { bg: "warning", text: "dark" };
    return { bg: "light", text: "dark" };
  };

  return (
    <PageShell title="Workouts" icon="bi-lightning-charge">
      {/* Top controls */}
      <Row className="g-2 align-items-end mb-3">
        <Col md={3}>
          <Form.Label className="text-muted small">Date</Form.Label>
          <Form.Control
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters((p) => ({ ...p, date: e.target.value }))
            }
          />
        </Col>

        <Col md={3}>
          <Form.Label className="text-muted small">Workout Type</Form.Label>
          <Form.Select
            value={filters.type}
            onChange={(e) =>
              setFilters((p) => ({ ...p, type: e.target.value }))
            }
          >
            <option>All</option>
            <option>Strength</option>
            <option>Cardio</option>
            <option>Core</option>
            <option>Mobility</option>
            <option>Stretching</option>
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Label className="text-muted small">Search</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              placeholder="walk, leg day, cycling..."
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
            />
          </InputGroup>
        </Col>

        <Col md={2} className="d-grid">
          <Button onClick={openModal}>
            <i className="bi bi-plus-lg me-2" />
            Add Workout
          </Button>
        </Col>
      </Row>

      {/* Totals */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Badge bg="secondary" className="px-3 py-2">
          Workouts: {filteredWorkouts.length}
        </Badge>
        <Badge bg="success" className="px-3 py-2">
          Burned: {totals.burned} cal
        </Badge>
        <Badge bg="primary" className="px-3 py-2">
          Time: {totals.minutes} min
        </Badge>
      </div>

      {/* Table */}
      <Table responsive hover className="mb-0 align-middle">
        <thead>
          <tr>
            <th style={{ width: 110 }}>Time</th>
            <th style={{ width: 140 }}>Type</th>
            <th>Workout</th>
            <th className="text-end" style={{ width: 120 }}>
              Duration
            </th>
            <th className="text-end" style={{ width: 130 }}>
              Burned
            </th>
            <th className="text-end" style={{ width: 90 }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredWorkouts.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
                No workouts logged for this filter. Click <b>Add Workout</b>.
              </td>
            </tr>
          ) : (
            filteredWorkouts.map((w) => {
              const pill = typeBadge(w.type);
              return (
                <tr key={w.id}>
                  <td>{w.time}</td>
                  <td>
                    <Badge bg={pill.bg} text={pill.text} className="px-2">
                      {w.type}
                    </Badge>
                  </td>
                  <td className="fw-medium">{w.name}</td>
                  <td className="text-end">{w.durationMin} min</td>
                  <td className="text-end">{w.caloriesBurned} cal</td>
                  <td className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteWorkout(w.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash" />
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {/* Add Workout Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Form onSubmit={addWorkout}>
          <Modal.Header closeButton>
            <Modal.Title>Add Workout</Modal.Title>
          </Modal.Header>

          <Modal.Body className="d-flex flex-column gap-3">
            <Row className="g-2">
              <Col>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onFormChange}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={onFormChange}
                  required
                />
              </Col>
            </Row>

            <Row className="g-2">
              <Col>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={form.type}
                  onChange={onFormChange}
                >
                  <option>Strength</option>
                  <option>Cardio</option>
                  <option>Core</option>
                  <option>Mobility</option>
                  <option>Stretching</option>
                </Form.Select>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label>Workout name</Form.Label>
              <Form.Control
                name="name"
                placeholder="e.g., Leg day + incline walk"
                value={form.name}
                onChange={onFormChange}
                required
              />
            </Form.Group>

            <Row className="g-2">
              <Col>
                <Form.Label>Duration (min)</Form.Label>
                <Form.Control
                  name="durationMin"
                  type="number"
                  min="0"
                  placeholder="e.g., 45"
                  value={form.durationMin}
                  onChange={onFormChange}
                />
              </Col>
              <Col>
                <Form.Label>Calories burned</Form.Label>
                <Form.Control
                  name="caloriesBurned"
                  type="number"
                  min="0"
                  placeholder="e.g., 280"
                  value={form.caloriesBurned}
                  onChange={onFormChange}
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              <i className="bi bi-check2 me-2" />
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </PageShell>
  );
}
