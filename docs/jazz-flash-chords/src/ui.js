import { CHORD_QUALITIES, NOTE_NAMES, TONE_FUNCTIONS, chordSymbol } from './chords.js';

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
  includeExtensions: /** @type {HTMLInputElement} */ (requireElement('include-extensions')),
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
  el.includeExtensions.checked = defaults.includeExtensions;
  el.timerSeconds.addEventListener('change', onChange);
  el.instrument.addEventListener('change', onChange);
  el.autoAdvance.addEventListener('change', onChange);
  el.includeExtensions.addEventListener('change', onChange);
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
  const includeExtensions = el.includeExtensions.checked;
  return { qualityPool, rootPool, timerSeconds, instrument, autoAdvance, includeExtensions };
}

/** @param {() => void} handler */
export function onStartClick(handler) {
  el.startButton.addEventListener('click', handler);
}

/** @param {() => void} handler */
export function onNext(handler) {
  el.nextButton.addEventListener('click', handler);
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !el.resultBanner.hidden) {
      e.preventDefault();
      handler();
    }
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

/** @param {number} ms */
function formatSeconds(ms) {
  return (Math.max(0, ms) / 1000).toFixed(1);
}

/**
 * @param {GameState} state
 * @param {Instrument} instrument
 */
export function render(state, instrument) {
  const { phase, chord, hitSet, wrongSet, timeRemainingMs, passed } = state;

  if (!chord) return;

  el.chordSymbol.textContent = chordSymbol(chord.root, chord.quality, chord.ninth, instrument);

  if (phase === 'preroll') {
    el.timer.textContent = 'Get ready…';
    el.timer.classList.remove('urgent');
  } else if (phase === 'listening' || phase === 'result') {
    el.timer.textContent = `${formatSeconds(timeRemainingMs)}s`;
    el.timer.classList.toggle('urgent', timeRemainingMs < 3000);
  }

  el.toneIndicators.innerHTML = '';
  chord.tones.forEach((pc, i) => {
    const indicator = document.createElement('div');
    indicator.className = 'tone-indicator';
    if (hitSet.has(pc)) indicator.classList.add('hit');
    indicator.textContent = TONE_FUNCTIONS[i] ?? '';
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
