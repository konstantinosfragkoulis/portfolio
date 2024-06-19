import React, { useState } from 'react';
import Dock from './Dock';
import Window from './Window';
import './App.css';

const App = () => {
    const [activeApp, setActiveApp] = useState('');

    const icons = [
        { name: 'about', src: 'about-icon.png' },
        { name: 'projects', src: 'projects-icon.png' },
        { name: 'contact', src: 'contact-icon.png' }
    ];

    const openApp = (app) => {
        setActiveApp(app);
    };

    const closeApp = () => {
        setActiveApp('');
    };

    const getAppContent = (app) => {
        switch (app) {
            case 'about':
                return (
                    <>
                        <h1>About Me</h1>
                        <p>Hello! I'm a high school student from Greece, passionate about math, programming, computer science, robotics, physics, and AI. I'm preparing to apply to top US colleges and always eager to learn and explore new technologies.</p>
                    </>
                );
            case 'projects':
                return (
                    <>
                        <h1>Projects</h1>
                        <p>Here are some of the projects I have worked on:</p>
                        <ul>
                            <li>Project 1: Description</li>
                            <li>Project 2: Description</li>
                            <li>Project 3: Description</li>
                        </ul>
                    </>
                );
            case 'contact':
                return (
                    <>
                        <h1>Contact</h1>
                        <p>You can reach me at:</p>
                        <ul>
                            <li>Email: <a href="mailto:example@example.com">example@example.com</a></li>
                            <li>LinkedIn: <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">yourprofile</a></li>
                            <li>GitHub: <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">yourusername</a></li>
                        </ul>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="App">
            <Dock icons={icons} onOpenApp={openApp} />

            {activeApp && (
                <Window
                    title={activeApp.charAt(0).toUpperCase() + activeApp.slice(1)}
                    content={getAppContent(activeApp)}
                    onClose={closeApp}
                />
            )}
        </div>
    );
};

export default App;