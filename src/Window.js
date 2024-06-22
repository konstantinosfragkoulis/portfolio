import React, { useRef, useEffect, useState } from 'react';
import './Window.css';

const minWindowSizePC = {
    "About": { minWidth: 640, minHeight: 240 },
    "Projects": { minWidth: 640, minHeight: 580 },
    "Contact": { minWidth: 480, minHeight: 280 },
};
const minWindowSizeMobile = {
    "About": { minWidth: 280, minHeight: 290 },
    "Projects": { minWidth: 280, minHeight: 580 },
    "Contact": { minWidth: 315, minHeight: 260 },
};

const defaultWindowSizePC = {
    "About": { defaultWidth: 600, defaultHeight: 340 },
    "Projects": { defaultWidth: 965, defaultHeight: 615 },
    "Contact": { defaultWidth: 500, defaultHeight: 305 },
};
const defaultWindowSizeMobile = {
    "About": { defaultWidth: 320, defaultHeight: 300 },
    "Projects": { defaultWidth: 356, defaultHeight: 615 },
    "Contact": { defaultWidth: 325, defaultHeight: 260 },
};

const defaultWindowPosPC = {
    "About": { left: 450, top: 525 },
    "Projects": { left: 1350, top: 70 },
    "Contact": { left: 315, top: 115 },
};
const defaultWindowPosMobile = {
    "About": { left: 165, top: 35 },
    "Projects": { left: 200, top: 195 },
    "Contact": { left: 245, top: 160 },
};

const Window = ({ title, content, onClose, onHeaderClick }) => {
    const windowRef = useRef(null);
    const offsetX = useRef(0);
    const offsetY = useRef(0);
    const isResizingRef = useRef(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const minWindowSize = isMobile ? minWindowSizeMobile : minWindowSizePC;
    const defaultWindowSize = isMobile ? defaultWindowSizeMobile : defaultWindowSizePC;

    const { minWidth, minHeight } = minWindowSize[title] || { minWidth: 640, minHeight: 480 };

    useEffect(() => {
        const { defaultWidth, defaultHeight } = defaultWindowSize[title] || { defaultWidth: 640, defaultHeight: 480 };
        const defaultPos = isMobile ? defaultWindowPosMobile[title] : defaultWindowPosPC[title] || { left: 50, top: 50 };
        const windowElement = windowRef.current;
        if (windowElement) {
            windowElement.style.width = `${defaultWidth}px`;
            windowElement.style.height = `${defaultHeight}px`;
            windowElement.style.left = `${defaultPos.left}px`;
            windowElement.style.top = `${defaultPos.top}px`;
        }
    }, [title, isMobile]);

    const initialPos = useRef({ x: 0, y: 0, width: 0, height: 0 , left: 0, top: 0, corner: ''});

    const getEventCoordinates = (e) => {
        if (e.touches && e.touches.length > 0) {
            return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        }
        return { clientX: e.clientX, clientY: e.clientY };
    };

    const handleStart = (e) => {
        const { clientX, clientY } = getEventCoordinates(e);
        onHeaderClick(e, title);
        const windowElement = windowRef.current;
        offsetX.current = clientX - windowElement.getBoundingClientRect().left;
        offsetY.current = clientY - windowElement.getBoundingClientRect().top;

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
        document.body.classList.add('no-select');
    };

    const handleMove = (e) => {
        const { clientX, clientY } = getEventCoordinates(e);
        const windowElement = windowRef.current;
        windowElement.style.left = `${(windowElement.offsetWidth/2) + clientX - offsetX.current + window.scrollX}px`;
        windowElement.style.top = `${clientY - offsetY.current + window.scrollY}px`;
    };

    const handleEnd = () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
        document.body.classList.remove('no-select');
    };

    const handleResizeStart = (e) => {
        e.stopPropagation(); // Prevent triggering move logic
        const { clientX, clientY } = getEventCoordinates(e);
        isResizingRef.current = true;
        const windowElement = windowRef.current;
        initialPos.current = {
            x: clientX,
            y: clientY,
            width: windowElement.offsetWidth,
            height: windowElement.offsetHeight,
            left: windowElement.getBoundingClientRect().left,
            top: windowElement.getBoundingClientRect().top,
            corner: e.target.className.split(' ')[1],
        };
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
        document.addEventListener('touchmove', handleResizeMove);
        document.addEventListener('touchend', handleResizeEnd);
        document.body.classList.add('no-select');
    };

    const handleResizeMove = (e) => {
        if (!isResizingRef.current) return;
        const { clientX, clientY } = getEventCoordinates(e);
        const { x, y, width, height, left, top, corner } = initialPos.current;

        const dx = clientX - x;
        const dy = clientY - y;

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

    const handleResizeEnd = () => {
        isResizingRef.current = false;
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('touchend', handleResizeEnd);
        document.body.classList.remove('no-select');
    };

    return (
        <div className="window" ref={windowRef} style={{ top: '10%', left: '50%' }} onClick={(e) => onHeaderClick(e, title)}>
            <div className="header" onMouseDown={handleStart} onTouchStart={handleStart} onClick={(e) => onHeaderClick(e, title)}>
                <div className="window-controls">
                    <span className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(title); }}>
                        <div className="close-circle red"></div>
                    </span>
                    <span className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(title); }}>
                        <div className="close-circle yellow"></div>
                    </span>
                    <span className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(title); }}>
                        <div className="close-circle green"></div>
                    </span>
                </div>
                <span>{title}</span>
            </div>
            <div className="window-content">
                {content}
            </div>
            <div className="resize-handle top-left" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart}></div>
            <div className="resize-handle top-right" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart}></div>
            <div className="resize-handle bottom-left" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart}></div>
            <div className="resize-handle bottom-right" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart}></div>
        </div>
    );
};

export default Window;