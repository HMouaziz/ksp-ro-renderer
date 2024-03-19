import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const CameraAdjuster = () => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 2, 0);
        camera.near = 0.0000001; // Minimum distance
        camera.far = 10000; // Maximum distance
        camera.fov = 75
        camera.minDistance = 1 //not working
        camera.maxDistance = 1000 //not working
        camera.updateProjectionMatrix(); // Important: update the camera after changing properties
    }, [camera]);

    return null;
};

export default CameraAdjuster