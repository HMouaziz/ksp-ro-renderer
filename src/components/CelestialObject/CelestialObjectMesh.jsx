
const CelestialObjectMesh = ({ celestialObject, onDoubleClick }) => {
    if (!celestialObject) {
        console.error("Invalid or incomplete celestialObject prop provided.");
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const [isHovered, setIsHovered] = useState(false);

    const { position, size, color } = celestialObject;

    return (
        <>
            <mesh position={position}
                  onDoubleClick={(e) => onDoubleClick(e, celestialObject)}
                  // onPointerOver={(e) => {
                  //     e.stopPropagation();
                  //     console.log(`${celestialObject.name}`);
                  //     setIsHovered(true);
                  // }}
                  // onPointerOut={(e) => {
                  //     e.stopPropagation();
                  //     setIsHovered(false);
                  // }}
            >
                <sphereGeometry args={[size, 32, 32]}/>
                <meshStandardMaterial color={color} depthTest={true}/>
                {/*{isHovered && (*/}
                {/*    <Html position={[0, size * 10, 0]} transform occlude>*/}
                {/*        <div style={{*/}
                {/*            color: 'white',*/}
                {/*            background: 'rgba(0, 0, 0, 0.75)',*/}
                {/*            padding: '2px 5px',*/}
                {/*            borderRadius: '4px'*/}
                {/*        }}>*/}
                {/*            {name}*/}
                {/*        </div>*/}
                {/*    </Html>*/}
                {/*)}*/}
            </mesh>
            {/*<sprite position={position} scale={0.2}>*/}
            {/*    <spriteMaterial map={spriteIdleTexture} color={color}/>*/}
            {/*</sprite>*/}
        </>
    );
};
export default CelestialObjectMesh;