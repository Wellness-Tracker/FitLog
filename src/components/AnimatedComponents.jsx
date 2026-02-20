// src/components/AnimatedComponents.jsx
// Reusable animated React Bootstrap components using Framer Motion

import { motion } from "framer-motion";
import { Button, Badge, Form, Card } from "react-bootstrap";
import {
  buttonHover,
  cardHover,
  fadeIn,
  slideInUp,
  badgePulse,
} from "../animations/transitions";

// Animated Button
export const AnimatedButton = motion(Button);

// Animated Badge
export const AnimatedBadge = motion(Badge);

// Animated Card
export const AnimatedCard = motion(Card);

// Custom wrapper components with predefined animations
export function PrimaryButton({ children, ...props }) {
  return (
    <AnimatedButton
      variant="primary"
      {...buttonHover}
      {...props}
    >
      {children}
    </AnimatedButton>
  );
}

export function SuccessBadge({ children, ...props }) {
  return (
    <AnimatedBadge
      bg="success"
      className="px-3 py-2"
      {...badgePulse}
      {...props}
    >
      {children}
    </AnimatedBadge>
  );
}

export function AnimatedCardWrapper({ children, ...props }) {
  return (
    <AnimatedCard
      {...cardHover}
      className="shadow-sm border-0"
      {...props}
    >
      {children}
    </AnimatedCard>
  );
}

export function FadeInContainer({ children, ...props }) {
  return (
    <motion.div
      {...fadeIn}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideInContainer({ children, ...props }) {
  return (
    <motion.div
      {...slideInUp}
      {...props}
    >
      {children}
    </motion.div>
  );
}
