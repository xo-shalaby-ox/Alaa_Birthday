/** 5 · Birthday cake: tap the candles or blow into the mic. */
import './wish.css';
import { $, centerOf, el } from '../../utils/dom.js';
import { clamp } from '../../utils/math.js';
import { fx } from '../../lib/fx.js';
import { listenForBlow } from '../../lib/blow-detector.js';

const MIC_IDLE = { button: 'Blow into the mic 🎤', hint: 'or tap each candle' };
const MIC_LISTENING = { button: 'Listening… blow! 💨', hint: 'tap again to stop' };

export function initWish(content, music) {
  const controls = $('#wishCtl');
  const micButton = $('#micBtn');
  const hint = $('#micHint');
  const count = clamp(Number(content.wish?.candles) || 5, 1, 9);
  let litCount = count;
  let stopListening = null;

  const candles = Array.from({ length: count }, (_, i) => {
    const candle = el('button', 'candle');
    candle.type = 'button';
    candle.setAttribute('aria-label', `Blow out candle ${i + 1}`);
    candle.append(el('span', 'flame'));
    candle.addEventListener('click', () => blowOut(candle));
    return candle;
  });
  $('#candles').append(...candles);

  function setMicUi({ button, hint: text }, listening) {
    micButton.textContent = button;
    hint.textContent = text;
    controls.classList.toggle('listening', listening);
  }

  function stopMic() {
    stopListening?.();
    stopListening = null;
    music.duck(false);
    setMicUi(MIC_IDLE, false);
  }

  function blowOut(candle) {
    if (candle.disabled) return;
    candle.disabled = true;
    candle.classList.add('out');
    const [x, y] = centerOf(candle);
    fx.burst(x, y - 30, { count: 8, power: 3, shapes: ['star', 'dot'] });
    if (--litCount > 0) return;
    if (stopListening) stopMic();
    controls.hidden = true;
    $('#wishDone').hidden = false;
    fx.party();
  }

  micButton.addEventListener('click', async () => {
    if (stopListening) return stopMic();
    try {
      stopListening = await listenForBlow(() => {
        const lit = candles.find((c) => !c.disabled);
        if (lit) blowOut(lit);
      });
      music.duck(true);
      setMicUi(MIC_LISTENING, true);
    } catch {
      hint.textContent = 'No mic here, just tap the candles 💨';
    }
  });
}
