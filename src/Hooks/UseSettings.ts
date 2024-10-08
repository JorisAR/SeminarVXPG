// src/hooks/useSettings.ts
import { useState, useEffect } from 'react';
import settings from "Components/Pipeline/Settings";


const useSettings = () => {
    const [voxelSize, setVoxelSize] = useState(settings.voxelSize);
    const [simulationSpeed, setSimulationSpeed] = useState(settings.simulationSpeed);
    const [simulationActive, setToggleSimulation] = useState(settings.simulationActive);
    const [visibleRayCount, setVisibleRayCount] = useState(settings.visibleRayCount);
    const [selectedTab, setSelectedTab] = useState(settings.selectedTab);

    useEffect(() => {
        const handleVoxelSizeChange = (size: number) => {
            setVoxelSize(size);
        };

        const handleSimulationSpeedChange = (speed: number) => {
            setSimulationSpeed(speed);
        };

        const handleToggleSimulation = (toggle: boolean) => {
            setToggleSimulation(toggle);
        };

        const handleVisibleRayCountChange = (count: number) => {
            setVisibleRayCount(count);
        };

        const handleSelectedTabChange = (count: number) => {
            setSelectedTab(count);
        };

        settings.on('voxelSizeChange', handleVoxelSizeChange);
        settings.on('simulationSpeedChange', handleSimulationSpeedChange);
        settings.on('toggleSimulation', handleToggleSimulation);
        settings.on('visibleRayCountChange', handleVisibleRayCountChange);
        settings.on('selectedTabChange', handleSelectedTabChange);


        return () => {
            settings.off('voxelSizeChange', handleVoxelSizeChange);
            settings.off('simulationSpeedChange', handleSimulationSpeedChange);
            settings.off('toggleSimulation', handleToggleSimulation);
            settings.off('visibleRayCountChange', handleVisibleRayCountChange);
            settings.off('selectedTabChange', handleSelectedTabChange);
        };
    }, []);

    return { voxelSize, simulationSpeed, simulationActive, visibleRayCount, selectedTab};
};

export default useSettings;
