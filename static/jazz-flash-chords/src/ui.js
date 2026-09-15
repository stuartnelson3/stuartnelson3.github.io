import { CHORD_QUALITIES, NOTE_NAMES, toneFunctionLabels, chordSymbol } from './chords.js';

/** @typedef {import('./chords.js').QualityKey} QualityKey */
/** @typedef {import('./chords.js').Instrument} Instrument */
/** @typedef {import('./game-state.js').Settings} Settings */
/** @typedef {import('./game-state.js').GameState} GameState */

/**
 * @template {HTMLElement} [T=HTMLElement]
 * @param {string} id
 * @returns {T}
 */
function requireElement(id) {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing element #${id}`);
  return /** @type {T} */ (found);
}

const el = {
  startScreen: requireElement('start-screen'),
  startButton: requireElement('start-button'),
  micError: requireElement('mic-error'),
  gameScreen: requireElement('game-screen'),
  timer: requireElement('timer'),
  poolRemaining: requireElement('pool-remaining'),
  chordSymbol: requireElement('chord-symbol'),
  toneIndicators: requireElement('tone-indicators'),
  resultBanner: requireElement('result-banner'),
  resultText: requireElement('result-text'),
  resultDetail: requireElement('result-detail'),
  nextButton: requireElement('next-button'),
  settingsToggle: requireElement('settings-toggle'),
  settingsPanel: requireElement('settings-panel'),
  timerSeconds: /** @type {HTMLInputElement} */ (requireElement('timer-seconds')),
  instrument: /** @type {HTMLSelectElement} */ (requireElement('instrument')),
  qualityPool: requireElement('quality-pool'),
  rootPool: requireElement('root-pool'),
  autoAdvance: /** @type {HTMLInputElement} */ (requireElement('auto-advance')),
  autoAdvanceDelay: /** @type {HTMLInputElement} */ (requireElement('auto-advance-delay')),
  includeExtensions: /** @type {HTMLInputElement} */ (requireElement('include-extensions')),
  eliminationMode: /** @type {HTMLInputElement} */ (requireElement('elimination-mode')),
};

// A checkbox group (qualities, roots) must always keep at least one box
// checked, or randomChord() has nothing to pick from. If unchecking a box
// would empty the group, put it back and skip the change.
/**
 * @param {HTMLElement} container
 * @param {HTMLInputElement} checkbox
 * @param {() => void} onChange
 * @returns {() => void}
 */
function guardNonEmptyGroup(container, checkbox, onChange) {
  return () => {
    if (container.querySelectorAll('input:checked').length === 0) {
      checkbox.checked = true;
      return;
    }
    onChange();
  };
}

export function initSettingsToggle() {
  el.settingsToggle.addEventListener('click', () => {
    const isHidden = el.settingsPanel.hidden;
    el.settingsPanel.hidden = !isHidden;
    el.settingsToggle.setAttribute('aria-expanded', String(isHidden));
  });
}

/**
 * @param {Settings} defaults
 * @param {() => void} onChange
 */
export function initSettingsPanel(defaults, onChange) {
  const qualityKeys = /** @type {QualityKey[]} */ (Object.keys(CHORD_QUALITIES));
  for (const key of qualityKeys) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = key;
    checkbox.checked = defaults.qualityPool.includes(key);
    checkbox.addEventListener('change', guardNonEmptyGroup(el.qualityPool, checkbox, onChange));
    label.appendChild(checkbox);
    label.append(CHORD_QUALITIES[key].label);
    el.qualityPool.appendChild(label);
  }

  for (let pc = 0; pc < 12; pc++) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = String(pc);
    checkbox.checked = defaults.rootPool.includes(pc);
    checkbox.addEventListener('change', guardNonEmptyGroup(el.rootPool, checkbox, onChange));
    label.appendChild(checkbox);
    label.append(NOTE_NAMES[pc] ?? '');
    el.rootPool.appendChild(label);
  }

  el.timerSeconds.value = String(defaults.timerSeconds);
  el.instrument.value = defaults.instrument;
  el.autoAdvance.checked = defaults.autoAdvance;
  el.autoAdvanceDelay.value = String(defaults.autoAdvanceDelaySeconds);
  el.includeExtensions.checked = defaults.includeExtensions;
  el.eliminationMode.checked = defaults.eliminationMode;
  el.timerSeconds.addEventListener('change', onChange);
  el.instrument.addEventListener('change', onChange);
  el.autoAdvance.addEventListener('change', onChange);
  el.autoAdvanceDelay.addEventListener('change', onChange);
  el.includeExtensions.addEventListener('change', onChange);
  el.eliminationMode.addEventListener('change', onChange);
}

