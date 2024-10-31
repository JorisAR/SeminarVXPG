// src/Components/Settings/PipelineTabs.tsx
import React from 'react';
import 'Components/Settings/Settings.css';
import settings from 'Components/Settings/Settings';
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
                Super Pixel Count: {statistics.superPixelCount} <br/>
                Super Voxel Count: {statistics.superVoxelCount} <br/>
                Injection Ray Count: {statistics.injectionRayCount} <br/>
                PathTracing hit percentage Count: {statistics.pathTracingHitPercentage}% <br/>
            </div>
        </div>
    );
};

export default StatisticsComponent;
