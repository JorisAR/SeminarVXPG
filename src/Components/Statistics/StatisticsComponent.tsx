// src/Components/settings/PipelineTabs.tsx
import React from 'react';
import 'Components/settings/Settings.css';
import settings from 'Components/settings/Settings';
import useSettings from 'Hooks/UseSettings';
import useStatistics from "Hooks/UseStatistics";
import statistics from "Components/Statistics/Statistics";

const StatisticsComponent: React.FC = () => {
    useStatistics();

    return (
        <div className="content" style={{ width: '100%', height: '100%' }}>

            <div className="box">
                <h2>Statistics: </h2>
                Voxel Count: {statistics.voxelCount} <br/>
                ShadingPoint Count: {statistics.shadingPointCount} <br/>
                Injection Ray Count: {statistics.injectionRayCount} <br/>
                PathTracing hit percentage Count: {statistics.pathTracingHitPercentage}% <br/>
            </div>
        </div>
    );
};

export default StatisticsComponent;
