import React from 'react';
import './Window.css';

const Window = ({ title, content, onClose }) => {
    return (
        <div className="window">
            <div className="header">
                <span>{title}</span>
                <span className="close-btn" onClick={onClose}>&times;</span>
            </div>
            <div className="window-content">
                {content}
            </div>
        </div>
    );
};

export default Window;
