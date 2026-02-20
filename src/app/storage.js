// src/app/storage.js
// Persistence functions for app state (using localStorage)

const STORAGE_KEY = "fitlog_state";

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const today = todayStr();

export const initialState = {
  meals: [
    {
      id: "sample-meal-1",
      date: today,
      time: "09:10",
      type: "Breakfast",
      name: "Oats + banana",
      calories: 380,
      protein: 18,
    },
    {
      id: "sample-meal-2",
      date: today,
      time: "13:25",
      type: "Lunch",
      name: "Dal rice + egg curry",
      calories: 520,
      protein: 22,
    },
  ],
  workouts: [
    {
      id: "sample-workout-1",
      date: today,
      time: "18:30",
      type: "Strength",
      name: "Upper body machines",
      durationMin: 45,
      caloriesBurned: 280,
    },
    {
      id: "sample-workout-2",
      date: today,
      time: "20:10",
      type: "Cardio",
      name: "Incline walk",
      durationMin: 20,
      caloriesBurned: 140,
    },
  ],
  habitsByDate: {
    [today]: {
      waterOz: 52,
      steps: 7200,
      sleepHrs: 6.8,
      stretchDone: false,
      readDone: false,
      vitaminsDone: false,
      noSugarDone: false,
      walk20Done: false,
    },
  },
  settings: {
    calorieGoal: 1900,
    proteinGoal: 100,
    stepGoal: 9000,
    sleepGoal: 8,
    waterGoalOz: 80,
  },
};