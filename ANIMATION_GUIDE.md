# FitLog Animation Guide

## Quick Start

You now have TWO animation systems set up:
1. **CSS Animations** (lightweight, built-in, no dependencies)
2. **Framer Motion** (powerful, flexible, installed via npm)

---

## Using CSS Animations

### Apply to Any Element

```jsx
// Fade in effect
<div className="animate-fade-in">Content</div>

// Slide in from left
<div className="animate-slide-in-left">Menu</div>

// Bounce animation
<div className="animate-bounce">Loading...</div>

// Glow effect
<button className="animate-glow">Click me</button>

// Pulse effect
<div className="animate-pulse">Updating...</div>

// Scale in
<div className="animate-scale-in">Welcome!</div>

// Rotate
<div className="animate-rotate">Processing...</div>

// Heart beat
<div className="animate-heartbeat">❤️</div>
```

### Available CSS Classes

- `animate-fade-in` - Fade in effect
- `animate-slide-in-left` - Slide from left
- `animate-slide-in-right` - Slide from right
- `animate-slide-in-down` - Slide from top
- `animate-slide-in-up` - Slide from bottom
- `animate-scale-in` - Scale up effect
- `animate-bounce` - Bouncing effect
- `animate-pulse` - Pulsing effect
- `animate-glow` - Glowing effect
- `animate-rotate` - Continuous rotation
- `animate-heartbeat` - Heart beat effect
- `animate-flip` - Flip effect
- `animate-shimmer` - Loading shimmer effect

---

## Using Framer Motion

### Example 1: Animate a Page

```jsx
import { motion } from "framer-motion";
import { pageTransition } from "../animations/transitions";

export default function Meals() {
  return (
    <motion.div {...pageTransition}>
      {/* Your page content */}
    </motion.div>
  );
}
```

### Example 2: Button Hover Animation

```jsx
import { motion } from "framer-motion";
import { buttonHover } from "../animations/transitions";

export default function MyComponent() {
  return (
    <motion.button {...buttonHover}>
      Click Me
    </motion.button>
  );
}
```

### Example 3: Using Pre-built Animated Components

```jsx
import { PrimaryButton, AnimatedCard, SlideInContainer } from "../components/AnimatedComponents";

export default function Dashboard() {
  return (
    <SlideInContainer>
      <AnimatedCard>
        <h2>Summary</h2>
        <p>Your daily stats</p>
      </AnimatedCard>
      
      <PrimaryButton>Save</PrimaryButton>
    </SlideInContainer>
  );
}
```

### Example 4: List with Stagger Animation

```jsx
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../animations/transitions";

export default function MealsList() {
  const meals = [/* your meals */];

  return (
    <motion.div {...staggerContainer}>
      {meals.map((meal) => (
        <motion.div key={meal.id} {...staggerItem}>
          <MealCard meal={meal} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Example 5: Custom Animations

```jsx
import { motion } from "framer-motion";

export default function Progress() {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      Progress Bar
    </motion.div>
  );
}
```

---

## Animation Configuration

### Available Transition Configs

All exported from `src/animations/transitions.js`:

```javascript
pageTransition      // Page load: fade + slide up
cardHover          // Card: lift up on hover
buttonHover        // Button: scale on hover, shrink on tap
fadeIn             // Simple fade in
slideInLeft        // Slide from left
slideInRight       // Slide from right
slideInUp          // Slide from bottom
scaleIn            // Scale up
rotateIn           // Rotate in
staggerContainer   // Container for staggered children
staggerItem        // Individual staggered item
modalVariants      // Modal show/hide
badgePulse         // Pulsing badge
progressAnimation  // Progress bar animation
```

---

## Animation Implementation Ideas for FitLog

### 1. Meals Page
```jsx
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../animations/transitions";

<motion.div {...staggerContainer}>
  {filteredMeals.map((meal) => (
    <motion.div key={meal.id} {...staggerItem} className="animate-scale-in">
      <MealRow meal={meal} />
    </motion.div>
  ))}
</motion.div>
```

### 2. Workouts Page
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={addWorkout}
>
  + Add Workout
</motion.button>
```

### 3. Habits Page
```jsx
<motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: completion.pct / 100 }}
  transition={{ duration: 0.6 }}
  style={{ originX: 0 }}
>
  <ProgressBar now={completion.pct} />
</motion.div>
```

### 4. Dashboard
```jsx
// Animated stats cards
<motion.div {...staggerContainer} className="row">
  {[calories, protein, steps].map((stat, i) => (
    <motion.div key={i} {...staggerItem} className="col-md-4">
      <AnimatedCard>
        {stat}
      </AnimatedCard>
    </motion.div>
  ))}
</motion.div>
```

### 5. Settings Form
```jsx
<motion.form
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  onSubmit={saveSettings}
>
  {/* Form fields */}
</motion.form>
```

### 6. Delete/Add Actions
```jsx
// Delete with animation
<motion.button
  onClick={() => {
    setTimeout(() => deleteMeal(id), 300);
  }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  Delete
</motion.button>

// Add with animation
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 200 }}
>
  <NewMealCard />
</motion.div>
```

---

## Performance Tips

1. **Use CSS animations for simple effects** (fade, slide, bounce)
2. **Use Framer Motion for complex interactions** (spring physics, drag)
3. **Avoid animating expensive properties** (layout, width, height)
4. **Use `transform` and `opacity`** instead for smooth animations
5. **Combine with `useMotionTemplate`** for dynamic values

### Example - Efficient Animation
```jsx
// ✅ GOOD - Animates transform only
<motion.div
  animate={{ x: 10, opacity: 0.5 }}
  transition={{ duration: 0.3 }}
/>

// ❌ AVOID - Animates expensive properties
<motion.div
  animate={{ width: 100, height: 50 }}
  transition={{ duration: 0.3 }}
/>
```

---

## Accessibility

All animations respect the `prefers-reduced-motion` setting in your CSS. Users who have reduced motion preferences will see instant transitions instead of animations.

---

## Next Steps

1. ✅ CSS animations are ready to use (no setup needed!)
2. ✅ Framer Motion is installed and ready
3. Import animations into your pages
4. Test on different devices for smoothness
5. Adjust duration and timing to your preference

---

## Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **CSS Animation Guide**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations
- **Animation Best Practices**: https://web.dev/animations-guide/
