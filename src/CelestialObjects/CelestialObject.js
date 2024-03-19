import * as THREE from "three";


class CelestialObject {
    constructor(data, scaleD = 1e-9, scaleS = 1e-5) {
        if (!data || typeof data.id === 'undefined') {
            console.error('Attempted to create CelestialObject with invalid data:', data);
            throw new Error('Invalid data provided to CelestialObject constructor');
        }

        this.id = data.id;
        this.name = data.name;
        this.bodyType = data.bodyType;
        this.radius = data.radius * scaleS;
        this.mass = data.mass;
        this.stdGravParam = data.stdGravParam;
        this.soi = data.soi * scaleS;
        this.scaleD = scaleD
        this.scaleS = scaleS
        this.color = data.color;

        this.size = this.radius * 2;
        if (this.bodyType === 'Star') return

        //temp
        this.semiMajorAxis = data.orbit.semiMajorAxis * scaleD;
        this.eccentricity = data.orbit.eccentricity;
        this.inclination = data.orbit.inclination;
        this.argOfPeriapsis = data.orbit.argOfPeriapsis;
        this.ascNodeLongitude = data.orbit.ascNodeLongitude;
        this.baseMeanAnomaly = data.meanAnomaly0;

        //Calculated
        this.epoch = this.getJ2000JD();
        this.date = this.getCurrentJD();
        this.siderealOrbit = this.calculateSiderealOrbit(this.semiMajorAxis)
        this.meanAnomaly = this.calculateMeanAnomaly(this.date, this.epoch, this.siderealOrbit, this.baseMeanAnomaly);
        this.trueAnomaly = this.calculateTrueAnomaly(this.meanAnomaly, this.eccentricity);

        this.position = this.calculatePosition(this.semiMajorAxis, this.eccentricity, this.inclination, this.trueAnomaly, this.ascNodeLongitude);
        this.orbitPoints = this.calculateOrbitPoints(this.semiMajorAxis, this.eccentricity, this.inclination, this.ascNodeLongitude);

        console.log(`${this.name} inclination: ${this.inclination}`)
    }

    calculateSiderealOrbit(semiMajorAxis, muSun = 1.32712440018e20) {
        const T = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / muSun);

        return T / (60 * 60 * 24);
    }


    getCurrentJD() {
        const now = new Date();
        const day = now.getUTCDate();
        const month = now.getUTCMonth() + 1; // January is 0!
        const year = now.getUTCFullYear();
        const hour = now.getUTCHours();
        const minute = now.getUTCMinutes();
        const second = now.getUTCSeconds();

        // Calculate Julian Date
        let JD = (1461 * (year + 4800 + (month - 14) / 12)) / 4 + (367 * (month - 2 - 12 * ((month - 14) / 12))) / 12 - (3 * ((year + 4900 + (month - 14) / 12) / 100)) / 4 + day - 32075;
        JD += hour / 24 + minute / 1440 + second / 86400 - 0.5; // Adjust for time of day; subtract 0.5 to start days at noon

        return JD;
    }

    getJ2000JD() {
        return 2451545.0;
    }

    calculatePosition(semiMajorAxis, eccentricity, inclination, trueAnomaly, ascendingLongitude) {
        // Simplified calculation of position in the orbital plane
        const distance = semiMajorAxis * (1 - eccentricity * Math.cos(trueAnomaly));
        const x = distance * Math.cos(trueAnomaly);
        const y = distance * Math.sin(trueAnomaly);
        const z = 0;

        const inclinationR = inclination * (Math.PI / 180);

        const inclinedY = y * Math.cos(inclinationR) - z * Math.sin(inclinationR);
        const inclinedZ = y * Math.sin(inclinationR) + z * Math.cos(inclinationR);

        let position = new THREE.Vector3(x, inclinedY, inclinedZ);

        const rotationMatrix = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(ascendingLongitude));
        position.applyMatrix4(rotationMatrix);

        return position;
    }

    calculateOrbitPoints(semiMajorAxis, eccentricity, inclination, ascendingLongitude, numPoints = 256) {
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const angle = (2 * Math.PI / numPoints) * i;
            const radius = semiMajorAxis * (1 - eccentricity ** 2) / (1 + eccentricity * Math.cos(angle));

            let x = radius * Math.cos(angle);
            let y = radius * Math.sin(angle);
            let z = 0;
            // let z = radius * Math.sin(angle) * Math.sin(this.orbitData.inclination);

            const inclinationR = inclination * (Math.PI / 180);

            // Apply inclination
            const inclinedY = y * Math.cos(inclinationR) - z * Math.sin(inclinationR);
            const inclinedZ = y * Math.sin(inclinationR) + z * Math.cos(inclinationR);

            // Create a THREE.Vector3 point and rotate it around the Z-axis by the longitude of the ascending node
            let point = new THREE.Vector3(x, inclinedY, inclinedZ);
            const rotationMatrix = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(ascendingLongitude));
            point.applyMatrix4(rotationMatrix);

            points.push(point);
        }
        return points;
    }

    meanAnomalyInRadians(meanAnomaly) {
        return (meanAnomaly * Math.PI) / 180;
    }

    calculateMeanAnomaly(date, epoch, siderealOrbit, baseMeanAnomaly) {
        const meanMotion = 360 / siderealOrbit; // Mean motion in degrees per day
        const deltaTime = date - epoch;
        let currentMeanAnomaly = baseMeanAnomaly + meanMotion * deltaTime;

        // Normalize the mean anomaly to the range [0, 360)
        currentMeanAnomaly = currentMeanAnomaly % 360;
        if (currentMeanAnomaly < 0) currentMeanAnomaly += 360;

        return currentMeanAnomaly;
    }

    calculateTrueAnomaly(meanAnomaly, eccentricity) {
        const M = this.meanAnomalyInRadians(meanAnomaly);
        const e = eccentricity;
        let E = M;

        // Solve Kepler's Equation for E using Newton-Raphson method
        for (let i = 0; i < 10; i++) {
            E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        }
        // Calculate true anomaly ν from eccentric anomaly E
        const v = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
        // Convert true anomaly back to degrees if needed
        return v * (180 / Math.PI);
    }


}

export default CelestialObject;