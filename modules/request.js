import fetch from "node-fetch";
import { redirectURI } from "./constants.js";
import { setTimeout as sleep } from "node:timers/promises";

export const encodeWikiURI = (text) => encodeURI(text.split(" ").join("_"));

/**
 * @param {string} title
 * @returns {Promise<string|null>}
 */
export const getFileURI = async function(title) {
    try {
        // Fair rate limit. I couldn't find any documentation on this, only the one for edits (40/min).
        // This is about 60/min, and still takes about 4.2 hours for the 15,000 or so files passing file name requirements right now
        await sleep(1000);
        const response = await fetch(redirectURI + encodeWikiURI(title), {
            // We don't want the files, just the http 301 redirect headers
            redirect: "manual",
        });
        const location = response.headers.get("location");
        return location?.substring(0, location?.indexOf("/revision/latest")) || null;
    } catch (error) {
        console.error(error);
        return null;
    }
};
