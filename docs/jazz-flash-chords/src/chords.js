/** @typedef {'maj7'|'dom7'|'min7'|'m7b5'|'sus4'} QualityKey */
/** @typedef {'concert'|'alto'|'tenor'} Instrument */
/**
 * @typedef {Object} Chord
 * @property {number} root - pitch class, 0-11
 * @property {QualityKey} quality
 * @property {number[]} tones - pitch classes, one per chord tone
 */

export const NOTE_NAMES = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
];

/** @type {Record<QualityKey, {symbol: string, intervals: number[]}>} */
export const CHORD_QUALITIES = {
  maj7:  { symbol: 'maj7',  intervals: [0, 4, 7, 11] },
  dom7:  { symbol: '7',     intervals: [0, 4, 7, 10] },
  min7:  { symbol: 'm7',    intervals: [0, 3, 7, 10] },
  m7b5:  { symbol: 'm7b5',  intervals: [0, 3, 6, 10] },
  sus4:  { symbol: '7sus4', intervals: [0, 5, 7, 10] },
};

// Function labels for each interval position, in the order intervals are
// listed above (root, 3rd-equivalent, 5th-equivalent, 7th).
export const TONE_FUNCTIONS = ['Root', '3rd', '5th', '7th'];

// Concert-pitch → written-pitch offset, in semitones, for each instrument.
// written_pc = (concert_pc + offset) mod 12
/** @type {Record<Instrument, number>} */
export const TRANSPOSITION_OFFSET = {
  concert: 0,
  alto: 9,   // Eb instrument: written C sounds concert Eb
  tenor: 2,  // Bb instrument: written C sounds concert Bb
};

/**
 * @param {number} rootPc
 * @param {QualityKey} qualityKey
 * @returns {Chord}
 */
export function generateChord(rootPc, qualityKey) {
  const quality = CHORD_QUALITIES[qualityKey];
  const tones = quality.intervals.map(i => (rootPc + i) % 12);
  return { root: rootPc, quality: qualityKey, tones };
}

/**
 * @param {number[]} rootPool
 * @param {QualityKey[]} qualityPool
 * @returns {Chord}
 */
export function randomChord(rootPool, qualityPool) {
  const root = rootPool[Math.floor(Math.random() * rootPool.length)];
  const quality = qualityPool[Math.floor(Math.random() * qualityPool.length)];
  return generateChord(root, quality);
}

/**
 * @param {number} rootPc
 * @param {QualityKey} qualityKey
 * @param {Instrument} [instrument]
 * @returns {string}
 */
export function chordSymbol(rootPc, qualityKey, instrument = 'concert') {
  const writtenPc = (rootPc + TRANSPOSITION_OFFSET[instrument]) % 12;
  return `${NOTE_NAMES[writtenPc]}${CHORD_QUALITIES[qualityKey].symbol}`;
}
