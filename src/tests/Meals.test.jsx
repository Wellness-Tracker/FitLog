import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Meals from "../pages/Meals";
import { AppProvider } from "../app/store";

function renderWithProvider(ui) {
  return render(<AppProvider>{ui}</AppProvider>);
}

describe("Meals page", () => {
  it("renders Add Meal button", () => {
    renderWithProvider(<Meals />);
    expect(screen.getByText(/add meal/i)).toBeInTheDocument();
  });

  it("shows at least one meal from initialState", () => {
    renderWithProvider(<Meals />);
    expect(screen.getByText(/oats/i)).toBeInTheDocument();
  });
});