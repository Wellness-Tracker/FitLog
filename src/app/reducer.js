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

export function appReducer(state, action) {
  switch (action.type) {
    case "ADD_MEAL": {
      return {
        ...state,
        meals: [action.payload, ...state.meals],
      };
    }
    case "DELETE_MEAL": {
      return {
        ...state,
        meals: state.meals.filter((m) => m.id !== action.payload),
      };
    }
    case "ADD_WORKOUT": {
      return {
        ...state,
        workouts: [action.payload, ...state.workouts],
      };
    }
    case "DELETE_WORKOUT": {
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.payload),
      };
    }
    case "UPSERT_HABITS_FOR_DATE": {
      const { date, habits } = action.payload;
      const prevForDate = state.habitsByDate[date] || {};
      return {
        ...state,
        habitsByDate: {
          ...state.habitsByDate,
          [date]: {
            ...prevForDate,
            ...habits,
          },
        },
      };
    }
    case "UPDATE_SETTINGS": {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    }
    case "HYDRATE_STATE": {
      // Replace whole state from persisted data
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}