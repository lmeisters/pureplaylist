// Create a shared animations file
export const fadeInFromBelow = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 }
};

export function getStaggeredFadeIn(delay: number = 0) {
  return {
    ...fadeInFromBelow,
    transition: { ...fadeInFromBelow.transition, delay }
  };
}

// Optional: Create a wrapper component for commonly animated elements
export function withStaggeredFadeIn(index: number) {
  return {
    ...fadeInFromBelow,
    transition: { ...fadeInFromBelow.transition, delay: 0.1 * index }
  };
} 