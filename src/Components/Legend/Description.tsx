// src/Components/Legend/Legend.tsx
import React from 'react';
import './Legend.css';

const Description: React.FC = () => {
    return (
        <div className="Legend">
            <strong>An educational visualization tool for <a href={"https://suikasibyl.github.io/vxpg"} color={"white"}> the VXPG paper</a></strong><br/>
            Use the tabs below to inspect and influence different stages of the pipeline.
        </div>
    );
};

export default Description;
