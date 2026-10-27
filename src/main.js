/**
 * Entry point. All content lives in ./content.js; each component renders itself from it.
 * Global styles load first, component styles come with their components, reduced-motion last.
 */
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/animations.css';

import content from './content.js';
import { $$, bindText, getPath } from './utils/dom.js';
import { parseDate } from './utils/date.js';
import { setImage } from './lib/images.js';
import { createMusicPlayer } from './components/music-player/music-player.js';
import { startAmbient } from './lib/ambient.js';
import { startReveals } from './lib/reveal.js';
import { initGate } from './components/gate/gate.js';
import { initHero } from './components/hero/hero.js';
import { initMemories } from './components/memories/memories.js';
import { initReasons } from './components/reasons/reasons.js';
import { initWish } from './components/wish/wish.js';
import { initLetter } from './components/letter/letter.js';
import { initFinale } from './components/finale/finale.js';

import './styles/reduced-motion.css';

const birthday = parseDate(content.birthday);
const music = createMusicPlayer(content);

bindText(content);
$$('img[data-src]').forEach((img) =>
  setImage(img, getPath(content, img.dataset.src), Number(img.dataset.scene) || 0),
);

initHero(content, birthday);
initMemories(content);
initReasons(content);
initWish(content, music);
initLetter(content);
initFinale(content);

// The gift screen goes last: everything behind it is built and ready to reveal.
initGate({
  birthday,
  music,
  onOpen() {
    startAmbient();
    startReveals();
  },
});
