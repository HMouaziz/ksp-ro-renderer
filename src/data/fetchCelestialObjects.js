import CelestialObject from "./CelestialObject.js";
import celestialBodies from './data.json';

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
    try {
        return celestialBodies
            .filter(body => allowedBodies.includes(body.englishName))
            .map(body => {
                return new CelestialObject(body);
            });
    } catch (error) {
        console.error("Failed to process celestial bodies:", error);
        return [];
    }
}

export default fetchCelestialObjects