import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const OrbitLine = ({ points, color = 'white' }) => {
    const { scene } = useThree();

    React.useEffect(() => {
        const material = new THREE.LineBasicMaterial({ color });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitLine = new THREE.LineLoop(geometry, material);

        scene.add(orbitLine);

        return () => scene.remove(orbitLine);
    }, [points, color, scene]);

    return null;
};

export default OrbitLine