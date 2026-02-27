import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

jest.mock("uuid", () => ({ v4: () => "test-id" }));

const mockDispatch = jest.fn();
jest.mock("../app/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppState: () => ({ meals: [] }),
}));

import Meals from "../pages/Meals";

describe("Meals", () => {
  beforeEach(() => mockDispatch.mockClear());

  it("renders empty state", () => {
    render(
      <MemoryRouter>
        <Meals />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/no meals logged for this filter/i)
    ).toBeInTheDocument();
  });

  it("dispatches ADD_MEAL when adding a meal", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Meals />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /add meal/i }));
    await user.type(screen.getByPlaceholderText(/dal rice/i), "Oats + Milk");
    await user.type(screen.getByPlaceholderText(/520/i), "350");
    await user.type(screen.getByPlaceholderText(/22/i), "18");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    const action = mockDispatch.mock.calls[0][0];
    expect(action.type).toBe("ADD_MEAL");
    expect(action.payload.id).toBe("test-id"); 
    expect(action.payload.name).toBe("Oats + Milk");
    expect(action.payload.calories).toBe(350);
    expect(action.payload.protein).toBe(18);
  });
});
