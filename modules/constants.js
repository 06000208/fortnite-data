import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Root directory of the project
 * @type {string}
 */
export const directory = join(dirname(fileURLToPath(import.meta.url)), "..");
