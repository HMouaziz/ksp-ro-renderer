import CelestialObject from "../CelestialObjects/CelestialObject.js";
import celestialBodies from '../data/newdata.json';

async function fetchDataGroups() {
    try {
        return celestialBodies.map(body => {
                return new CelestialObject(body);
            });
    } catch (error) {
        console.error("Failed to process celestial bodies:", error);
        return [];
    }
}

export default fetchDataGroups