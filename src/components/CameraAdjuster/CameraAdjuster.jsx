import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const CameraAdjuster = () => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 1, 10);
        camera.near = 0.1; // Minimum distance
        camera.far = 10000000; // Maximum distance
        camera.updateProjectionMatrix(); // Important: update the camera after changing properties
    }, [camera]);

    return null;
};

export default CameraAdjuster