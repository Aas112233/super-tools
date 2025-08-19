/**
 * Utility functions for adding animations to buttons
 */

/**
 * Adds shiny and moving animation to a button element
 * @param button - The button element to animate
 * @param moveDistance - The distance to move the button on hover (default: 3px)
 */
export const addShinyAnimation = (button: HTMLButtonElement, moveDistance: number = 3) => {
  // Add required styles for animation
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  
  // Create shine effect element
  let shine = button.querySelector('.shine-effect') as HTMLElement;
  if (!shine) {
    shine = document.createElement('span');
    shine.className = 'shine-effect';
    shine.style.position = 'absolute';
    shine.style.top = '0';
    shine.style.left = '-100%';
    shine.style.width = '100%';
    shine.style.height = '100%';
    shine.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
    shine.style.transition = 'left 0.5s';
    shine.style.pointerEvents = 'none';
    button.appendChild(shine);
  }
  
  // Add hover effects
  const handleMouseEnter = () => {
    // Move button up
    button.style.transform = `translateY(-${moveDistance}px)`;
    
    // Enhance shadow
    const computedStyle = window.getComputedStyle(button);
    const currentBoxShadow = computedStyle.boxShadow;
    if (!currentBoxShadow.includes('var(--shadow-xl)')) {
      button.style.boxShadow = 'var(--shadow-xl)';
    }
    
    // Animate shine effect
    setTimeout(() => {
      if (shine) {
        shine.style.left = '100%';
      }
    }, 10);
  };
  
  const handleMouseLeave = () => {
    // Reset button position
    button.style.transform = '';
    
    // Reset shadow
    button.style.boxShadow = '';
    
    // Reset shine effect
    if (shine) {
      shine.style.left = '-100%';
    }
  };
  
  // Attach event listeners
  button.addEventListener('mouseenter', handleMouseEnter);
  button.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    button.removeEventListener('mouseenter', handleMouseEnter);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Hook version for React components
 */
export const useButtonAnimation = () => {
  const applyButtonAnimation = (button: HTMLButtonElement | null, moveDistance?: number) => {
    if (button) {
      return addShinyAnimation(button, moveDistance);
    }
    return () => {};
  };
  
  return { applyButtonAnimation };
};