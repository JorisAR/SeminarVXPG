// src/Components/Legend/Legend.tsx
import React from 'react';
import './Legend.css';
import settings, {Tab} from "Components/Settings/Settings";
import useSettings from "Hooks/UseSettings";

const LegendComponent: React.FC = () => {

    useSettings();

    const GetDescription = () => {
        switch (settings.selectedTab) {
            case Tab.Overview:
                return (
                <div className="box">
                    <h2>Paper Overview:</h2>
                    <h3>4 Overview</h3>
                    <strong>
                        An educational visualization tool for the <a href={"https://suikasibyl.github.io/vxpg"} color={"white"}>VXPG paper</a>, by Lu et. al.
                    </strong>
                    <br/>
                    <br/>

                    To achieve accurate real-time path-guiding with only two samples per pixel (spp), the paper proposes to use a global spatial distribution.
                    The rendering process is split up into two path tracing stages that both use 1 spp:
                    <ul>
                        <li>
                            The scene is partitioned into a set of disjoint voxels, and light is injected into these using path-tracing.
                        </li>
                        <li>
                            The final image is rendered using path-tracing, guided by the voxel data structure.
                        </li>
                    </ul>

                    <i>
                        <strong>Note:</strong> the paper is mostly focused on single-bounce indirect illumination, and so is this application.
                        Please refer to section "5.5 Path Guiding for Further Bounces" in the paper for how the authors suggest to extent it to multi-bounce indirect illumination.
                    </i>
                    <br/>
                </div>
            );
            case Tab.Scene:
                return (
                    <div className="box">
                        <h2>Scene:</h2>
                        In this visualisation tool, the scene is made up of a set of 2D Rectangles for clarity, a camera and a single point light. The original paper focuses on 3D triangle mesh scenes instead.
                        <br/>
                        <br/>
                        For each pixel in the camera's texture, we cast a ray into the scene. We call the closest ray-scene intersection a <strong>shading point</strong>.
                    </div>
                );
            case Tab.Clustering:
                return (
                    <div>
                        <div className="box">
                            <h2>Clustering</h2>
                            <h3>5.2 Voxel Selection</h3>
                            The voxels and shading points are divided into clusters, referred to as <strong>supervoxels</strong> and <strong>superpixels</strong> respectively.
                            This enables faster throughput calculation, which is required in the voxel selection step.
                        </div>
                    </div>
                );
            case Tab.LightInjection:
                return (
                    <div>
                        <div className="box">
                            <h2>Light Injection</h2>
                            <h3>5.1 Construct Bounding Voxels</h3>
                            Light is injected into the voxels using an initial path-tracing step. For every shading point, a BSDF-ray is emitted towards a point on the scene surface X<sub>2</sub>.
                            Then, the direct illumination is computed at X<sub>2</sub>, and injected into the voxel that contains X<sub>2</sub>.
                            <br/>If the shading point is illuminated directly, we inject that illumination without shooting a BSDF-ray.
                            <br/>
                            <br/>
                            <h2>Legend:</h2>
                            <ul>
                                <li>
                                    <span className="color-box" style={{backgroundColor: 'red'}}></span>Ray from camera to a shading point
                                </li>
                                <li>
                                    <span className="color-box" style={{backgroundColor: 'green'}}></span>BSDF Ray from a shading point to a lit secondary point X<sub>2</sub>
                                </li>
                                <li>
                                    <span className="color-box" style={{backgroundColor: '#102010'}}></span>BSDF Ray from a shading point to an unlit secondary point X<sub>2</sub>
                                </li>
                                <li><
                                    span className="color-box" style={{backgroundColor: 'blue'}}></span>Light occlusion ray
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            case Tab.Throughput:
                return (
                    <div>
                        <div className="box">
                            <h2>Throughput & Voxel Selection</h2>
                            <h3>5.2 Voxel Selection</h3>
                            After the voxel structure has been prepared, the throughput of irradiance between all supervoxel and superpixel pairs can be computed.
                            Throughput is based on:
                            <ul>
                                <li>
                                    Occlusion: How much the scene geometry occludes rays between a superpixel and a supervoxel.
                                </li>
                                <li>
                                    Irradiance: How bright is a particular supervoxel.
                                </li>
                            </ul>
                            <br/>

                            Once throughput has been computed, a voxel can be selected per shading point in two steps:
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
            case Tab.VoxelSampling:
                return (
                    <div>
                        <div className="box">
                            <h2>Path Guiding</h2>
                            <h3>5.3 Intra-Voxel Sampling</h3>
                            Selected voxels can be used to directly guide the path-tracing algorithm.<br/>
                            From a shading point, we cast a ray towards the selected voxel. This means that the ray is more likely to hit a lit part of the scene compared to using a random BSDF-ray.
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
                            Every voxel includes a unique subset of the scene geometry.
                            <br/>
                            <br/>
                            A tight bounds around scene geometry is preferred over the native square bounding box of a voxel,
                            as this decreases the probability of missing geometry during the intra-voxel sampling stage.
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div style={{ width: '100%', height: '100%' , overflow:'scroll'}}>
            {GetDescription()}
        </div>
    );
};

export default LegendComponent;
