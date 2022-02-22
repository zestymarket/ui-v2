export enum SpaceFormats {
  Tall = `Tall`,
  Wide = `Wide`,
  Square = `Square`,
  Twitch = `Twitch`,
}

/**
 * [Map formats to their resolutions]
 */

export const SpaceFormatResolutions = {
  Tall: `Tall (768x1024)`,
  Wide: `Wide (1024x256)`,
  Square: `Square (1024x1024)`,
  Twitch: `Twitch (550x200)`,
};

/**
 * [Object mapping deprecated formats to current ones.]
 */

const oldFormatsObject: { [key: string]: SpaceFormats } = {
  WebXR: SpaceFormats.Tall,
  'WebXR Standard': SpaceFormats.Tall,
  'WebXR Wide': SpaceFormats.Wide,
  Web: SpaceFormats.Square,
};

/**
 * [List containing currently used formats]
 */

const allowedFormatsString = [`Tall`, `Wide`, `Square`, `Twitch`];

export const FormatCategories: { [key: string]: SpaceFormats[] } = {
  'Web/WebXR Formats': [
    SpaceFormats.Tall,
    SpaceFormats.Wide,
    SpaceFormats.Square,
  ],
  'Twitch Formats': [SpaceFormats.Twitch],
};

/**
 * [Returns the category for the supplied format as a string.]
 * @param  format [Format for which the category is being sought out for]
 * @return        [Category of the supplied format, or empty if the format is invalid]
 */

export function getCategoryFromFormat(format: string): string {
  const categories = Object.keys(FormatCategories);
  for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < FormatCategories[categories[i]].length; j++) {
      const currentFormat = FormatCategories[categories[i]][j];
      if (currentFormat === format) return categories[i].split(` `)[0];
    }
  }
  return ``;
}

/**
 * Checks if a format is being currently used.
 * @param  format [Format in string form to check for validity.]
 * @return        [Returns the format if it is used, defaults to the first format if not.]
 */

export function parseQueryFormat(format?: string) {
  return format && allowedFormatsString.includes(format)
    ? format
    : allowedFormatsString[0];
}

/**
 * [Returns the first format]
 * @return [First format]
 */

export function getDefaultFormat(): string {
  return allowedFormatsString[0];
}

/**
 * Converts deprecated formats (which are stored on chain) into the currently corresponding
 * equivalent. Requires an up-to-date entry in `oldFormatsObject`.
 * @param  format [Space format]
 * @return        [Currently used version of the format]
 */
export function convertOldFormats(format: string): string {
  return oldFormatsObject[format] || format;
}
