// Simple code to extract data downloaded by the npm script
// Would have used something on the cli but couldn't find anything decent

import { join } from "node:path";
import { platform } from "node:os";
import { chmod } from "node:fs/promises";
import { pathExists } from "fs-extra";
import sevenBin from "7zip-bin";
import Seven from "node-7z";
import { directory } from "./modules/constants.js";

const cacheDirectory = join(directory, "cache");
const archivePath = join(directory, "cache", "fortnite_pages_current.xml.7z");

const pathTo7zip = sevenBin.path7za;
console.log("7z binary:", pathTo7zip);

if (platform() == "linux") {
    try {
        await chmod(pathTo7zip, "755");
    } catch (error) {
        console.error(error);
    }
}

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
