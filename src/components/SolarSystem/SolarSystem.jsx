import {useEffect, useState} from 'react';
import CelestialObjectMesh from '../CelestialObject/CelestialObjectMesh.jsx';
import fetchCelestialObjects from "../../data/fetchCelestialObjects.js";
import OrbitLine from "../OrbitLine/OrbitLine.jsx";
import React from 'react';

const SolarSystem = () => {
    const [celestialBodies, setCelestialBodies] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchCelestialObjects();
            setCelestialBodies(data);
        };
        loadData();
    }, []);


    return (
        <>
            {celestialBodies.map((obj, index) => {
                // Ensure obj is a valid object before rendering
                if (obj && obj.name) {
                    return (
                            <React.Fragment key={obj.name || index}>
                                <CelestialObjectMesh key={obj.name} celestialObject={obj} />
                                <OrbitLine points={obj.calculated.orbitPoints} color="#dddddd" />
                            </React.Fragment>
                        )


                }
                return null;
            })}
        </>
    );
};

export default SolarSystem;