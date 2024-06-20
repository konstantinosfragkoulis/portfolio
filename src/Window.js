// src/Window.js
import React, { useRef, useState } from 'react';
import './Window.css';

const Window = ({ title, content, onClose }) => {
    const windowRef = useRef(null);
    const offsetX = useRef(0);
    const offsetY = useRef(0);

    const [isResizing, setIsResizing] = useState(false);
    const initialPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

    const handleMouseDown = (e) => {
        const windowElement = windowRef.current;
        offsetX.current = e.clientX - windowElement.getBoundingClientRect().left;
        offsetY.current = e.clientY - windowElement.getBoundingClientRect().top;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const windowElement = windowRef.current;
        windowElement.style.left = `${(windowElement.offsetWidth/2) + e.clientX - offsetX.current}px`;
        windowElement.style.top = `${e.clientY - offsetY.current}px`;
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleResizeMouseDown = (e) => {
        e.stopPropagation(); // Prevent triggering move logic
        setIsResizing(true);
        const windowElement = windowRef.current;
        initialPos.current = {
            x: e.clientX,
            y: e.clientY,
            width: windowElement.offsetWidth,
            height: windowElement.offsetHeight,
        };
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);
    };

    const handleResizeMouseMove = (e) => {
        if (!isResizing) return;
        const dx = e.clientX - initialPos.current.x;
        const dy = e.clientY - initialPos.current.y;
        const windowElement = windowRef.current;
        windowElement.style.width = `${initialPos.current.width + dx}px`;
        windowElement.style.height = `${initialPos.current.height + dy}px`;
    };

    const handleResizeMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
    };

    return (
        <div className="window" ref={windowRef} style={{ top: '10%', left: '50%' }}>
            <div className="header" onMouseDown={handleMouseDown}>
                <div className="window-controls">
                    <span className="close-btn" onClick={onClose}>
                        <div className="close-circle red"></div>
                    </span>
                    <span className="close-btn" onClick={onClose}>
                        <div className="close-circle yellow"></div>
                    </span>
                    <span className="close-btn" onClick={onClose}>
                        <div className="close-circle green"></div>
                    </span>
                </div>
                <span>{title}</span>
            </div>
            <div className="window-content">
                {content}
            </div>
            <div className="resize-handle" onMouseDown={handleResizeMouseDown}></div>
        </div>
    );
};

export default Window;
