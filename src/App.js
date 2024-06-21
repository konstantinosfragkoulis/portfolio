import React, { useState } from 'react';
import Dock from './Dock';
import Window from './Window';
import './App.css';

const App = () => {
    const [activeApp, setActiveApp] = useState('');

    const icons = [
        { name: 'about', src: 'about-icon.svg' },
        { name: 'projects', src: 'projects-icon.svg' },
        { name: 'contact', src: 'contact-icon.svg' }
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
                        <p>Hi! I'm a high school student from Greece. I really like math, computer science, robotics, physics, and AI. I'm working constantly on various projects as I'm always eager to learn and explore new technologies.</p>
                    </>
                );
            case 'projects':
                return (
                    <>
                        <h1>Projects</h1>
                        <p>Here are some of the projects I have worked on:</p>
                        <ul>
                            <li>Study Aid: A mobile app that helps students with learning difficulties study more efficiently. Using Artificial Intelligence, the application enhances notes, generates quizzes and creates a custom study schedule tailored to each student.</li>
                            <li>Racecar: After completing an online course by MIT, my team and I created and programmed an autonomous car in order to complete at the national competition Racecar Challenge. We got 2nd and 3rd place two consecutive years.</li>
                            <li><a href="https://github.com/konstantinosfragkoulis/DroneCtrl" target="_blank" rel="noopener noreferrer">Autonomous Drone</a>: Building on the knowledge I gained from creating an autonomous racecar, I decided to develop an autonomous drone. This project presents a greater challenge, allowing me to expand my knowledge of autonomous vehicles and delve deeper into electronics, not just coding. </li>
                        </ul>
                        <h1>See my work</h1>
                        <p>You can find more of my projects on:</p>
                        <ul>
                            <li>GitHub: <a href="https://github.com/konstantinosfragkoulis" target="_blank" rel="noopener noreferrer">konstantinosfragkoulis</a></li>
                            <li>Scrapbook: <a href="https://scrapbook.hackclub.com/KonstantinosFragkoulis" target="_blank" rel="noopener noreferrer">https://scrapbook.hackclub.com/KonstantinosFragkoulis</a></li>
                        </ul>
                    </>
                );
            case 'contact':
                return (
                    <>
                        <h1>Contact</h1>
                        <p>You can reach me at:</p>
                        <ul>
                            <li>Email (Does not work yet!): <a href="mailto:inbox@konstantinos.me">inbox@konstantinos.me</a></li>
                            <li>LinkedIn: <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">yourprofile</a></li>
                            <li>GitHub: <a href="https://github.com/konstantinosfragkoulis" target="_blank" rel="noopener noreferrer">konstantinosfragkoulis</a></li>
                            
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
