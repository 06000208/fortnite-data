import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Root directory of the project
 * @type {string}
 */
export const directory = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Template for data processing
 */
export const template = {
    "timestamp": null,
    "license": "Attribution-ShareAlike 3.0 Unported",
    "comment": "This data is a processed version of data obtained from the fortnite.fandom.com wiki, and as such, is licensed under CC BY-SA 3.0",
    "types": {
        "outfit": {
            "title": "Outfit",
            "plural": "Outfits",
            "slot": "outfit",
        },
        "back_bling": {
            "title": "Back Bling",
            "plural": "Back Blings",
            "slot": "back_bling",
        },
        "pickaxe": {
            "title": "Pickaxe",
            "plural": "Pickaxes",
            "slot": "pickaxe",
        },
        "glider": {
            "title": "Glider",
            "plural": "Gliders",
            "slot": "glider",
        },
        "contrail": {
            "title": "Contrail",
            "plural": "Contrails",
            "slot": "contrail",
        },
        "pet": {
            "title": "Pet",
            "plural": "Pets",
            "slot": "back_bling",
        },
        "emote": {
            "title": "Emote",
            "plural": "Emotes",
            "slot": "emote",
        },
        "emoticon": {
            "title": "Emoticon",
            "plural": "Emoticons",
            "slot": "emote",
        },
        "spray": {
            "title": "Spray",
            "plural": "Sprays",
            "slot": "emote",
        },
        "toy": {
            "title": "Toy",
            "plural": "Toys",
            "slot": "emote",
        },
        "wrap": {
            "title": "Wrap",
            "plural": "Wraps",
            "slot": "wrap",
        },
        "banner_icon": {
            "title": "Banner Icon",
            "plural": "Banner Icons",
            "slot": "banner_icon",
        },
        "music": {
            "title": "Music",
            "plural": "Music",
            "slot": "music",
        },
        "loading_screen": {
            "title": "Loading Screen",
            "plural": "Loading Screens",
            "slot": "loading_screen",
        },
    },
    "items": {},
    "unknown_items": {},
    "files": {},
};

/**
 * Strings associated with each type
 * @type {Object.<string, string[]>}
 */
export const typeStrings = {
    "outfit": ["Outfit", "Outfits"],
    "back_bling": ["Back Bling", "Back Blings"],
    "pickaxe": ["Harvesting Tool", "Harvesting Tools", "Pickaxe", "Pickaxes", "Dual-Wield Harvesting Tool", "Dual-Wield Harvesting Tools", "Single-Wield Harvesting Tool", "Single-Wield Harvesting Tools"],
    "glider": ["Glider", "Gliders", "Rideable Glider", "Rideable Gliders", "Umbrella", "Umbrellas"],
    "contrail": ["Contrail", "Contrails"],
    "pet": ["Pet", "Pets"],
    "emote": ["Emote", "Emotes"],
    "emoticon": ["Emoticon", "Emoticons"],
    "spray": ["Spray", "Sprays"],
    "toy": ["Toy", "Toys"],
    "wrap": ["Wrap", "Wraps"],
    "banner_icon": ["Banner", "Banners"],
    "music": ["Music"],
    "loading_screen": ["Loading Screen", "Loading Screens"],
};

/**
 * Strings mapped to their corresponding type id, the inverse of the typeStrings object, used for performance reasons
 * @type {Map<string, string>}
 */
export const typeIndex = new Map(Object.entries(typeStrings).flatMap(([key, strings]) => strings.map(string => [string, key])));

/**
 * Case-insensitive strings which must be present in a file name to consider it worth processing
 */
export const fileNameReqs = [
    "Concept Art",
    ...Array.from(typeIndex.keys()),
].map((req) => req.toLowerCase());

/**
 * List of namespace prefixes to skip during processing
 * @type {string[]}
 */
export const ignoredNamespaces = [
    "Talk:",
    "User:",
    "User talk:",
    "Fortnite Wiki:",
    "Fortnite Wiki talk:",
    "File talk:",
    "MediaWiki:",
    "MediaWiki talk:",
    "Template:",
    "Template talk:",
    "Help:",
    "Help talk:",
    "Category:",
    "Category talk:",
    "Portal:",
    "Portal talk:",
    "Draft:",
    "Draft talk:",
    "TimedText:",
    "TimedText talk:",
    "Module:",
    "Module talk:",
    "Map:",
    "Map talk:",
    "Board:",
    "Thread:",
    "Message Wall:",
    "Message Wall Greeting:",
    "Blog:",
    "Blog talk:",
    "Forum:",
    "Forum talk:",
    "GeoJson:",
    "GeoJson talk:",
    "User blog:",
    "User blog comment:",
];

/**
 * Items with these categories are forbidden from having a type, as they possess one or more other categories that would result in inaccurate classification
*/
export const typeForbiddenCategories = [
    "Cosmetics",
];

/**
 * Prefix for wiki pages
 */
export const pageURI = "https://fortnite.fandom.com/wiki/";

/**
 * Prefix for redirect requests
 */
export const redirectURI = "https://fortnite.fandom.com/wiki/Special:Redirect/file/";
