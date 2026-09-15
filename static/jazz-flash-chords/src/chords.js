/** @typedef {'maj7'|'dom7'|'min7'|'m7b5'|'sus4'} QualityKey */
/** @typedef {'C'|'Bb'|'Eb'} Instrument */
/** @typedef {'b9'|'9'|'#9'} NinthVariant */
/**
 * @typedef {Object} Chord
 * @property {number} root - pitch class, 0-11
 * @property {QualityKey} quality
 * @property {NinthVariant | null} ninth - which 9th got added, or null for a plain 1/3/5/7 chord
 * @property {number[]} tones - pitch classes, one per chord tone
 */

export const NOTE_NAMES = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
];

// Every chord always carries a 9th as its 5th tone. `ninths` lists the
// variants that are actually idiomatic over that quality (dom7 and sus4
// take altered 9ths; maj7/min7/m7b5 only ever take the natural 9th), each
// mapped to the resulting jazz chord symbol. Jazz notation isn't a regular
// grammar here — a dominant chord with a natural 9th is called "9", not
// "7,9" — so the symbol is looked up per variant rather than assembled.
// `label` is the plain, ninth-free quality name shown in the settings
// panel, where there's no specific chord (and so no specific ninth) yet.
// `toneFunctions` names the scale degree at each of the 4 base intervals
// above, in order — every quality has a genuine 3rd there except sus4,
// which replaces it with a 4th, so this can't be one shared array (that
// was the bug: a fixed ['Root','3rd','5th','7th'] mislabeled sus4's 4th
// as a 3rd).
/** @type {Record<QualityKey, { label: string, intervals: number[], toneFunctions: string[], ninths: Partial<Record<NinthVariant, string>> }>} */
export const CHORD_QUALITIES = {
  maj7: { label: 'maj7',  intervals: [0, 4, 7, 11], toneFunctions: ['Root', '3rd', '5th', '7th'], ninths: { '9': 'maj9' } },
  dom7: { label: '7',     intervals: [0, 4, 7, 10], toneFunctions: ['Root', '3rd', '5th', '7th'], ninths: { b9: '7b9', '9': '9', '#9': '7#9' } },
  min7: { label: 'm7',    intervals: [0, 3, 7, 10], toneFunctions: ['Root', '3rd', '5th', '7th'], ninths: { '9': 'm9' } },
  m7b5: { label: 'm7b5',  intervals: [0, 3, 6, 10], toneFunctions: ['Root', '3rd', '5th', '7th'], ninths: { '9': 'm9b5' } },
  sus4: { label: '7sus4', intervals: [0, 5, 7, 10], toneFunctions: ['Root', '4th', '5th', '7th'], ninths: { '9': '9sus4', b9: '7sus4b9' } },
};

// Semitones above the root for each 9th variant. None of these collide
// with any quality's base intervals above (checked by hand) — if they did,
// hitSet (a Set of pitch classes) could never reach chord.tones.length,
// since two "different" required tones would share one pitch class.
/** @type {Record<NinthVariant, number>} */
const NINTH_INTERVALS = { b9: 1, '9': 2, '#9': 3 };

/**
 * Labels for every tone in a chord, in the order generateChord() builds
 * them: the quality's 4 base degrees, then the ninth variant if present.
 * The ninth's own label (b9/9/#9) is shown as-is rather than a generic
 * "9th" — the chord symbol already spells out the alteration (e.g.
 * "C7b9"), so naming it here doesn't give away anything the symbol
 * hasn't already.
 * @param {QualityKey} qualityKey
 * @param {NinthVariant | null} ninth
 * @returns {string[]}
 */
export function toneFunctionLabels(qualityKey, ninth) {
  const base = CHORD_QUALITIES[qualityKey].toneFunctions;
  return ninth === null ? base : [...base, ninth];
}

// Concert-pitch → written-pitch offset, in semitones, for each transposition
// key. written_pc = (concert_pc + offset) mod 12
/** @type {Record<Instrument, number>} */
export const TRANSPOSITION_OFFSET = {
  C: 0,
  Eb: 9,  // written C sounds concert Eb
  Bb: 2,  // written C sounds concert Bb
};

/**
 * @param {number} rootPc
 * @param {QualityKey} qualityKey
 * @param {boolean} [includeExtensions] - false gives a plain 1/3/5/7 chord
 * @returns {Chord}
 */
export function generateChord(rootPc, qualityKey, includeExtensions = true) {
  const quality = CHORD_QUALITIES[qualityKey];
  if (!includeExtensions) {
    const tones = quality.intervals.map(i => (rootPc + i) % 12);
    return { root: rootPc, quality: qualityKey, ninth: null, tones };
  }
  const ninthVariants = /** @type {NinthVariant[]} */ (Object.keys(quality.ninths));
  const ninth = ninthVariants[Math.floor(Math.random() * ninthVariants.length)];
  const tones = [...quality.intervals, NINTH_INTERVALS[ninth]].map(i => (rootPc + i) % 12);
  return { root: rootPc, quality: qualityKey, ninth, tones };
}

/**
 * @param {number[]} rootPool
 * @param {QualityKey[]} qualityPool
 * @param {boolean} [includeExtensions]
 * @returns {Chord}
 */
export function randomChord(rootPool, qualityPool, includeExtensions = true) {
  const root = rootPool[Math.floor(Math.random() * rootPool.length)];
  const quality = qualityPool[Math.floor(Math.random() * qualityPool.length)];
  return generateChord(root, quality, includeExtensions);
}

/**
 * @param {number} rootPc
 * @param {QualityKey} qualityKey
 * @param {NinthVariant | null} ninth
 * @param {Instrument} [instrument]
 * @returns {string}
 */
export function chordSymbol(rootPc, qualityKey, ninth, instrument = 'C') {
  const writtenPc = (rootPc + TRANSPOSITION_OFFSET[instrument]) % 12;
  const symbol = ninth === null ? CHORD_QUALITIES[qualityKey].label : CHORD_QUALITIES[qualityKey].ninths[ninth];
  return `${NOTE_NAMES[writtenPc]}${symbol}`;
}
