import {TextureLoader} from "three";
import {useLoader} from "@react-three/fiber";

export const CelestialBodySprite = ({ position, scale, textureUrl }) => {
    const texture = useLoader(TextureLoader, textureUrl);
    return (
        <sprite position={position} scale={scale}>
            <spriteMaterial attach="material" map={texture}/>
        </sprite>
    )
}