import {useState} from "react";
import {Html} from "@react-three/drei";
import * as THREE from "three";
import spriteIdleTextureImg from '../../data/circle-256.png';
const spriteIdleTexture = new THREE.TextureLoader().load(spriteIdleTextureImg)

const CelestialObjectMesh = ({ celestialObject, onDoubleClick }) => {
    if (!celestialObject || !celestialObject.position) {
        console.error("Invalid or incomplete celestialObject prop provided.");
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isHovered, setIsHovered] = useState(false);

    const { position, size, color } = celestialObject;

    return (
        <>
            <mesh position={position}
                  onDoubleClick={() => onDoubleClick(celestialObject)}
                  onPointerOver={(e) => {
                      e.stopPropagation();
                      console.log(`${celestialObject.name}`);
                      setIsHovered(true);
                  }}
                  onPointerOut={(e) => {
                      e.stopPropagation();
                      setIsHovered(false);
                  }}
            >
                <sphereGeometry args={[size, 32, 32]}/>
                <meshStandardMaterial color={color} depthTest={true}/>
                {isHovered && (
                    <Html position={[0, size * 10, 0]} transform occlude>
                        <div style={{
                            color: 'white',
                            background: 'rgba(0, 0, 0, 0.75)',
                            padding: '2px 5px',
                            borderRadius: '4px'
                        }}>
                            {name}
                        </div>
                    </Html>
                )}
            </mesh>
            {/*<sprite position={position}>*/}
            {/*    <spriteMaterial map={spriteIdleTexture} color={color}/>*/}
            {/*</sprite>*/}
        </>
    );
};
export default CelestialObjectMesh;