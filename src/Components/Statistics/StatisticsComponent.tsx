import React from 'react';
import 'Components/Settings/Settings.css';
import useStatistics from "Hooks/UseStatistics";
import statistics from "Components/Statistics/Statistics";
import "./Statistics.css"

const StatisticsComponent: React.FC = () => {
    useStatistics();

    return (
        <div className="content" style={{ width: '100%', height: '100%' }}>

            <div className="box">
                <h2>Statistics:</h2>
                <div className="stat">
                    <div className="label">Voxel Count:</div>
                    <div className="value">{statistics.voxelCount}</div>
                </div>
                <div className="stat">
                    <div className="label">ShadingPoint Count:</div>
                    <div className="value">{statistics.shadingPointCount}</div>
                </div>
                <div className="stat">
                    <div className="label">Super Pixel Count:</div>
                    <div className="value">{statistics.superPixelCount}</div>
                </div>
                <div className="stat">
                    <div className="label">Super Voxel Count:</div>
                    <div className="value">{statistics.superVoxelCount}</div>
                </div>
                <div className="stat">
                    <div className="label">Injection Ray Count:</div>
                    <div className="value">{statistics.injectionRayCount}</div>
                </div>
                <div className="stat">
                    <div className="label">Path-Tracing Hit Rate:</div>
                    <div className="value">{statistics.pathTracingHitPercentage}%</div>
                </div>
            </div>


        </div>
    );
};

export default StatisticsComponent;
