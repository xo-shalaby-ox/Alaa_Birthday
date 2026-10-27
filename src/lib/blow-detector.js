/**
 * Listen to the microphone and call `onBlow` while she's blowing (sustained loud input).
 * Resolves to a `stop()` function; rejects if there's no mic / permission.
 */
const LOUDNESS = 0.16; // RMS threshold for "blowing"
const SUSTAIN_FRAMES = 4; // must stay loud this many frames (ignores clicks/taps)
const COOLDOWN_MS = 160; // max one blow event per this interval

export async function listenForBlow(onBlow) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false },
  });
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  ctx.createMediaStreamSource(stream).connect(analyser);
  const samples = new Uint8Array(analyser.fftSize);
  let frame = 0;
  let loudFrames = 0;
  let lastBlow = 0;

  function loop(now) {
    analyser.getByteTimeDomainData(samples);
    let sum = 0;
    for (const v of samples) sum += ((v - 128) / 128) ** 2;
    const rms = Math.sqrt(sum / samples.length);
    loudFrames = rms > LOUDNESS ? loudFrames + 1 : Math.max(0, loudFrames - 1);
    if (loudFrames > SUSTAIN_FRAMES && now - lastBlow > COOLDOWN_MS) {
      lastBlow = now;
      onBlow();
    }
    frame = requestAnimationFrame(loop);
  }
  frame = requestAnimationFrame(loop);

  return function stop() {
    cancelAnimationFrame(frame);
    stream.getTracks().forEach((track) => track.stop());
    ctx.close();
  };
}
