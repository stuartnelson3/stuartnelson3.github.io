import { CHORD_QUALITIES } from './chords.js';
import { initAudioInput, readBuffer, stopAudioInput } from './audio-input.js';
import { GameState } from './game-state.js';
import * as ui from './ui.js';

/** @typedef {import('./game-state.js').Settings} Settings */
/** @typedef {import('./game-state.js').AudioFrame} AudioFrame */

/** @type {Settings} */
const defaultSettings = {
  timerSeconds: 8,
  instrument: 'C',
  autoAdvance: false,
  autoAdvanceDelaySeconds: 1.5,
  includeExtensions: true,
  eliminationMode: false,
  qualityPool: /** @type {import('./chords.js').QualityKey[]} */ (Object.keys(CHORD_QUALITIES)),
  rootPool: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

const gameState = new GameState(defaultSettings);

/** @type {{ audioContext: AudioContext, analyser: AnalyserNode, stream: MediaStream } | null} */
let audioSession = null;
/** @type {number | null} */
let lastFrameTime = null;
/** @type {number | null} */
let rafHandle = null;
let running = false;

ui.initSettingsToggle();
ui.initSettingsPanel(defaultSettings, () => {
  gameState.updateSettings(ui.readSettings());
});

gameState.subscribe((state) => ui.render(state, gameState.settings.instrument));

ui.onAdvance(() => gameState.skip());

ui.onStartClick(() => {
  if (running) {
    stopSession();
  } else {
    startSession();
  }
});

async function startSession() {
  try {
    audioSession = await initAudioInput();
  } catch (err) {
    ui.showMicError(
      'Microphone access is required to play. Please allow mic permission and try again.'
    );
    return;
  }

  running = true;
  ui.setRunning(true);
  ui.showGameScreen();
  gameState.startSession();
  lastFrameTime = performance.now();
  rafHandle = requestAnimationFrame(loop);
}

function stopSession() {
  running = false;
  ui.setRunning(false);
  if (rafHandle !== null) {
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
  }
  if (audioSession) {
    stopAudioInput(audioSession);
    audioSession = null;
  }
  gameState.stop();
  ui.showStartScreen();
}

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

  rafHandle = requestAnimationFrame(loop);
}
