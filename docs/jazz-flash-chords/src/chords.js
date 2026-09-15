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
/** @type {Record<QualityKey, { label: string, intervals: number[], ninths: Partial<Record<NinthVariant, string>> }>} */
export const CHORD_QUALITIES = {
  maj7: { label: 'maj7',  intervals: [0, 4, 7, 11], ninths: { '9': 'maj9' } },
  dom7: { label: '7',     intervals: [0, 4, 7, 10], ninths: { b9: '7b9', '9': '9', '#9': '7#9' } },
  min7: { label: 'm7',    intervals: [0, 3, 7, 10], ninths: { '9': 'm9' } },
  m7b5: { label: 'm7b5',  intervals: [0, 3, 6, 10], ninths: { '9': 'm9b5' } },
  sus4: { label: '7sus4', intervals: [0, 5, 7, 10], ninths: { '9': '9sus4', b9: '7sus4b9' } },
};

// Semitones above the root for each 9th variant. None of these collide
// with any quality's base intervals above (checked by hand) — if they did,
// hitSet (a Set of pitch classes) could never reach chord.tones.length,
// since two "different" required tones would share one pitch class.
/** @type {Record<NinthVariant, number>} */
const NINTH_INTERVALS = { b9: 1, '9': 2, '#9': 3 };

// Function labels for each tone position, in the order tones are built
// below (root, 3rd-equivalent, 5th-equivalent, 7th, 9th-equivalent).
export const TONE_FUNCTIONS = ['Root', '3rd', '5th', '7th', '9th'];

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
