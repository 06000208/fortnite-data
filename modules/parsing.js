import { pageURI, typeForbiddenCategories, typeIndex } from "./constants.js";
import { encodeWikiURI } from "./request.js";

/**
 * Regular expression used for parsing categories from text, e.g. [[Category:Example]]
 * @type {RegExp}
 */
const categoryRegex = /\[\[\s*[Cc]ategory\s*:\s*([^\s].*?)\s*\]\]/g;

/**
 * Regular expression used for parsing types from infoboxes, e.g. |type=Example
 */
const infoboxTypeRegex = /\|\s*type\s*=\s*{?{?\[?\[?([^\s|{}[\]][^\n|{}[\]]+)\s*\|?/g;

/**
 * Regular expression used for parsing images from text. Not implemented as it didn't seem to be needed.
 */
// const imageRegex = / /g;

/**
 * Regular expression used for parsing images from infoboxes, e.g. |image = Example.png
 */
const infoboxImageRegex = /\|\s*image\s*=\s*{?{?\[?\[?([^\s<>|{}[\]][^\n<>|{}[\]]*)\s*\|?/g;

/**
 * Regular expression used for parsing images from infoboxes, e.g. |image = Example.png
 */
const styleTemplateImageRegex = /{{\s*Style\s*Background\s*\|\s*([^|}\s][^|}\n]*)\s*}}/g;

/**
 * Regular expression used for parsing images from infoboxes, e.g. <gallery>Example.jpg|Text</gallery>
 *
 * Matches must be processed further afterwards to be useful
 */
const galleryImageRegex = /<gallery>\s*([\S\s]+?)\s*<\/gallery>/g;

/**
 * Comprehensive newline splitting regex
 */
const newlines = /[\r\n]+/;

/**
 * Used to refine matches from the galleryImageRegex regular expression
 */
const parseGalleryMatches = (match) => match.split(newlines).filter((pair) => pair.includes(".")).map((pair) =>
    pair.includes("|") ? pair.substring(0, pair.indexOf("|")).trim() : pair.trim(),
);

/**
 * Parses a page object, reducing it to specific useful information
 */
export const parsePage = function(page) {
    const data = {
        id: page.id,
        title: page.title,
        uri: pageURI + encodeWikiURI(page.title),
        lastUpdated: page.revision.timestamp,
        type: null,
        categories: page.revision.text ? [
            ...Array.from(page.revision.text.matchAll(categoryRegex)).map(match => match[1]),
            ...Array.from(page.revision.text.matchAll(infoboxTypeRegex)).map(match => match[1]),
        ].filter((category, index, categories) => categories.indexOf(category) === index) : [],
        files: [],
    };
    if (!typeForbiddenCategories.some((category) => data.categories.includes(category))) {
        const typedCategory = data.categories.find((category) => typeIndex.has(category));
        if (typedCategory) data.type = typeIndex.get(typedCategory);
    }
    // if the data's type isn't recognized, skip processing files and indicate that
    if (!data.type) {
        data.files = null;
        return data;
    }
    if (page.revision.text) {
        data.files.push(
            ...Array.from(page.revision.text.matchAll(infoboxImageRegex)).map(match => match[1]),
            ...Array.from(page.revision.text.matchAll(styleTemplateImageRegex)).map(match => match[1]),
            ...Array.from(page.revision.text.matchAll(galleryImageRegex)).map(match => match[1]).flatMap(parseGalleryMatches),
        );
        data.files = data.files.map(
            (title) => title.startsWith("File:") ? title : "File:" + title,
        ).filter((title, index, arr) => arr.indexOf(title) === index);
    }
    return data;
};
