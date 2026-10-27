/**
 * "Midnight Piano": a calm romantic piece composed live with the Web Audio API.
 * Fmaj7 → Dm9 → B♭maj7 → Csus2 at 66 bpm: soft arpeggios, a slow melody, warm pad, hall reverb.
 * Zero download, no copyright. Must be created inside a user tap (browser autoplay rules).
 */
const BEAT = 60 / 66; // seconds per beat
const BEATS_PER_CYCLE = 16; // 4 chords × 4 beats
const LOOKAHEAD_S = 1; // schedule this far ahead
const TICK_MS = 250; // scheduler interval

const CHORDS = [
  // [bass note, arpeggio tones] as MIDI numbers
  [41, [57, 60, 64, 65]], // Fmaj7
  [38, [53, 57, 60, 64]], // Dm9
  [34, [58, 62, 65, 69]], // B♭maj7
  [36, [55, 60, 62, 64]], // Csus2
];
const ARPEGGIO = [0, 2, 1, 3, 2, 1, 3, 2]; // indexes into the chord tones, eighth notes
const MELODIES = [
  // one per cycle, [beat, midi, length in beats]; null = let it breathe
  [
    [0, 81, 2],
    [2, 79, 2],
    [4, 77, 2],
    [6, 76, 1],
    [7, 74, 1],
    [8, 74, 2],
    [10, 77, 2],
    [12, 76, 3],
    [15, 72, 1],
  ],
  [
    [0, 84, 1.5],
    [1.5, 81, 0.5],
    [2, 79, 2],
    [4, 77, 2],
    [6, 81, 2],
    [8, 82, 1],
    [9, 81, 1],
    [10, 77, 2],
    [12, 79, 4],
  ],
  null,
];

const midiToHz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const humanize = () => (Math.random() - 0.5) * 0.02; // tiny timing drift, like real hands

/** Stereo noise with a long tail → convincing room reverb without loading an impulse file. */
function hallImpulse(ctx, seconds = 4.5) {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3.2;
  }
  return buffer;
}

export function createPiano() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  const ctx = new AudioCtx();
  ctx.resume();

  // voices → bus → (dry + reverb) → compressor → master → speakers
  const master = ctx.createGain();
  master.gain.value = 0;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.ratio.value = 3;
  const dry = new GainNode(ctx, { gain: 0.7 });
  const wet = new GainNode(ctx, { gain: 0.55 });
  const reverb = new ConvolverNode(ctx, { buffer: hallImpulse(ctx) });
  const bus = ctx.createGain();
  bus.connect(dry).connect(compressor);
  bus.connect(reverb).connect(wet).connect(compressor);
  compressor.connect(master).connect(ctx.destination);

  /** Felt-piano voice: triangle + soft octave sine through a closing low-pass. */
  function playNote(midi, time, duration, velocity) {
    const freq = midiToHz(midi);
    const body = new OscillatorNode(ctx, { type: 'triangle', frequency: freq });
    const shimmer = new OscillatorNode(ctx, { type: 'sine', frequency: freq * 2 });
    const shimmerGain = new GainNode(ctx, { gain: 0.18 });
    const filter = new BiquadFilterNode(ctx, { type: 'lowpass' });
    const amp = new GainNode(ctx, { gain: 0 });
    filter.frequency.setValueAtTime(900 + velocity * 2600, time);
    filter.frequency.exponentialRampToValueAtTime(700, time + duration);
    amp.gain.setValueAtTime(0, time);
    amp.gain.linearRampToValueAtTime(velocity, time + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0008, time + duration);
    body.connect(filter);
    shimmer.connect(shimmerGain).connect(filter);
    filter.connect(amp).connect(bus);
    for (const osc of [body, shimmer]) {
      osc.start(time);
      osc.stop(time + duration + 0.1);
    }
  }

  /** Slow-swelling detuned sines under each chord. */
  function playPad(midis, time, duration) {
    for (const midi of midis) {
      for (const detune of [-5, 5]) {
        const osc = new OscillatorNode(ctx, { type: 'sine', frequency: midiToHz(midi), detune });
        const filter = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: 800 });
        const amp = new GainNode(ctx, { gain: 0 });
        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(0.014, time + 1.6);
        amp.gain.linearRampToValueAtTime(0, time + duration + 1.2);
        osc.connect(filter).connect(amp).connect(bus);
        osc.start(time);
        osc.stop(time + duration + 1.3);
      }
    }
  }

  let cycle = 0;
  let nextCycleAt = 0;
  let timer = 0;
  let playing = false;
  let level = 0.8;

  function scheduleCycle(start) {
    CHORDS.forEach(([bass, tones], c) => {
      const chordAt = start + c * 4 * BEAT;
      playNote(bass, chordAt, 4 * BEAT + 1.5, 0.34);
      playPad(tones.slice(0, 3), chordAt, 4 * BEAT);
      ARPEGGIO.forEach((tone, i) => {
        const octaveUp = i > 3 ? 12 : 0;
        playNote(
          tones[tone] + octaveUp,
          chordAt + (i * BEAT) / 2 + humanize(),
          2.6,
          0.09 + Math.random() * 0.04,
        );
      });
    });
    const melody = MELODIES[cycle % MELODIES.length] ?? [];
    for (const [beat, midi, length] of melody) {
      playNote(midi, start + beat * BEAT + humanize(), length * BEAT + 1.8, 0.2 + Math.random() * 0.05);
    }
    cycle++;
  }

  function scheduler() {
    while (nextCycleAt < ctx.currentTime + LOOKAHEAD_S) {
      scheduleCycle(nextCycleAt);
      nextCycleAt += BEATS_PER_CYCLE * BEAT;
    }
  }

  function fadeTo(value, seconds) {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  return {
    get playing() {
      return playing;
    },
    play() {
      if (playing) return;
      playing = true;
      ctx.resume();
      nextCycleAt = Math.max(nextCycleAt, ctx.currentTime + 0.15);
      scheduler();
      timer = setInterval(scheduler, TICK_MS);
      fadeTo(level, 2.5);
    },
    pause() {
      if (!playing) return;
      playing = false;
      clearInterval(timer);
      fadeTo(0, 0.6);
      // the audio clock freezes while suspended, so already-scheduled notes resume seamlessly
      setTimeout(() => !playing && ctx.suspend(), 700);
    },
    setVolume(value) {
      level = value;
      if (playing) fadeTo(value, 0.4);
    },
    close() {
      clearInterval(timer);
      ctx.close();
    },
  };
}
