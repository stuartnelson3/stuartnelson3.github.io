/**
 * @returns {Promise<{ audioContext: AudioContext, analyser: AnalyserNode, stream: MediaStream }>}
 */
export async function initAudioInput() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  return { audioContext, analyser, stream };
}

/**
 * Fully releases the mic: stops the media stream's tracks (this is what
 * actually turns off the browser's recording indicator — closing the
 * AudioContext alone does not) and closes the audio context.
 * @param {{ audioContext: AudioContext, stream: MediaStream }} session
 */
export function stopAudioInput(session) {
  session.stream.getTracks().forEach((track) => track.stop());
  session.audioContext.close();
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
