/**
 * Simple utility for adding button animations without CSS pseudo-elements
 */

/**
 * Add shiny and moving animation to a button
 * @param {HTMLElement} button - The button element to animate
 * @param {number} moveDistance - Distance to move button on hover (default: 3)
 */
export function addButtonAnimation(button, moveDistance = 3) {
  if (!button) return;
  
  // Add required styles
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
  
  // Create shine effect element
  let shine = button.querySelector('.shine-effect');
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
  
  // Add event listeners
  const handleMouseEnter = () => {
    // Move button
    button.style.transform = `translateY(-${moveDistance}px)`;
    
    // Enhance shadow
    button.style.boxShadow = 'var(--shadow-xl)';
    
    // Animate shine effect
    setTimeout(() => {
      shine.style.left = '100%';
    }, 10);
  };
  
  const handleMouseLeave = () => {
    // Reset button position
    button.style.transform = '';
    
    // Reset shadow
    button.style.boxShadow = '';
    
    // Reset shine effect
    shine.style.left = '-100%';
  };
  
  button.addEventListener('mouseenter', handleMouseEnter);
  button.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    button.removeEventListener('mouseenter', handleMouseEnter);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
}