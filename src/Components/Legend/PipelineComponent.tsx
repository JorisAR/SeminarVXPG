// src/Components/Legend/Legend.tsx
import React from 'react';
import './Legend.css';
import settings from "Components/settings/Settings";
import useSettings from "Hooks/UseSettings";

const PipelineComponent: React.FC = () => {

    useSettings();

    const GetDescription = () => {
        switch (settings.selectedTab) {
            case 0:
                return (
                    <div>
                        <div className="Legend">
                            <h2>Paper Overview:</h2>
                            <strong>An educational visualization tool for <a href={"https://suikasibyl.github.io/vxpg"} color={"white"}> the VXPG paper</a></strong>
                            <br/>
                            <br/>

                            To achieve more accurate path-guiding with only two samples per pixel, the paper proposes to
                            use a global spatial distribution.
                            To achieve this, the rendering process is split up in two stages that both use one sample per pixel:
                            <ul>
                                <li>The scene is divided into voxels, and light is injected into these using path-tracing.
                                </li>
                                <li>We now calculate image values using path-guiding. For each shading point, we sample a voxel proportional to its throughput (Irradiance with occlusion taken into account). We then shoot a ray in the direction of this voxel.
                                </li>
                            </ul>

                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <div className="Legend">
                            <h2>Definitions</h2>
                            <strong>Voxels</strong> is the set of disjoint axis aligned bounding boxes around the
                            geometry. Ideally, they form a tight bound around the scene geometry with positive
                            irradiance.<br/><br/>
                            <strong>Shading points</strong> is the set of points on the geometry directly seen by the
                            camera.<br/><br/>


                            <h2>Clusters</h2>
                            To more efficiently select voxels, we cluster both shading points and clusters.
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div className="Legend">
                            <ul>
                                <li><span className="color-box" style={{backgroundColor: 'red'}}></span>Ray from camera
                                    to shading point
                                </li>
                                <li><span className="color-box" style={{backgroundColor: 'green'}}></span>BSDF Ray from
                                    shading point to a secondary point x2
                                </li>
                                <li><span className="color-box" style={{backgroundColor: 'blue'}}></span>Light occlusion
                                    rays from x2
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            case 3:
                return <div>Details for Stage 4</div>;
            case 4:
                return <div>Details for Stage 5</div>;
            default:
                return null;
        }
    }

    return (
        <div>
            <div className="tabs">
                <button onClick={() => settings.setSelectedTab(0)}>Scene</button>
                <button onClick={() => settings.setSelectedTab(1)}>Clustering</button>
                <button onClick={() => settings.setSelectedTab(2)}>Light Injection</button>
                <button onClick={() => settings.setSelectedTab(3)}>Throughput</button>
                <button onClick={() => settings.setSelectedTab(4)}>Voxel Selection</button>
            </div>
            {GetDescription()}
        </div>
    );
};

export default PipelineComponent;
