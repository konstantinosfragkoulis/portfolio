import React from 'react';

const DockItem = ({ icon, onClick }) => {
    return (
        <div className="dock-item" onClick={onClick}>
            <img src={icon.src} alt={icon.name} />
        </div>
    );
};

export default DockItem;
