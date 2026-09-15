/**
 * @returns {Promise<{ audioContext: AudioContext, analyser: AnalyserNode }>}
 */
export async function initAudioInput() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  return { audioContext, analyser };
}

/**
 * @param {AnalyserNode} analyser
 * @returns {Float32Array}
 */
export function readBuffer(analyser) {
  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);
  return buffer;
}
