import { reducer, initialState } from "../app/store";

describe("reducer", () => {
  test("ADD_MEAL adds meal", () => {
    const meal = {
      id: "m1",
      date: "2026-02-20",
      time: "12:00",
      type: "Lunch",
      name: "Rice",
      calories: 500,
      protein: 10,
    };

    const next = reducer(initialState, { type: "ADD_MEAL", payload: meal });
    expect(next.meals).toHaveLength(1);
    expect(next.meals[0].name).toBe("Rice");
  });
});
