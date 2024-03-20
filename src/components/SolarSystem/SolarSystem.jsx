import React, {useEffect, useState} from 'react';
import CelestialObjectMesh from '../CelestialObject/CelestialObjectMesh.jsx';
import fetchDataGroups from "../../utils/fetchDataGroups.js";
import {useThree} from "@react-three/fiber";
import OrbitLine from "../OrbitLine/OrbitLine.jsx";
import {generateUUID} from "three/src/math/MathUtils.js";


const SolarSystem = () => {
    const [celestialBodies, setCelestialBodies] = useState([]);
    const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
    const {camera, gl, scene} = useThree();

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
            const data = await fetchDataGroups();
            setCelestialBodies(data);
        };
        loadData();
    }, []);

    const renderCelestialBody = (celestialBody) => {
        switch (celestialBody.bodyType) {
            case 'Star':
                return (
                    <CelestialObjectMesh
                        key={generateUUID()}
                        celestialObject={celestialBody}
                        onDoubleClick={handleDoubleClick}
                    />
                );
            case 'Moon':
                return (
                    <React.Fragment key={generateUUID()}>
                        <CelestialObjectMesh
                            key={generateUUID()}
                            celestialObject={celestialBody}
                            onDoubleClick={handleDoubleClick}
                        />
                        <OrbitLine key={generateUUID()} points={celestialBody.orbitPoints} color={celestialBody.color}/>
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment key={generateUUID()}>
                        <CelestialObjectMesh
                            key={generateUUID()}
                            celestialObject={celestialBody}
                            onDoubleClick={handleDoubleClick}
                        />
                        <OrbitLine key={generateUUID()} points={celestialBody.orbitPoints} color={celestialBody.color}/>
                    </React.Fragment>
                )

        }
    };

    return (
        <>
            {celestialBodies.map(celestialBody => renderCelestialBody(celestialBody))}
        </>
    );
};

export default SolarSystem;