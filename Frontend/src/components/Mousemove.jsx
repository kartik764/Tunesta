// src/components/Mousemove.jsx
import React, { useState, useEffect } from "react";
import './Mousemove.css';

const CursorGlow = () => {
    // Start the glow far off-screen so it doesn't flash at the corner on load
    const [position, setPosition] = useState({ x: -1000, y: -1000 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // This is the core logic that MUST be correct
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
    
        // Cleanup function
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []); // Empty array ensures this runs only once

    return (
        <div 
            className="cursor-glow" 
            style={{ 
                left: `${position.x}px`, 
                top: `${position.y}px` 
            }}
        />
    );
};

export default CursorGlow;