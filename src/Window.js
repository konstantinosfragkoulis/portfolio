import React, { useRef, useEffect } from 'react';
import './Window.css';

const minWindowSize = {
    "About": { minWidth: 640, minHeight: 240 },
    "Projects": { minWidth: 640, minHeight: 580 },
    "Contact": { minWidth: 480, minHeight: 280 },
};

const defaultWindowSize = {
    "About": { defaultWidth: 790, defaultHeight: 440 },
    "Projects": { defaultWidth: 965, defaultHeight: 615 },
    "Contact": { defaultWidth: 500, defaultHeight: 305 },
};

const Window = ({ title, content, onClose }) => {
    const windowRef = useRef(null);
    const offsetX = useRef(0);
    const offsetY = useRef(0);
    const isResizingRef = useRef(false);

    const { minWidth, minHeight } = minWindowSize[title] || { minWidth: 640, minHeight: 480 };

    useEffect(() => {
        const { defaultWidth, defaultHeight } = defaultWindowSize[title] || { defaultWidth: 640, defaultHeight: 480 };
        const windowElement = windowRef.current;
        if (windowElement) {
            windowElement.style.width = `${defaultWidth}px`;
            windowElement.style.height = `${defaultHeight}px`;
        }
    }, [title]);

    const initialPos = useRef({ x: 0, y: 0, width: 0, height: 0 , left: 0, top: 0, corner: ''});

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
        isResizingRef.current = true;
        const windowElement = windowRef.current;
        initialPos.current = {
            x: e.clientX,
            y: e.clientY,
            width: windowElement.offsetWidth,
            height: windowElement.offsetHeight,
            left: windowElement.getBoundingClientRect().left,
            top: windowElement.getBoundingClientRect().top,
            corner: e.target.className.split(' ')[1],
        };
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);
    };

    const handleResizeMouseMove = (e) => {
        if (!isResizingRef.current) return;
        const { x, y, width, height, left, top, corner } = initialPos.current;

        const dx = e.clientX - initialPos.current.x;
        const dy = e.clientY - initialPos.current.y;

        console.log("dx: ", dx, "dy: ", dy);

        const windowElement = windowRef.current;
        let newLeft = left;
        let newTop = top;
        let newWidth = width;
        let newHeight = height;

        switch (corner) {
            case 'top-left':
                newWidth = Math.max(width - dx, minWidth);
                newHeight = Math.max(height - dy, minHeight);

                newLeft = left + width - newWidth +(newWidth)/2;
                newTop = top + height - newHeight;
                break;
            case 'top-right':
                newWidth = Math.max(width + dx, minWidth);
                newHeight = Math.max(height - dy, minHeight);

                newLeft = left + newWidth/2;
                newTop = top + height - newHeight;
                break;
            case 'bottom-left':
                newWidth = Math.max(width - dx, minWidth);
                newHeight = Math.max(height + dy, minHeight);
                
                newLeft = left + width - newWidth +(newWidth)/2;
                newTop = top;
                break;
            case 'bottom-right':
                newWidth = Math.max(width + dx, minWidth);
                newHeight = Math.max(height + dy, minHeight);

                newLeft = left + newWidth/2;
                newTop = top;
                break;
            default:
                newWidth = width;
                newHeight = height;
                newLeft = left;
                newTop = top;
                break;
        }

        windowElement.style.width = `${newWidth}px`;
        windowElement.style.height = `${newHeight}px`;
        windowElement.style.left = `${newLeft}px`;
        windowElement.style.top = `${newTop}px`;
    };

    const handleResizeMouseUp = () => {
        isResizingRef.current = false;
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
            <div className="resize-handle top-left" onMouseDown={handleResizeMouseDown}></div>
            <div className="resize-handle top-right" onMouseDown={handleResizeMouseDown}></div>
            <div className="resize-handle bottom-left" onMouseDown={handleResizeMouseDown}></div>
            <div className="resize-handle bottom-right" onMouseDown={handleResizeMouseDown}></div>
        </div>
    );
};

export default Window;
