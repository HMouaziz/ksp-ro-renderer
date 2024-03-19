import * as THREE from 'three';

class CelestialObject {
    constructor(data, scale = 1e-9) {
        if (!data || typeof data.englishName === 'undefined') {
            console.error('Attempted to create CelestialObject with invalid data:', data);
            throw new Error('Invalid data provided to CelestialObject constructor');
        }


        //Basic information
        this.name = data.englishName || 'Unknown';
        this.isPlanet = data.isPlanet || false;
        this.bodyType = data.bodyType;
        this.color = this.assignColor()

        // Orbit parameters
        this.orbitData = {
            semiMajorAxis: data.semiMajorAxis * scale,
            perihelion: data.perihelion * scale,
            aphelion: data.aphelion * scale,
            eccentricity: data.eccentricity,
            inclination: data.inclination,
            siderealOrbit: data.siderealOrbit,
            siderealRotation: data.siderealRotation,
            meanAnomaly: data.meanAnomaly,
            argPeriapsis: data.argPeriapsis,
            longAscNode: data.longAscNode,
            axialTilt: data.axialTilt,
            epoch: (Date.now() - Date.UTC(2000, 0, 1, 12, 0, 0)) / (1000 * 60 * 60 * 24)
        };


        // Physical characteristics
        this.characteristics = {
            // mass: data.mass.massValue * Math.pow(10, data.mass.massExponent),
            // volume: data.vol.volValue * Math.pow(10, data.vol.volExponent),
            density: data.density,
            gravity: data.gravity,
            escapeVelocity: data.escape,
            meanRadius: data.meanRadius * scale,
            equatorRadius: data.equatorRadius * scale,
            polarRadius: data.polarRadius * scale,
            flattening: data.flattening,
            avgTemp: data.avgTemp
        }
        // Moons
        this.moons = data.moons;

        //Calculated
        this.size = data.isPlanet ? data.meanRadius * 2000  * scale : data.meanRadius * 50  * scale;
        this.meanAnomaly = this.calculateMeanAnomaly(Date.now());
        this.trueAnomaly = this.calculateTrueAnomaly(Date.now());
        this.position = this.calculatePosition();
        this.orbitPoints = this.calculateOrbitPoints();

        console.log(this)
    }

    calculatePosition() {
        const trueAnomaly = this.trueAnomaly;

        // Simplified calculation of position in the orbital plane
        const distance = this.orbitData.semiMajorAxis * (1 - this.orbitData.eccentricity * Math.cos(trueAnomaly)); // This is a very simplified version

        // Convert polar coordinates (distance, trueAnomaly) to Cartesian coordinates in the orbital plane
        const x = distance * Math.cos(trueAnomaly);
        const y = distance * Math.sin(trueAnomaly);
        const z = 0; // Initially, in the orbital plane, z is 0

        // Apply inclination to rotate the position out of the orbital plane
        const inclinedY = y * Math.cos(this.orbitData.inclination) - z * Math.sin(this.orbitData.inclination);
        const inclinedZ = y * Math.sin(this.orbitData.inclination) + z * Math.cos(this.orbitData.inclination);

        // Assuming the ascending node is along the X-axis, the X-coordinate remains unchanged
        // If you also have the longitude of ascending node, you would rotate the (x, inclinedY) around Z-axis by that angle

        return [x, inclinedY, inclinedZ];
    }

