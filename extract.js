// Simple code to extract data downloaded by the npm script
// Would have used something on the cli but couldn't find anything decent

import { join } from "path";
import { pathExists } from "fs-extra";
import sevenBin from "7zip-bin";
import { directory } from "./modules/constants.js";
import Seven from "node-7z"; // Doesn't have named exports

const cacheDirectory = join(directory, "cache");
const archivePath = join(directory, "cache", "fortnite_pages_current.xml.7z");

const pathTo7zip = sevenBin.path7za;
console.log("7z binary:", pathTo7zip);

if (await pathExists(archivePath)) {
    console.log("found fortnite_pages_current.xml.7z, attempting to extract...");
    const stream = Seven.extractFull(archivePath, cacheDirectory, {
        $bin: pathTo7zip,
        overwrite: "s", // Skip extraction if file already exists
    });
    stream.on("error", (error) => console.error(error));
    stream.on("end", () => console.log("finished extracting data"));
} else {
    console.error("fortnite_pages_current.xml.7z was not found");
}
