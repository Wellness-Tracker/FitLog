import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Workouts from '../pages/Workouts';
import { AppProvider } from '../app/store';

describe('Workouts page', () => {
  it('renders the Workouts page with title', () => {
    render(
      <AppProvider>
        <Workouts />
      </AppProvider>
    );
    expect(screen.getByText(/workouts/i)).toBeInTheDocument();
  });

  it('displays initial workouts from state', () => {
    render(
      <AppProvider>
        <Workouts />
      </AppProvider>
    );
    // Check for sample workouts
    expect(screen.getByText(/upper body/i)).toBeInTheDocument();
    expect(screen.getByText(/incline walk/i)).toBeInTheDocument();
  });

  it('displays workout type badges', () => {
    render(
      <AppProvider>
        <Workouts />
      </AppProvider>
    );
    // Badges should be present
    const badges = screen.getAllByRole('img', { hidden: true });
    expect(badges.length).toBeGreaterThan(0);
  });

  it('has a date filter input', () => {
    render(
      <AppProvider>
        <Workouts />
      </AppProvider>
    );
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });
});
