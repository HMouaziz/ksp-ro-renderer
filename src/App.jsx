import { Canvas } from '@react-three/fiber'
import './styles/app.scss';
import {Grid, OrbitControls} from "@react-three/drei";
import SolarSystem from "./components/SolarSystem/SolarSystem.jsx";
import CameraAdjuster from "./components/CameraAdjuster/CameraAdjuster.jsx";

export default function App() {
    return (
        <div id="canvas-container">
            <Canvas antialias='true' className='canvas'>
                <ambientLight intensity={0.5}/>
                <pointLight position={[0, 0, 0]} intensity={1} color={'#ffffff'}/>
                <directionalLight color="white" position={[0, 0, 5]}/>

                <SolarSystem/>
                <Grid color="#ffffff" colorCenterLine="red"/>
                <OrbitControls enablePan={false}/>
                <CameraAdjuster/>
            </Canvas>
        </div>
    );
}