/** @returns {Settings} */
export function readSettings() {
  const qualityPool = /** @type {QualityKey[]} */ (
    Array.from(el.qualityPool.querySelectorAll('input:checked')).map((c) => /** @type {HTMLInputElement} */ (c).value)
  );
  const rootPool = Array.from(el.rootPool.querySelectorAll('input:checked')).map((c) => Number(/** @type {HTMLInputElement} */ (c).value));
  const timerSeconds = Math.max(2, Number(el.timerSeconds.value) || 8);
  const instrument = /** @type {Instrument} */ (el.instrument.value);
  const autoAdvance = el.autoAdvance.checked;
  // 0 is a valid delay (instant auto-advance), so `|| fallback` would
  // wrongly replace it (Number('0') || 1.5 is 1.5) — and Number('') is 0,
  // not NaN, so a blank field needs its own check too, or it would
  // silently become a valid-looking 0 instead of falling back.
  const rawDelay = el.autoAdvanceDelay.value.trim();
  const parsedDelay = Number(rawDelay);
  const autoAdvanceDelaySeconds =
    rawDelay === '' || Number.isNaN(parsedDelay) ? 1.5 : Math.max(0, parsedDelay);
  const includeExtensions = el.includeExtensions.checked;
  const eliminationMode = el.eliminationMode.checked;
  return {
    qualityPool, rootPool, timerSeconds, instrument,
    autoAdvance, autoAdvanceDelaySeconds, includeExtensions, eliminationMode,
  };
}

/** @param {() => void} handler */
export function onStartClick(handler) {
  el.startButton.addEventListener('click', handler);
}

// Space skips to a new chord at any point in a round, not only
// once a result appears. Whether to act must not depend on DOM
// state, such as el.resultBanner.hidden — an indirect, easy-to-desync
// proxy for whether a round is active. The real answer already lives
// in GameState, and skip() already checks it. This still checks only
// one thing: whether to hijack space at all. It skips space when a
// settings field has focus. That way, a checkbox toggle or a
// number-input edit does not also skip the round.
/** @param {() => void} handler */
export function onAdvance(handler) {
  el.nextButton.addEventListener('click', handler);
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space') return;
    const target = /** @type {Element | null} */ (e.target);
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) return;
    if (!el.gameScreen.hidden) e.preventDefault();
    handler();
  });
}

/** @param {string} message */
export function showMicError(message) {
  el.micError.textContent = message;
  el.micError.hidden = false;
}

export function showGameScreen() {
  el.startScreen.hidden = true;
  el.gameScreen.hidden = false;
}

export function showStartScreen() {
  el.gameScreen.hidden = true;
  el.startScreen.hidden = false;
}

/** @param {boolean} isRunning */
export function setRunning(isRunning) {
  el.startButton.textContent = isRunning ? 'Stop' : 'Start';
  el.startButton.classList.toggle('running', isRunning);
}

/** @param {number} ms */
function formatSeconds(ms) {
  return (Math.max(0, ms) / 1000).toFixed(1);
}

/**
 * @param {GameState} state
 * @param {Instrument} instrument
 */
export function render(state, instrument) {
  const { phase, chord, hitSet, wrongSet, remainingPool, timeRemainingMs, passed } = state;

  if (!chord) return;

  el.chordSymbol.textContent = chordSymbol(chord.root, chord.quality, chord.ninth, instrument);

  if (remainingPool) {
    el.poolRemaining.textContent = `${remainingPool.length} left in the pool`;
    el.poolRemaining.hidden = false;
  } else {
    el.poolRemaining.hidden = true;
  }

  if (phase === 'preroll') {
    el.timer.textContent = 'Get ready…';
    el.timer.classList.remove('urgent');
  } else if (phase === 'listening' || phase === 'result') {
    el.timer.textContent = `${formatSeconds(timeRemainingMs)}s`;
    el.timer.classList.toggle('urgent', timeRemainingMs < 3000);
  }

  el.toneIndicators.innerHTML = '';
  const toneFunctions = toneFunctionLabels(chord.quality, chord.ninth);
  chord.tones.forEach((pc, i) => {
    const indicator = document.createElement('div');
    indicator.className = 'tone-indicator';
    if (hitSet.has(pc)) indicator.classList.add('hit');
    indicator.textContent = toneFunctions[i] ?? '';
    el.toneIndicators.appendChild(indicator);
  });

  if (phase === 'result') {
    el.resultBanner.hidden = false;
    el.resultBanner.classList.toggle('pass', Boolean(passed));
    el.resultBanner.classList.toggle('fail', !passed);
    el.resultText.textContent = passed ? 'Pass!' : 'Missed it';

    if (wrongSet.size > 0) {
      el.resultDetail.textContent = `Fished for it — ${wrongSet.size} wrong note${wrongSet.size === 1 ? '' : 's'} along the way.`;
      el.resultDetail.hidden = false;
    } else {
      el.resultDetail.hidden = true;
    }
  } else {
    el.resultBanner.hidden = true;
    el.resultBanner.classList.remove('pass', 'fail');
  }
}
