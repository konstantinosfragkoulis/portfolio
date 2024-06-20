import React, { useRef, useEffect } from 'react';
import './Dock.css';

const Dock = ({ icons, onOpenApp }) => {
    const dockRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const dock = dockRef.current;
            if (!dock) return;

            const icons = dock.querySelectorAll('.dock-item img');
            icons.forEach((icon, index) => {
                const rect = icon.getBoundingClientRect();
                const iconCenterX = rect.left + rect.width / 2;
                const iconCenterY = rect.top + rect.height / 2;
                const maxDistance = 100;
                const minDistance = 30;

                const distance = Math.min(Math.max(Math.abs(Math.sqrt(0.5*(e.clientX - iconCenterX) ** 2 + (e.clientY - iconCenterY) ** 2)), minDistance), maxDistance);

                const scale = Math.max(1, 1.5 - (distance / maxDistance)*0.75);

                icon.style.transform = `scale(${scale})`;
                // After scaling the icon, we need to move it up depending on the scale to keep a constant distance from the bottom of the dock
                icon.style.bottom = `${((scale - 1)*50 +2)}px`;
            });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="dock" ref={dockRef}>
            {icons.map((icon) => (
                <div
                    key={icon.name}
                    className="dock-item"
                    onClick={() => onOpenApp(icon.name)}
                >
                    <img src={icon.src} alt={icon.name} />
                </div>
            ))}
        </div>
    );
};

export default Dock;
