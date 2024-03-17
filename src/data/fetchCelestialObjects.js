import CelestialObject from "./CelestialObject.js";

const allowedBodies = [
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Moon",
    "Mars",
    "Phobos",
    "Deimos",
    "Vesta",
    "Ceres",
    "Jupiter",
    "Io",
    "Europa",
    "Ganymede",
    "Callisto",
    "Saturn",
    "Mimas",
    "Enceladus",
    "Tethys",
    "Dione",
    "Rhea",
    "Titan",
    "Iapetus",
    "Uranus",
    "Miranda",
    "Ariel",
    "Umbriel",
    "Titania",
    "Oberon",
    "Neptune",
    "Triton",
    "Pluto",
    "Charon"
];


async function fetchCelestialObjects() {
    const storageKey = 'celestialObjects';
    try {
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            return parsedData.map(body => new CelestialObject(body));
        }

        const response = await fetch("https://api.le-systeme-solaire.net/rest/bodies");
        const data = await response.json();

        const celestialObjects = data.bodies
            .filter(body => allowedBodies.includes(body.englishName))
            .reduce((acc, body) => {
            if (body && body.englishName) {
                acc.push(new CelestialObject(body));
            } else {
                console.warn('Incomplete data for object, skipped:', body);
            }
            return acc;
        }, []);

        localStorage.setItem(storageKey, JSON.stringify(celestialObjects.map(obj => ({
            id: obj.id,
            name: obj.name,
            englishName: obj.englishName,
            isPlanet: obj.isPlanet,
            moons: obj.moons,
            semimajorAxis: obj.semimajorAxis,
            perihelion: obj.perihelion,
            aphelion: obj.aphelion,
            eccentricity: obj.eccentricity,
            inclination: obj.inclination,
            mass: obj.mass,
            vol: obj.vol,
            density: obj.density,
            gravity: obj.gravity,
            escape: obj.escape,
            meanRadius: obj.meanRadius,
            equaRadius: obj.equaRadius,
            polarRadius: obj.polarRadius,
            flattening: obj.flattening,
            dimension: obj.dimension,
            sideralOrbit: obj.sideralOrbit,
            sideralRotation: obj.sideralRotation,
            aroundPlanet: obj.aroundPlanet,
            discoveredBy: obj.discoveredBy,
            discoveryDate: obj.discoveryDate,
            alternativeName: obj.alternativeName,
            axialTilt: obj.axialTilt,
            avgTemp: obj.avgTemp,
            mainAnomaly: obj.mainAnomaly,
            argPeriapsis: obj.argPeriapsis,
            longAscNode: obj.longAscNode,
            bodyType: obj.bodyType
        }))));

        return celestialObjects
    } catch (error) {
        console.error("Failed to fetch celestial bodies:", error);
        return [];
    }
}

export default fetchCelestialObjects