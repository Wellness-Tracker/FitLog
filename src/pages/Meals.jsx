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
import { useAppDispatch, useAppState } from "../app/store";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Meals() {
  const { meals } = useAppState();
  const dispatch = useAppDispatch();
  const today = todayStr();

  const [filters, setFilters] = useState({
    date: today,
    search: "",
    type: "All",
  });

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    date: today,
    time: "12:00",
    type: "Lunch",
    name: "",
    calories: "",
    protein: "",
  });

  function openModal() {
    setForm({
      date: filters.date || today,
      time: "12:00",
      type: "Lunch",
      name: "",
      calories: "",
      protein: "",
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

  function addMeal(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const caloriesNum = Number(form.calories);
    const proteinNum = Number(form.protein);

    const newMeal = {
      id: uuidv4(),
      date: form.date,
      time: form.time,
      type: form.type,
      name: form.name.trim(),
      calories: Number.isFinite(caloriesNum) ? caloriesNum : 0,
      protein: Number.isFinite(proteinNum) ? proteinNum : 0,
    };

    dispatch({ type: "ADD_MEAL", payload: newMeal });
    setShowModal(false);
  }

  function deleteMeal(id) {
    dispatch({ type: "DELETE_MEAL", payload: id });
  }

  const filteredMeals = useMemo(() => {
    return meals
      .filter((m) => (filters.date ? m.date === filters.date : true))
      .filter((m) => (filters.type === "All" ? true : m.type === filters.type))
      .filter((m) => {
        const s = filters.search.trim().toLowerCase();
        if (!s) return true;
        return (
          m.name.toLowerCase().includes(s) || m.type.toLowerCase().includes(s)
        );
      })
      .sort((a, b) => (a.time < b.time ? 1 : -1));
  }, [meals, filters]);

  const totals = useMemo(() => {
    const calories = filteredMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const protein = filteredMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
    return { calories, protein };
  }, [filteredMeals]);

  return (
    <PageShell title="Meals" icon="bi-egg-fried">
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
          <Form.Label className="text-muted small">Meal Type</Form.Label>
          <Form.Select
            value={filters.type}
            onChange={(e) =>
              setFilters((p) => ({ ...p, type: e.target.value }))
            }
          >
            <option>All</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Label className="text-muted small">Search</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              placeholder="oats, dal, egg..."
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
            Add Meal
          </Button>
        </Col>
      </Row>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <Badge bg="secondary" className="px-3 py-2">
          Meals: {filteredMeals.length}
        </Badge>
        <Badge bg="primary" className="px-3 py-2">
          Calories: {totals.calories}
        </Badge>
        <Badge bg="success" className="px-3 py-2">
          Protein: {totals.protein} g
        </Badge>
      </div>

      <Table responsive hover className="mb-0 align-middle">
        <thead>
          <tr>
            <th style={{ width: 110 }}>Time</th>
            <th style={{ width: 140 }}>Type</th>
            <th>Meal</th>
            <th className="text-end" style={{ width: 120 }}>
              Calories
            </th>
            <th className="text-end" style={{ width: 120 }}>
              Protein
            </th>
            <th className="text-end" style={{ width: 90 }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredMeals.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
                No meals logged for this filter. Click <b>Add Meal</b>.
              </td>
            </tr>
          ) : (
            filteredMeals.map((m) => (
              <tr key={m.id}>
                <td>{m.time}</td>
                <td>
                  <Badge bg="light" text="dark" className="border">
                    {m.type}
                  </Badge>
                </td>
                <td className="fw-medium">{m.name}</td>
                <td className="text-end">{m.calories}</td>
                <td className="text-end">{m.protein} g</td>
                <td className="text-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteMeal(m.id)}
                  >
                    <i className="bi bi-trash" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal} centered>
        <Form onSubmit={addMeal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Meal</Modal.Title>
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
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snack</option>
                </Form.Select>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label>Meal name</Form.Label>
              <Form.Control
                name="name"
                placeholder="e.g., dal rice + egg curry"
                value={form.name}
                onChange={onFormChange}
                required
              />
            </Form.Group>

            <Row className="g-2">
              <Col>
                <Form.Label>Calories</Form.Label>
                <Form.Control
                  name="calories"
                  type="number"
                  min="0"
                  placeholder="e.g., 520"
                  value={form.calories}
                  onChange={onFormChange}
                />
              </Col>
              <Col>
                <Form.Label>Protein (g)</Form.Label>
                <Form.Control
                  name="protein"
                  type="number"
                  min="0"
                  placeholder="e.g., 22"
                  value={form.protein}
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