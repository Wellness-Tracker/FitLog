# FitLog Testing Guide

## Quick Start - Run Tests

### 1. **Run Tests in Watch Mode**
```bash
npm test
```
This starts Vitest in watch mode. Tests re-run automatically when you save files.

### 2. **Run Tests Once**
```bash
npm run test:run
```
Runs all tests once and exits. Useful for CI/CD pipelines.

### 3. **Run Tests with UI**
```bash
npm run test:ui
```
Opens an interactive UI dashboard in your browser to see test results.

### 4. **Run Tests with Coverage Report**
```bash
npm run test:coverage
```
Shows code coverage percentage for each file.

---

## What You Already Have

✅ **Test Framework**: Vitest (fast, Vite-native)
✅ **Testing Library**: @testing-library/react (best practices)
✅ **Test Files**: 
  - `src/tests/Meals.test.jsx` - Example tests for Meals page
  - `src/tests/reducer.test.js` - Tests for Redux reducer

---

## Writing Tests

### Example 1: Simple Component Test

```jsx
// src/tests/MyComponent.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders the title', () => {
    render(<MyComponent />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders a button', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Example 2: User Interaction Test

```jsx
// src/tests/Workouts.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Workouts from '../pages/Workouts';
import { AppProvider } from '../app/store';

describe('Workouts page', () => {
  it('opens add workout modal on button click', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Workouts />
      </AppProvider>
    );

    const addButton = screen.getByRole('button', { name: /add workout/i });
    await user.click(addButton);

    // Modal should appear
    expect(screen.getByText(/add new workout/i)).toBeInTheDocument();
  });
});
```

### Example 3: Form Input Test

```jsx
// src/tests/Settings.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../pages/Settings';
import { AppProvider } from '../app/store';

describe('Settings page', () => {
  it('allows user to change calorie goal', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Settings />
      </AppProvider>
    );

    const calorieInput = screen.getByLabelText(/daily calorie goal/i);
    await user.clear(calorieInput);
    await user.type(calorieInput, '2000');

    expect(calorieInput.value).toBe('2000');
  });
});
```

### Example 4: Redux Reducer Test

```jsx
// src/tests/reducer.test.js
import { describe, it, expect } from 'vitest';
import { appReducer, initialState } from '../app/reducer';

