import { useEffect, useRef } from 'react';

const CursorTrail = () => {
  const dots = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);
  const dotCount = 10;  // Increased number of dots for a longer trail
  const dotSize = 16;  // Larger dot size for better visibility
  
  useEffect(() => {
    // Create dots
    const createDots = () => {
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = 'rgba(99, 102, 241, 0.9)';  // More opaque
        dot.style.boxShadow = '0 0 15px 5px rgba(99, 102, 241, 0.6)';  // Stronger glow effect
        dot.style.transition = 'all 0.1s ease-out';  // Smoother transition
        dot.style.pointerEvents = 'none';
        dot.style.transform = 'translate(-50%, -50%)';
        dot.style.zIndex = '9999';
        dot.style.transition = 'all 0.2s ease';
        dot.style.opacity = '0';
        document.body.appendChild(dot);
        dots.current.push({
          element: dot,
          x: 0,
          y: 0,
          scale: 1 - (i * 0.1)
        });
      }
    };

    // Handle mouse movement
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Animation loop
    const animate = () => {
      dots.current.forEach((dot, index) => {
        const leader = index === 0 
          ? mousePos.current 
          : { x: dots.current[index - 1].x, y: dots.current[index - 1].y };
        
        // Smooth following effect
        // Increase spacing between dots by reducing the multiplier
        // More dynamic movement with varying speeds
        const speed = 0.3 + (index * 0.05);
        dot.x = dot.x + (leader.x - dot.x) * speed;
        dot.y = dot.y + (leader.y - dot.y) * speed;
        
        // Apply position and styles
        dot.element.style.left = `${dot.x}px`;
        dot.element.style.top = `${dot.y}px`;
        dot.element.style.transform = `translate(-50%, -50%) scale(${dot.scale})`;
        
        // Dynamic opacity based on position in trail
        const opacity = 1 - (index / (dotCount * 1.2));
        dot.element.style.opacity = opacity.toString();
        
        // Scale down dots further back in the trail
        const scale = 1 - (index * 0.08);
        dot.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Initialize
    createDots();
    document.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Remove all dots
      dots.current.forEach(dot => {
        if (dot.element && dot.element.parentNode) {
          dot.element.parentNode.removeChild(dot.element);
        }
      });
      dots.current = [];
    };
  }, []);

  // No render output
  return null;
};

export default CursorTrail;
