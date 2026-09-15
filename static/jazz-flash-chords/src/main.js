import { CHORD_QUALITIES } from './chords.js';
import { initAudioInput, readBuffer } from './audio-input.js';
import { GameState } from './game-state.js';
import * as ui from './ui.js';

/** @typedef {import('./game-state.js').Settings} Settings */
/** @typedef {import('./game-state.js').AudioFrame} AudioFrame */

/** @type {Settings} */
const defaultSettings = {
  timerSeconds: 8,
  instrument: 'concert',
  autoAdvance: false,
  qualityPool: /** @type {import('./chords.js').QualityKey[]} */ (Object.keys(CHORD_QUALITIES)),
  rootPool: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

const gameState = new GameState(defaultSettings);

/** @type {{ audioContext: AudioContext, analyser: AnalyserNode } | null} */
let audioSession = null;
/** @type {number | null} */
let lastFrameTime = null;

ui.initSettingsToggle();
ui.initSettingsPanel(defaultSettings, () => {
  gameState.updateSettings(ui.readSettings());
});

gameState.subscribe((state) => ui.render(state, gameState.settings.instrument));

ui.onNext(() => gameState.next());

ui.onStartClick(async () => {
  try {
    audioSession = await initAudioInput();
  } catch (err) {
    ui.showMicError(
      'Microphone access is required to play. Please allow mic permission and try again.'
    );
    return;
  }

  ui.showGameScreen();
  gameState.startRound();
  lastFrameTime = performance.now();
  requestAnimationFrame(loop);
});

/** @param {number} now */
function loop(now) {
  if (lastFrameTime === null) lastFrameTime = now;
  const deltaMs = now - lastFrameTime;
  lastFrameTime = now;

  /** @type {AudioFrame | null} */
  let audio = null;
  if (gameState.phase === 'listening' && audioSession) {
    audio = { buffer: readBuffer(audioSession.analyser), sampleRate: audioSession.audioContext.sampleRate };
  }

  gameState.tick(deltaMs, audio);

  requestAnimationFrame(loop);
}