describe('appReducer', () => {
  it('handles ADD_MEAL action', () => {
    const newMeal = {
      id: 'test-1',
      date: '2024-02-20',
      time: '12:00',
      type: 'Lunch',
      name: 'Test Meal',
      calories: 500,
      protein: 25,
    };

    const action = {
      type: 'ADD_MEAL',
      payload: newMeal,
    };

    const newState = appReducer(initialState, action);

    expect(newState.meals[0]).toEqual(newMeal);
    expect(newState.meals.length).toBeGreaterThan(initialState.meals.length);
  });

  it('handles DELETE_MEAL action', () => {
    const mealToDelete = initialState.meals[0].id;

    const action = {
      type: 'DELETE_MEAL',
      payload: mealToDelete,
    };

    const newState = appReducer(initialState, action);

    expect(newState.meals).not.toContainEqual(
      expect.objectContaining({ id: mealToDelete })
    );
  });

  it('handles UPDATE_SETTINGS action', () => {
    const newSettings = {
      calorieGoal: 2500,
      proteinGoal: 120,
    };

    const action = {
      type: 'UPDATE_SETTINGS',
      payload: newSettings,
    };

    const newState = appReducer(initialState, action);

    expect(newState.settings.calorieGoal).toBe(2500);
    expect(newState.settings.proteinGoal).toBe(120);
  });

  it('handles UPSERT_HABITS_FOR_DATE action', () => {
    const testDate = '2024-02-20';
    const newHabits = {
      waterOz: 80,
      steps: 8000,
      stretchDone: true,
    };

    const action = {
      type: 'UPSERT_HABITS_FOR_DATE',
      payload: {
        date: testDate,
        habits: newHabits,
      },
    };

    const newState = appReducer(initialState, action);

    expect(newState.habitsByDate[testDate]).toMatchObject(newHabits);
  });
});
```

### Example 5: Async Test with Mocks

```jsx
// src/tests/async.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Async operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles async data loading', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    global.fetch = mockFetch;

    const response = await fetch('/api/meals');
    const data = await response.json();

    expect(mockFetch).toHaveBeenCalledWith('/api/meals');
    expect(data).toEqual({ data: 'test' });
  });
});
```

---

## Common Testing Patterns

### Test a Button Click
```jsx
const button = screen.getByRole('button', { name: /save/i });
await userEvent.click(button);
expect(/* result */).toBe(/* expected */);
```

### Test Form Input
```jsx
const input = screen.getByLabelText(/email/i);
await userEvent.type(input, 'test@example.com');
expect(input.value).toBe('test@example.com');
```

### Test Conditional Rendering
```jsx
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
// After error happens:
expect(screen.getByText(/error/i)).toBeInTheDocument();
```

### Test with Provider (Redux/Context)
```jsx
render(
  <AppProvider>
    <MyComponent />
  </AppProvider>
);
```

### Test Element Visibility
```jsx
expect(element).toBeVisible();
expect(element).not.toBeVisible();
```

### Test Class Names
```jsx
const element = screen.getByRole('button');
expect(element).toHaveClass('btn-primary');
```

---

## Create Test Files for Each Page

### 1. **Meals.test.jsx** (Already exists - expand it)
```jsx
// Add these tests to existing file
describe('Meals - Add Meal', () => {
  it('opens modal when Add Meal button is clicked', async () => {
    // Test modal opening
  });

  it('submits new meal with correct data', async () => {
    // Test form submission
  });

  it('deletes meal when delete button clicked', async () => {
    // Test deletion
  });
});
```

### 2. **Workouts.test.jsx** (Create new)
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Workouts from '../pages/Workouts';
import { AppProvider } from '../app/store';

describe('Workouts page', () => {
  it('renders workout list', () => {
    render(
      <AppProvider>
        <Workouts />
      </AppProvider>
    );
    // Add assertions
  });
});
```

### 3. **Habits.test.jsx** (Create new)
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Habits from '../pages/Habits';
import { AppProvider } from '../app/store';

describe('Habits page', () => {
  it('renders habit tracking form', () => {
    render(
      <AppProvider>
        <Habits />
      </AppProvider>
    );
    // Add assertions
  });
});
```

---

## Debugging Tests

### See What's Rendered
```jsx
import { render, screen } from '@testing-library/react';

render(<MyComponent />);
screen.debug(); // Prints DOM to console
```

### Wait for Element
```jsx
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText(/loaded/i)).toBeInTheDocument();
});
```

### Find All Elements
```jsx
const buttons = screen.getAllByRole('button');
console.log(buttons.length);
```

---

## Test Commands

| Command | What it does |
|---------|--------------|
| `npm test` | Run tests in watch mode (auto-rerun on save) |
| `npm run test:run` | Run tests once |
| `npm run test:ui` | Open interactive test UI dashboard |
| `npm run test:coverage` | Show code coverage report |
| `npm test -- --reporter=verbose` | Show detailed test output |
| `npm test -- --grep "Meals"` | Run only tests matching "Meals" |

---

## Coverage Goals

After running `npm run test:coverage`, aim for:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

---

## Best Practices

1. ✅ **Test behavior, not implementation** - Test what users see, not internal details
2. ✅ **Use semantic queries** - `getByRole`, `getByLabelText` over `getByTestId`
3. ✅ **One assertion per test** - Keep tests focused and clear
4. ✅ **Use descriptive test names** - Should read like documentation
5. ✅ **Mock external APIs** - Don't call real APIs in tests
6. ✅ **Test user interactions** - Click, type, submit - like real users
7. ✅ **Keep tests isolated** - Each test should be independent

---

## Next Steps

1. ✅ Install dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
2. ✅ Run tests: `npm test`
3. ✅ Create test files for remaining pages (Workouts, Habits, Settings, Dashboard)
4. ✅ Run coverage: `npm run test:coverage`
5. ✅ Keep improving test coverage over time

---

## Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
