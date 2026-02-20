import { describe, it, expect } from "vitest";
import { appReducer, initialState } from "../app/reducer";

describe("appReducer", () => {
  it("adds a meal", () => {
    const action = {
      type: "ADD_MEAL",
      payload: {
        id: "test-meal",
        date: "2026-02-20",
        time: "10:00",
        type: "Snack",
        name: "Test meal",
        calories: 200,
        protein: 10,
      },
    };

    const next = appReducer(initialState, action);
    const found = next.meals.find((m) => m.id === "test-meal");

    expect(found).toBeTruthy();
    expect(found.name).toBe("Test meal");
  });

  it("deletes a meal", () => {
    const existingId = initialState.meals[0].id;
    const action = { type: "DELETE_MEAL", payload: existingId };

    const next = appReducer(initialState, action);
    const stillThere = next.meals.find((m) => m.id === existingId);

    expect(stillThere).toBeUndefined();
  });

  it("updates habits for a date", () => {
    const action = {
      type: "UPSERT_HABITS_FOR_DATE",
      payload: {
        date: "2026-02-19",
        habits: { waterOz: 64, steps: 8000 },
      },
    };

    const next = appReducer(initialState, action);
    expect(next.habitsByDate["2026-02-19"].waterOz).toBe(64);
    expect(next.habitsByDate["2026-02-19"].steps).toBe(8000);
  });
});