import {useEffect, useState} from 'react';
import CelestialObjectMesh from '../CelestialObject/CelestialObjectMesh.jsx';
import fetchCelestialObjects from "../../utils/fetchCelestialObjects.js";
import OrbitLine from "../OrbitLine/OrbitLine.jsx";
import React from 'react';
import {useThree} from "@react-three/fiber";

const SolarSystem = () => {
    const [celestialBodies, setCelestialBodies] = useState([]);
    const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
    const { camera, gl,scene } = useThree();

    const handleDoubleClick = (e, celestialObject) => {
        console.log(e)
        setTargetPosition(celestialObject.position);
    }

    useEffect(() => {
        const [x, y, z] = targetPosition;
        camera.lookAt(x, y, z);

        gl.render(scene, camera);
    }, [targetPosition, camera, gl, scene]);
    
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
                                <CelestialObjectMesh key={obj.name} celestialObject={obj} onDoubleClick={handleDoubleClick}/>
                                <OrbitLine points={obj.orbitPoints} color={obj.color} />
                            </React.Fragment>
                        )


                }
                return null;
            })}
        </>
    );
};

export default SolarSystem;