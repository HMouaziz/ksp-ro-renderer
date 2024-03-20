import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const CameraAdjuster = () => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(-602, -2228, -2318);
        camera.near = 0.0000001; // Minimum distance
        camera.far = 1000000; // Maximum distance
        camera.fov = 75
        camera.minDistance = 1 //not working
        camera.maxDistance = 1000 //not working
        camera.updateProjectionMatrix(); // Important: update the camera after changing properties
    }, [camera]);

    return null;
};

export default CameraAdjuster