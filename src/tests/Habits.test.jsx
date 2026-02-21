import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Habits from '../pages/Habits';
import { AppProvider } from '../app/store';

describe('Habits page', () => {
  it('renders the Habits page with title', () => {
    render(
      <AppProvider>
        <Habits />
      </AppProvider>
    );
    expect(screen.getByText(/habits/i)).toBeInTheDocument();
  });

  it('displays date input control', () => {
    render(
      <AppProvider>
        <Habits />
      </AppProvider>
    );
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('displays completion badge', () => {
    render(
      <AppProvider>
        <Habits />
      </AppProvider>
    );
    expect(screen.getByText(/completion/i)).toBeInTheDocument();
  });

  it('displays habit tracking form fields', () => {
    render(
      <AppProvider>
        <Habits />
      </AppProvider>
    );
    expect(screen.getByText(/water/i)).toBeInTheDocument();
    expect(screen.getByText(/steps/i)).toBeInTheDocument();
    expect(screen.getByText(/sleep/i)).toBeInTheDocument();
  });

  it('displays habit checkboxes', () => {
    render(
      <AppProvider>
        <Habits />
      </AppProvider>
    );
    expect(screen.getByText(/stretch.*mobility/i)).toBeInTheDocument();
    expect(screen.getByText(/read today/i)).toBeInTheDocument();
    expect(screen.getByText(/took vitamins/i)).toBeInTheDocument();
  });

  it('displays Save Habits button', () => {
    render(
      <AppProvider>
        <Habits />
      </AppProvider>
    );
    expect(screen.getByRole('button', { name: /save habits/i })).toBeInTheDocument();
  });

  it('displays action buttons', () => {
    render(
      <AppProvider>
        <Habits />
      </AppProvider>
    );
    expect(screen.getByRole('button', { name: /jump to today/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear day/i })).toBeInTheDocument();
  });
});
