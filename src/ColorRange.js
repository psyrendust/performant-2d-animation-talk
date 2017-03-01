/**
 * Create hex color gradients.
 *
 * http://krazydad.com/tutorials/makecolors.php
 */
const NYB_HEX_STRING = '0123456789ABCDEF';
const RAINBOW_HEX_NUMBER = makeColorGradientHexNumber(.3, .3, .3, 0, 2, 4);
const RAINBOW_HEX_NUMBER_PASTEL = makeColorGradientHexNumber(.3, .3, .3, 0, 2, 4, 230, 25);
const RAINBOW_HEX_NUMBER_PASTEL_MEDIUM = makeColorGradientHexNumber(.3, .3, .3, 0, 2, 4, 230, 40);
const RAINBOW_HEX_NUMBER_PASTEL_DARK = makeColorGradientHexNumber(.3, .3, .3, 0, 2, 4, 230, 55);
const RAINBOW_HEX_STRING = makeColorGradientHexString(.3, .3, .3, 0, 2, 4);
const RAINBOW_HEX_STRING_PASTEL = makeColorGradientHexString(.3, .3, .3, 0, 2, 4, 230, 25);
const RAINBOW_HEX_STRING_PASTEL_MEDIUM = makeColorGradientHexString(.3, .3, .3, 0, 2, 4, 230, 40);
const RAINBOW_HEX_STRING_PASTEL_DARK = makeColorGradientHexString(.3, .3, .3, 0, 2, 4, 230, 55);
const RAINBOW_RGB = makeColorGradientRgb(.3, .3, .3, 0, 2, 4);
const RAINBOW_RGB_PASTEL = makeColorGradientRgb(.3, .3, .3, 0, 2, 4, 230, 25);
const RAINBOW_RGB_PASTEL_MEDIUM = makeColorGradientRgb(.3, .3, .3, 0, 2, 4, 230, 40);
const RAINBOW_RGB_PASTEL_DARK = makeColorGradientRgb(.3, .3, .3, 0, 2, 4, 230, 55);

function byte2Hex(n) {
  return String(NYB_HEX_STRING.substr((n >> 4) & 0x0F,1)) + NYB_HEX_STRING.substr(n & 0x0F,1);
}

function rgb2HexNumber(r, g, b) {
  return parseInt(`${byte2Hex(r)}${byte2Hex(g)}${byte2Hex(b)}`, 16);
}

function rgb2HexString(r, g, b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function makeColorGradientHexNumber(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len) {
  let colors = [];
  let i;

  if (center === undefined) center = 128;
  if (width === undefined) width = 127;
  if (len === undefined) len = 50;

  for (i = 0; i < len; ++i) {
    colors.push(rgb2HexNumber(
      Math.floor(Math.sin(frequency1 * i + phase1) * width + center),
      Math.floor(Math.sin(frequency2 * i + phase2) * width + center),
      Math.floor(Math.sin(frequency3 * i + phase3) * width + center)
    ));
  }

  return colors;
}

function makeColorGradientHexString(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len) {
  let colors = [];
  let i;

  if (center === undefined) center = 128;
  if (width === undefined) width = 127;
  if (len === undefined) len = 50;

  for (i = 0; i < len; ++i) {
    colors.push(rgb2HexString(
      Math.floor(Math.sin(frequency1 * i + phase1) * width + center),
      Math.floor(Math.sin(frequency2 * i + phase2) * width + center),
      Math.floor(Math.sin(frequency3 * i + phase3) * width + center)
    ));
  }

  return colors;
}

function makeColorGradientRgb(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len) {
  let colors = [];
  let i;

  if (center === undefined) center = 128;
  if (width === undefined) width = 127;
  if (len === undefined) len = 50;

  for (i = 0; i < len; ++i) {
    colors.push([
      Math.floor(Math.sin(frequency1 * i + phase1) * width + center / 255),
      Math.floor(Math.sin(frequency2 * i + phase2) * width + center / 255),
      Math.floor(Math.sin(frequency3 * i + phase3) * width + center / 255)
    ]);
  }

  return colors;
}

export default class ColorRange {
  static makeColorGradientHexString() {
    return makeColorGradientHexString(...arguments);
  }

  static makeColorGradientRgb() {
    return makeColorGradientRgb(...arguments);
  }

  static getRandomHex(type = '') {
    let typeToLower = type.toLowerCase();
    let gradientArray;
    if (typeToLower === 'pastel') {
      gradientArray = RAINBOW_HEX_STRING_PASTEL;
    } else if (typeToLower === 'medium') {
      gradientArray = RAINBOW_HEX_STRING_PASTEL_MEDIUM;
    } else if (typeToLower === 'dark') {
      gradientArray = RAINBOW_HEX_STRING_PASTEL_DARK;
    } else {
      gradientArray = RAINBOW_HEX_STRING;
    }
    return gradientArray[Math.floor(Math.random() * gradientArray.length)];
  }

  static getRandomRgb(type = '') {
    let typeToLower = type.toLowerCase();
    let gradientArray;
    if (typeToLower === 'pastel') {
      gradientArray = RAINBOW_RGB_PASTEL;
    } else if (typeToLower === 'medium') {
      gradientArray = RAINBOW_RGB_PASTEL_MEDIUM;
    } else if (typeToLower === 'dark') {
      gradientArray = RAINBOW_RGB_PASTEL_DARK;
    } else {
      gradientArray = RAINBOW_RGB;
    }
    return gradientArray[Math.floor(Math.random() * gradientArray.length)];
  }

  static get RAINBOW_HEX_NUMBER() {
    return RAINBOW_HEX_NUMBER;
  }

  static get RAINBOW_HEX_NUMBER_PASTEL() {
    return RAINBOW_HEX_NUMBER_PASTEL;
  }

  static get RAINBOW_HEX_NUMBER_PASTEL_MEDIUM() {
    return RAINBOW_HEX_NUMBER_PASTEL_MEDIUM;
  }

  static get RAINBOW_HEX_NUMBER_PASTEL_DARK() {
    return RAINBOW_HEX_NUMBER_PASTEL_DARK;
  }

  static get RAINBOW_HEX_STRING() {
    return RAINBOW_HEX_STRING;
  }

  static get RAINBOW_HEX_STRING_PASTEL() {
    return RAINBOW_HEX_STRING_PASTEL;
  }

  static get RAINBOW_HEX_STRING_PASTEL_MEDIUM() {
    return RAINBOW_HEX_STRING_PASTEL_MEDIUM;
  }

  static get RAINBOW_HEX_STRING_PASTEL_DARK() {
    return RAINBOW_HEX_STRING_PASTEL_DARK;
  }

  static get RAINBOW_RGB() {
    return RAINBOW_RGB;
  }

  static get RAINBOW_RGB_PASTEL() {
    return RAINBOW_RGB_PASTEL;
  }

  static get RAINBOW_RGB_PASTEL_MEDIUM() {
    return RAINBOW_RGB_PASTEL_MEDIUM;
  }

  static get RAINBOW_RGB_PASTEL_DARK() {
    return RAINBOW_RGB_PASTEL_DARK;
  }
}
