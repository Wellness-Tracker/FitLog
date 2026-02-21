import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

describe("AppNavbar", () => {
  test("shows brand + navigation links", () => {
    render(
      <MemoryRouter>
        <AppNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText("FitLog")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /meals/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /workouts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /habits/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /progress/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
  });
});
