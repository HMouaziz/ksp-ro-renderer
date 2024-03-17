const CelestialObjectMesh = ({ celestialObject }) => {
    // Ensure celestialObject and its calculated property exist to avoid runtime errors.
    if (!celestialObject || !celestialObject.calculated || !celestialObject.calculated.position) {
        console.error("Invalid or incomplete celestialObject prop provided.");
        return null; // Render nothing if the data is invalid.
    }

    // Destructure properties for easier access
    const { calculated: { position }, size, color } = celestialObject;

    return (
        <mesh position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial color={color} depthTest={true}/>
        </mesh>
    );
};
export default CelestialObjectMesh;