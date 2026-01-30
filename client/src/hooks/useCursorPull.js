/**
 * Custom hook for cursor-pull button effect
 * Subtly pulls buttons toward the cursor on hover
 */
import { useEffect } from 'react';

export function useCursorPull(strength = 8) {
  useEffect(() => {
    const getButtonElements = () => {
      return document.querySelectorAll(
        'button, a[class*="px"], a[class*="py"], [role="button"], input[type="button"], input[type="submit"]'
      );
    };

    const handleMouseMove = (e) => {
      const buttons = getButtonElements();
      buttons.forEach((button) => {
        if (!button.matches(':hover')) return;

        const rect = button.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate direction from button to cursor
        const deltaX = mouseX - buttonCenterX;
        const deltaY = mouseY - buttonCenterY;

        // Calculate distance to limit pull strength
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 150; // Maximum distance to apply effect

        if (distance > maxDistance) return;

        // Normalize direction vector
        const dirX = deltaX / distance || 0;
        const dirY = deltaY / distance || 0;

        // Calculate pull amount (stronger closer to cursor)
        const pullAmount = (1 - distance / maxDistance) * strength;
        const pullX = dirX * pullAmount;
        const pullY = dirY * pullAmount;

        // Apply transform using CSS variable
        button.style.setProperty('--pull-x', `${pullX}px`);
        button.style.setProperty('--pull-y', `${pullY}px`);
      });
    };

    const handleMouseLeave = () => {
      const buttons = getButtonElements();
      buttons.forEach((button) => {
        button.style.setProperty('--pull-x', '0px');
        button.style.setProperty('--pull-y', '0px');
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);
}
