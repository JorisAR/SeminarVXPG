// src/Components/Legend/Legend.tsx
import React from 'react';
import './Legend.css';
import settings, {Tab} from "Components/settings/Settings";
import useSettings from "Hooks/UseSettings";

const LegendComponent: React.FC = () => {

    useSettings();

    const GetDescription = () => {
        switch (settings.selectedTab) {
            case Tab.Scene:
                return (
                        <div className="box">
                            <h2>Paper Overview:</h2>
                            <h3>4 Overview</h3>
                            <strong>
                                An educational visualization tool for the <a href={"https://suikasibyl.github.io/vxpg"} color={"white"}>VXPG paper</a>, by Lu et. al.
                                <br/>
                                The subtitles correspond to sections in the paper.
                            </strong>
                            <br/>
                            <br/>

                            To achieve more accurate path-guiding with only two samples per pixel (spp), the paper proposes to use a global spatial distribution.
                            To achieve this, the rendering process is split up in the following stages that both use 1 spp each:
                            <ul>
                                <li>
                                    The scene is partitioned into disjoint voxels, and light is injected into these using path-tracing.
                                </li>
                                <li>
                                    The final image is rendered using path-tracing, guided by the voxel data structure. A suitable voxel is selected, and a ray in the direction of this voxel is shot.
                                </li>
                            </ul>

                            Use the tabs in the bottom left window to navigate the different steps involved.

                        </div>

                );
            case Tab.Clustering:
                return (
                    <div>
                        <div className="box">
                            <h2>Clustering</h2>
                            <h3>5.2 Voxel Selection</h3>
                            The voxels and shading points are divided into clusters, referred to as supervoxels and superpixels respectively. This allows for much faster throughput calculation, which is required in the voxel selection step.
                        </div>
                    </div>
                );
            case Tab.LightInjection:
                return (
                    <div>
                        <div className="box">
                            <h2>Light Injection</h2>
                            <h3>5.1 Construct Bounding Voxels</h3>
                            Light is injected into the voxels using an initial path-tracing step. For every shading point, a BSDF-ray is emitted towards X2. Then the direct illumination is computed at X2, and injected into the voxel X2 is in.

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
            case Tab.Throughput:
                return (
                    <div>
                        <div className="box">
                            <h2>Throughput</h2>
                            <h3>5.2 Voxel Selection</h3>
                            After the voxel structure has been prepared, irradiance throughput between all supervoxel and superpixel pairs can be computed.
                            Throughput is based on:
                            <ul>
                                <li>
                                    Occlusion, or how much scene geometry is between a superpixel and a supervoxel.
                                </li>
                                <li>
                                    Irradiance, or how bright a particular voxel cluster is.
                                </li>
                            </ul>

                        </div>
                    </div>
                );
            case Tab.VoxelSelection:
                return (
                    <div>
                        <div className="box">
                            <h2>Voxel Selection</h2>
                            <h3>5.2 Voxel Selection</h3>
                            Once throughput has been computed, a voxel can be selected per shading point.
                            <ul>
                                <li>
                                    Sample a supervoxel proportional to throughput.
                                </li>
                                <li>
                                    Sample a voxel within the supervoxel proportional to irradiance.
                                </li>
                            </ul>

                        </div>
                    </div>
                );
            case Tab.GeometryInjection:
                return (
                    <div>
                        <div className="box">
                            <h2>Geometry Injection</h2>
                            <h3>5.1 Construct Bounding Voxels</h3>
                            The scene is partitioned into a set of disjoint axis aligned voxels.
                            Every voxel includes a subset of scene geometry.
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {GetDescription()}
        </div>
    );
};

export default LegendComponent;
