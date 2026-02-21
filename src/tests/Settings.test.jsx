import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../pages/Settings';
import { AppProvider } from '../app/store';

describe('Settings page', () => {
  it('renders the Settings page with title', () => {
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('displays all goal input fields', () => {
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );
    expect(screen.getByLabelText(/daily calorie goal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/protein goal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/steps goal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sleep goal/i)).toBeInTheDocument();
  });

  it('displays water goal input field', () => {
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );
    expect(screen.getByLabelText(/water goal/i)).toBeInTheDocument();
  });

  it('displays Save Settings button', () => {
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );
    expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument();
  });

  it('allows user to update calorie goal', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );

    const calorieInput = screen.getByLabelText(/daily calorie goal/i);
    await user.clear(calorieInput);
    await user.type(calorieInput, '2200');

    expect(calorieInput.value).toBe('2200');
  });

  it('allows user to update protein goal', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );

    const proteinInput = screen.getByLabelText(/protein goal/i);
    await user.clear(proteinInput);
    await user.type(proteinInput, '120');

    expect(proteinInput.value).toBe('120');
  });

  it('allows user to update steps goal', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );

    const stepsInput = screen.getByLabelText(/steps goal/i);
    await user.clear(stepsInput);
    await user.type(stepsInput, '10000');

    expect(stepsInput.value).toBe('10000');
  });

  it('allows user to update sleep goal', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );

    const sleepInput = screen.getByLabelText(/sleep goal/i);
    await user.clear(sleepInput);
    await user.type(sleepInput, '7');

    expect(sleepInput.value).toBe('7');
  });
});
