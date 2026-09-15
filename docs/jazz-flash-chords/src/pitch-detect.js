// Standard four-step YIN: difference function → cumulative mean normalized
// difference → absolute threshold → parabolic interpolation for sub-sample
// precision.
/**
 * @param {Float32Array} buffer
 * @param {number} sampleRate
 * @param {number} [threshold]
 * @returns {number | null} detected frequency in Hz, or null if no clear pitch
 */
export function yinPitchDetect(buffer, sampleRate, threshold = 0.15) {
  const halfBufferSize = Math.floor(buffer.length / 2);
  const yinBuffer = new Float32Array(halfBufferSize);

  // Step 1: difference function
  for (let tau = 1; tau < halfBufferSize; tau++) {
    let sum = 0;
    for (let i = 0; i < halfBufferSize; i++) {
      const delta = buffer[i] - buffer[i + tau];
      sum += delta * delta;
    }
    yinBuffer[tau] = sum;
  }

  // Step 2: cumulative mean normalized difference function
  yinBuffer[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < halfBufferSize; tau++) {
    runningSum += yinBuffer[tau];
    yinBuffer[tau] *= tau / runningSum;
  }

  // Step 3: absolute threshold — find first dip below threshold, then
  // walk forward to its local minimum
  let tauEstimate = -1;
  for (let tau = 2; tau < halfBufferSize; tau++) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < halfBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      tauEstimate = tau;
      break;
    }
  }
  if (tauEstimate === -1) return null; // no clear pitch (silence/noise)

  // Step 4: parabolic interpolation
  const x0 = tauEstimate < 1 ? tauEstimate : tauEstimate - 1;
  const x2 = tauEstimate + 1 < halfBufferSize ? tauEstimate + 1 : tauEstimate;
  let betterTau;
  if (x0 === tauEstimate) {
    betterTau = yinBuffer[tauEstimate] <= yinBuffer[x2] ? tauEstimate : x2;
  } else if (x2 === tauEstimate) {
    betterTau = yinBuffer[tauEstimate] <= yinBuffer[x0] ? tauEstimate : x0;
  } else {
    const s0 = yinBuffer[x0], s1 = yinBuffer[tauEstimate], s2 = yinBuffer[x2];
    betterTau = tauEstimate + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
  }

  return sampleRate / betterTau;
}

/**
 * @param {number} frequency
 * @returns {number} MIDI note number, A4 = 69 = 440Hz
 */
export function frequencyToNoteNumber(frequency) {
  return 12 * Math.log2(frequency / 440) + 69; // MIDI note, A4 = 69 = 440Hz
}

/**
 * @param {number} frequency
 * @returns {number} pitch class, 0-11, 0 = C
 */
export function frequencyToPitchClass(frequency) {
  const noteNumber = Math.round(frequencyToNoteNumber(frequency));
  return ((noteNumber % 12) + 12) % 12; // 0 = C
}

/**
 * @param {number} frequency
 * @returns {number} cents away from the nearest note, -50 to 50
 */
export function centsOff(frequency) {
  const exact = frequencyToNoteNumber(frequency);
  return Math.round((exact - Math.round(exact)) * 100);
}

// Root-mean-square amplitude of a time-domain buffer, used to gate out
// silence/noise before running YIN at all.
/**
 * @param {Float32Array} buffer
 * @returns {number}
 */
export function rms(buffer) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}
