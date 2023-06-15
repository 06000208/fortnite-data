import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { pathExists } from "fs-extra";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { XMLParser } from "fast-xml-parser";
import { SingleBar, Presets } from "cli-progress";
import { directory, fileNameReqs, ignoredNamespaces, template } from "./modules/constants.js";
import { parsePage } from "./modules/parsing.js";
import { getFileURI } from "./modules/request.js";

const dataPath = join(directory, "cache", "fortnite_pages_current.xml");
const output = new Low(new JSONFile(join(directory, "cache", "fortnite.json")), { ...template });
await output.read();

// Ensure objects are reset
output.data.items = {};
output.data.files = {};

/**
 * Set of valid file page titles
 */
const filePages = new Set();

/**
 * Set of file page titles which contain the case-insensitive strings in the fileNameReqs array
 */
const processableFiles = new Set();

const progressBar = new SingleBar({
    format: "[{bar}] {percentage}% ({value}/{total}, ETA: {eta}s)",
    noTTYOutput: true,
    notTTYSchedule: 5000,
}, Presets.legacy);

// Main processing code
if (await pathExists(dataPath)) {
    console.log("reading xml...");
    const buffer = await readFile(dataPath);
    const content = buffer.toString();
    const parser = new XMLParser();
    console.log("converting ...");
    const data = parser.parse(content);
    output.data.timestamp = new Date().toISOString();
    const { page: pages } = data.mediawiki;
    console.log("iterating pages...");
    for (const page of pages) {
        if (typeof page.title == "number") page.title = page.title.toString();
        if (page.title.startsWith("File:")) {
            filePages.add(page.title);
            continue;
        }
        if (ignoredNamespaces.some((namespace) => page.title.startsWith(namespace))) continue;
        if (!page.revision.text) continue;
        const pageData = parsePage(page);
        // for now, skip saving any items without a valid type
        if (!pageData.type) continue;
        output.data.items[page.title.trim()] = pageData;
    }
    console.log("validating parsed file links against file pages & generating subset for processing...");
    for (const item of Object.values(output.data.items)) {
        item.files = item.files.filter((file) => filePages.has(file));
        item.files.forEach((file) => {
            // set initial state for all files to false
            // this makes it easy to tell when getFileURI() returns null
            output.data.files[file] = false;
        });
        // filter files that dont pass filename reqs, then add the ones that do to processableFiles
        item.files.filter((file) => fileNameReqs.some((req) => file.toLowerCase().includes(req))).forEach((file) => processableFiles.add(file));
    }
    console.log(`processing ${processableFiles.size} file links...`);
    progressBar.start(processableFiles.size, 0);
    let progressIndex = 0;
    for (const file of Array.from(processableFiles)) {
        output.data.files[file] = await getFileURI(file);
        progressBar.update(progressIndex + 1);
        progressIndex++;
    }
    progressBar.stop();
    console.log("writing to file...");
    await output.write();
    console.log("wrote to file");
} else {
    console.error("./cache/fortnite_pages_current.xml not found");
}
