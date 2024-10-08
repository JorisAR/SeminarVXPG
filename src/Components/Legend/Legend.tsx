// src/Components/Legend/Legend.tsx
import React from 'react';
import './Legend.css';

const Legend: React.FC = () => {
    return (
        <div className="Legend">
            <h2>Legend</h2>
            <ul>
                <li><span className="color-box" style={{ backgroundColor: 'red' }}></span> Red: Description for red</li>
                <li><span className="color-box" style={{ backgroundColor: 'green' }}></span> Green: Description for green</li>
                <li><span className="color-box" style={{ backgroundColor: 'blue' }}></span> Blue: Description for blue</li>
            </ul>
        </div>
    );
};

export default Legend;
