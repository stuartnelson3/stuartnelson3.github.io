import { randomChord } from './chords.js';
import { yinPitchDetect, frequencyToPitchClass, rms } from './pitch-detect.js';

/** @typedef {import('./chords.js').QualityKey} QualityKey */
/** @typedef {import('./chords.js').Instrument} Instrument */
/** @typedef {import('./chords.js').Chord} Chord */

/**
 * @typedef {Object} Settings
 * @property {number} timerSeconds
 * @property {Instrument} instrument
 * @property {boolean} autoAdvance
 * @property {QualityKey[]} qualityPool
 * @property {number[]} rootPool
 */

/** @typedef {'idle'|'preroll'|'listening'|'result'} Phase */

/**
 * @typedef {Object} AudioFrame
 * @property {Float32Array} buffer
 * @property {number} sampleRate
 */

const PREROLL_MS = 1000;
const MIN_CONSECUTIVE = 3;
const RMS_THRESHOLD = 0.01; // gate out silence/noise before running YIN
const AUTO_ADVANCE_MS = 1500; // pause on the result screen before auto-advancing

// Phases: 'idle' -> 'preroll' -> 'listening' -> 'result' -> (next) -> 'preroll' ...
export class GameState {
  /** @param {Settings} settings */
  constructor(settings) {
    this.settings = settings;
    /** @type {Phase} */
    this.phase = 'idle';
    /** @type {Chord | null} */
    this.chord = null;
    /** @type {Set<number>} */
    this.hitSet = new Set();
    /** @type {Set<number>} */
    this.wrongSet = new Set();
    /** @type {{ lastPc: number | null, count: number }} */
    this.consecutiveMatches = { lastPc: null, count: 0 };
    this.prerollRemainingMs = 0;
    this.timeRemainingMs = 0;
    this.resultElapsedMs = 0;
    /** @type {boolean | null} */
    this.passed = null;
    /** @type {Set<(state: GameState) => void>} */
    this.listeners = new Set();
  }

  /**
   * @param {(state: GameState) => void} fn
   * @returns {() => void} unsubscribe
   */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  _emit() {
    for (const fn of this.listeners) fn(this);
  }

  /** @param {Settings} settings */
  updateSettings(settings) {
    this.settings = settings;
  }

  startRound() {
    const { rootPool, qualityPool, timerSeconds } = this.settings;
    this.chord = randomChord(rootPool, qualityPool);
    this.hitSet = new Set();
    this.wrongSet = new Set();
    this.consecutiveMatches = { lastPc: null, count: 0 };
    this.prerollRemainingMs = PREROLL_MS;
    this.timeRemainingMs = timerSeconds * 1000;
    this.resultElapsedMs = 0;
    this.passed = null;
    this.phase = 'preroll';
    this._emit();
  }

  next() {
    if (this.phase !== 'result') return;
    this.startRound();
  }

  /**
   * Called once per animation frame with elapsed ms since the last frame,
   * and (during 'listening') the current mic buffer + sample rate.
   * @param {number} deltaMs
   * @param {AudioFrame | null} [audio]
   */
  tick(deltaMs, audio) {
    if (this.phase === 'preroll') {
      this.prerollRemainingMs -= deltaMs;
      if (this.prerollRemainingMs <= 0) {
        this.prerollRemainingMs = 0;
        this.phase = 'listening';
      }
      this._emit();
      return;
    }

    if (this.phase === 'listening') {
      const chord = this.chord;
      if (!chord) return;

      this.timeRemainingMs -= deltaMs;

      if (audio) {
        this._processAudioFrame(chord, audio.buffer, audio.sampleRate);
      }

      if (this.hitSet.size === chord.tones.length) {
        this._finishRound(true);
      } else if (this.timeRemainingMs <= 0) {
        this.timeRemainingMs = 0;
        this._finishRound(false);
      } else {
        this._emit();
      }
      return;
    }

    if (this.phase === 'result' && this.settings.autoAdvance) {
      this.resultElapsedMs += deltaMs;
      if (this.resultElapsedMs >= AUTO_ADVANCE_MS) {
        this.startRound();
      }
    }
  }

  /** @param {boolean} passed */
  _finishRound(passed) {
    this.passed = passed;
    this.phase = 'result';
    this.resultElapsedMs = 0;
    this._emit();
  }

  /**
   * @param {Chord} chord
   * @param {Float32Array} buffer
   * @param {number} sampleRate
   */
  _processAudioFrame(chord, buffer, sampleRate) {
    if (rms(buffer) < RMS_THRESHOLD) {
      this.consecutiveMatches.count = 0;
      return;
    }
    const frequency = yinPitchDetect(buffer, sampleRate);
    if (frequency === null) {
      this.consecutiveMatches.count = 0;
      return;
    }
    this._checkPitch(chord, frequency);
  }

  // A pitch class only counts — as a hit or as a confirmed wrong note —
  // once it's sustained for MIN_CONSECUTIVE frames in a row. That debounce
  // applies equally to both, so a stray transient can misfire as a wrong
  // note no more easily than it could misfire as a hit.
  /**
   * @param {Chord} chord
   * @param {number} detectedFrequency
   */
  _checkPitch(chord, detectedFrequency) {
    const pc = frequencyToPitchClass(detectedFrequency);
    if (this.consecutiveMatches.lastPc === pc) {
      this.consecutiveMatches.count++;
    } else {
      this.consecutiveMatches.lastPc = pc;
      this.consecutiveMatches.count = 1;
    }
    if (this.consecutiveMatches.count < MIN_CONSECUTIVE) return;

    if (chord.tones.includes(pc)) {
      this.hitSet.add(pc);
    } else {
      this.wrongSet.add(pc);
    }
  }
}
