/** @typedef {'maj7'|'dom7'|'min7'|'m7b5'|'sus4'} QualityKey */
/** @typedef {'C'|'Bb'|'Eb'} Instrument */
/** @typedef {'b9'|'9'|'#9'} NinthVariant */
/**
 * @typedef {Object} Chord
 * @property {number} root - pitch class, 0-11
 * @property {QualityKey} quality
 * @property {NinthVariant | null} ninth - which 9th got added, or null for a plain 1/3/5/7 chord
 * @property {number[]} tones - pitch classes, one per chord tone
 * @property {boolean} preferEnharmonic - which spelling to use when the written root is ambiguous
 */

export const NOTE_NAMES = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
];

// The enharmonic spelling for each pitch class NOTE_NAMES only spells
// one way. Which name a chord actually shows is decided per chord (see
// generateChord's preferEnharmonic) rather than showing both at once, so
// a player has to read and play each spelling on its own, not just
// recognize the combined pair. Settings panel labels (the root
// checkboxes) still show both names — those are picking a pitch class,
// not reading a specific chord off a page.
/** @type {Partial<Record<number, string>>} */
const ENHARMONICS = {
  1: 'C#',
  3: 'D#',
  6: 'Gb',
  8: 'G#',
  10: 'A#',
};

// Every chord always carries a 9th as its 5th tone. `ninths` lists the
// variants that are actually idiomatic over that quality (dom7 and sus4
// take altered 9ths; maj7/min7/m7b5 only ever take the natural 9th), each
// mapped to the resulting jazz chord symbol. Jazz notation is not a
// regular grammar here — a dominant chord with a natural 9th is called
// "9", not "7,9" — so the symbol is looked up per variant rather than
// assembled. `label` is the plain, ninth-free quality name shown in the
// settings panel, where there is no specific chord (and so no specific
// ninth) yet.
// The `toneFunctions` array names the scale degree at each of the 4 base
// intervals, in order. It shows the accidental (b3, b5, b7) only where
// that quality actually flats the degree. Otherwise it stays plain (3rd,
// 5th, 7th), the same pattern the ninth already uses for b9, 9, or #9
// instead of a generic "9th". This does not reveal more than the chord
// symbol already does — "Gm9b5" already spells out the b5. sus4 replaces
// the 3rd with a real 4th, a different degree, so one shared array
// cannot cover every quality.
// Symbols follow common lead-sheet notation: Δ7 for major 7 (not
// "maj7"), -7 for minor 7 (not "m7"), and ø7 for half-diminished (not
// "m7b5") — ø already implies the b5, so it is never spelled out
// separately.
/** @type {Record<QualityKey, { label: string, intervals: number[], toneFunctions: string[], ninths: Partial<Record<NinthVariant, string>> }>} */
export const CHORD_QUALITIES = {
  maj7: { label: 'Δ7',    intervals: [0, 4, 7, 11], toneFunctions: ['Root', '3rd', '5th', '7th'], ninths: { '9': 'Δ9' } },
  dom7: { label: '7',     intervals: [0, 4, 7, 10], toneFunctions: ['Root', '3rd', '5th', 'b7'],  ninths: { b9: '7b9', '9': '9', '#9': '7#9' } },
  min7: { label: '-7',    intervals: [0, 3, 7, 10], toneFunctions: ['Root', 'b3', '5th', 'b7'],   ninths: { '9': '-9' } },
  m7b5: { label: 'ø7',    intervals: [0, 3, 6, 10], toneFunctions: ['Root', 'b3', 'b5', 'b7'],    ninths: { '9': 'ø9' } },
  sus4: { label: '7sus4', intervals: [0, 5, 7, 10], toneFunctions: ['Root', '4th', '5th', 'b7'],  ninths: { '9': '9sus4', b9: '7sus4b9' } },
};

// Semitones above the root for each 9th variant. None of these collide
// with any quality's base intervals above (checked by hand) — if they did,
// hitSet (a Set of pitch classes) could never reach chord.tones.length,
// since two "different" required tones would share one pitch class.
/** @type {Record<NinthVariant, number>} */
const NINTH_INTERVALS = { b9: 1, '9': 2, '#9': 3 };

/**
 * Labels for every tone, in the order generateChord() builds them: the
 * quality's 4 base degrees, then the ninth variant if present. The
 * ninth's own label (b9, 9, #9) shows as-is, not a generic "9th". The
 * chord symbol already spells out the alteration, for example "C7b9".
 * So naming it here does not reveal anything new.
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
  const preferEnharmonic = Math.random() < 0.5;
  if (!includeExtensions) {
    const tones = quality.intervals.map(i => (rootPc + i) % 12);
    return { root: rootPc, quality: qualityKey, ninth: null, tones, preferEnharmonic };
  }
  const ninthVariants = /** @type {NinthVariant[]} */ (Object.keys(quality.ninths));
  const ninth = ninthVariants[Math.floor(Math.random() * ninthVariants.length)];
  const tones = [...quality.intervals, NINTH_INTERVALS[ninth]].map(i => (rootPc + i) % 12);
  return { root: rootPc, quality: qualityKey, ninth, tones, preferEnharmonic };
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
 * @param {boolean} [preferEnharmonic]
 * @returns {string}
 */
export function chordSymbol(rootPc, qualityKey, ninth, instrument = 'C', preferEnharmonic = false) {
  const writtenPc = (rootPc + TRANSPOSITION_OFFSET[instrument]) % 12;
  const symbol = ninth === null ? CHORD_QUALITIES[qualityKey].label : CHORD_QUALITIES[qualityKey].ninths[ninth];
  const enharmonic = ENHARMONICS[writtenPc];
  const rootName = preferEnharmonic && enharmonic ? enharmonic : NOTE_NAMES[writtenPc];
  return `${rootName}${symbol}`;
}

/**
 * The settings panel's root checkboxes pick a pitch class, not a
 * specific chord, so unlike chordSymbol they show both spellings at
 * once where one exists.
 * @param {number} pc
 * @returns {string}
 */
export function rootLabel(pc) {
  const enharmonic = ENHARMONICS[pc];
  return enharmonic ? `${NOTE_NAMES[pc]}/${enharmonic}` : NOTE_NAMES[pc];
}