    calculateOrbitPoints(numPoints = 100) {
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const angle = (2 * Math.PI / numPoints) * i;
            const radius = this.orbitData.semiMajorAxis * (1 - this.orbitData.eccentricity ** 2) / (1 + this.orbitData.eccentricity * Math.cos(angle));

            let x = radius * Math.cos(angle);
            let y = radius * Math.sin(angle);
            let z = 0;
            // let z = radius * Math.sin(angle) * Math.sin(this.orbitData.inclination);

            // Apply inclination
            const inclinedY = y * Math.cos(this.orbitData.inclination) - z * Math.sin(this.orbitData.inclination);
            const inclinedZ = y * Math.sin(this.orbitData.inclination) + z * Math.cos(this.orbitData.inclination);

            // Create a THREE.Vector3 point and rotate it around the Z-axis by the longitude of the ascending node
            let point = new THREE.Vector3(x, inclinedY, inclinedZ);
            // const rotationMatrix = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(this.orbitData.longAscNode));
            // point.applyMatrix4(rotationMatrix);

            points.push(point);
        }
        return points;
    }

    meanAnomalyInRadians() {
        return (this.meanAnomaly * Math.PI) / 180;
    }

    calculateMeanAnomaly(date) {
        const meanMotion = 360 / this.orbitData.siderealOrbit; // Mean motion in degrees per day
        const deltaTime = (date - this.orbitData.epoch) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
        let currentMeanAnomaly = this.orbitData.meanAnomaly + meanMotion * deltaTime;


        // Normalize the mean anomaly to the range [0, 360)
        currentMeanAnomaly = currentMeanAnomaly % 360;
        if (currentMeanAnomaly < 0) currentMeanAnomaly += 360;


        return currentMeanAnomaly;
    }

    calculateTrueAnomaly(date) {
        const M = this.meanAnomalyInRadians(date); // Mean anomaly in radians
        const e = this.orbitData.eccentricity;
        let E = M; // Initial guess for E

        // Solve Kepler's Equation for E using Newton-Raphson method
        for (let i = 0; i < 10; i++) {
            E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        }

        // Calculate true anomaly ν from eccentric anomaly E
        const ν = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));

        // Convert true anomaly back to degrees if needed
        return ν * (180 / Math.PI);
    }


    assignColor() {
        const colorMap = {
            Sun: '#FFCC00', // A bright yellow, representing the Sun's bright light.
            Mercury: '#AAAAAA', // A dark gray, reflecting Mercury's rocky surface.
            Venus: '#FFD700', // A golden color, symbolizing Venus's thick, reflective atmosphere.
            Earth: '#1E90FF', // A deep blue, representing Earth's oceans.
            Moon: '#C0C0C0', // A lighter gray, distinguishing it from Mercury and symbolizing the Moon's surface.
            Mars: '#E57373', // A soft red, representing Mars's nickname as the Red Planet.
            Phobos: '#8D6E63', // A dark tan, reflecting Phobos's dusty surface.
            Deimos: '#BCAAA4', // A lighter tan, distinguishing it from Phobos.
            Vesta: '#FFEB3B', // A bright yellowish, symbolizing its bright, reflective surface.
            Ceres: '#F5F5F5', // A very light gray, indicating its relatively bright surface.
            Jupiter: '#F4C2C2', // A light salmon pink, reflecting its distinctive coloration.
            Io: '#FFA726', // A vibrant orange, representing Io's volcanic activity.
            Europa: '#81D4FA', // A light blue, symbolizing its icy surface.
            Ganymede: '#BDBDBD', // A medium gray, representing its mixture of rocky and icy surface.
            Callisto: '#A1887F', // A brown-gray, symbolizing its heavily cratered and icy surface.
            Saturn: '#FFE082', // A light gold, representing its rings and gas composition.
            Mimas: '#E0E0E0', // A very light gray, distinguishing it from other moons.
            Enceladus: '#ECEFF1', // A bright, almost white, reflecting its icy jets.
            Tethys: '#B3E5FC', // A very light blue, indicating its icy surface.
            Dione: '#CFD8DC', // A light gray, symbolizing its icy and rocky surface.
            Rhea: '#E0F7FA', // An extremely light blue, representing its icy surface.
            Titan: '#FFAB91', // A soft orange, representing its thick, hazy atmosphere.
            Iapetus: '#FFE0B2', // A light beige, representing its unique yin-yang coloring.
            Uranus: '#80DEEA', // A cyan, representing its methane atmosphere.
            Miranda: '#80CBC4', // A teal, symbolizing its icy and rocky surface.
            Ariel: '#B2EBF2', // A lighter cyan, differentiating it from Uranus.
            Umbriel: '#78909C', // A blue-gray, indicating its dark surface.
            Titania: '#B2DFDB', // A soft green, representing its icy surface.
            Oberon: '#90A4AE', // A darker gray-blue, symbolizing its old, heavily cratered surface.
            Neptune: '#5C6BC0', // A royal blue, reflecting its deep blue atmosphere.
            Triton: '#B3E5FC', // A very light blue, similar to Tethys, symbolizing its icy geysers.
            Pluto: '#FFCCBC', // A light brown, representing its rocky, icy surface.
            Charon: '#E0E0E0', // A light gray, indicating its varied icy and rocky geography.
        };

        const defaultColor = 'white';

        return colorMap[this.name] || defaultColor;
    }

}

export default CelestialObject;