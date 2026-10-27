/**
 * Background music with one simple API, whatever the source:
 * her song from content.js, or "Midnight Piano" if the file is missing or fails.
 */
import './music-player.css';
import { $ } from '../../utils/dom.js';
import { createPiano } from '../../lib/piano.js';

const VOLUME = 0.85;
const DUCKED = 0.12; // while the mic is listening

export function createMusicPlayer(content) {
  const audio = $('#audio');
  const pill = $('#music');
  const song = content.song ?? {};
  let piano = null;
  let usingPiano = false;
  let wanted = false; // does she want music on (vs. paused by her)?

  const isPlaying = () => (usingPiano ? piano.playing : !audio.paused);

  function setLabel(title, artist) {
    $('b', pill).textContent = title;
    $('small', pill).textContent = artist;
    if ('mediaSession' in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist });
    }
  }

  function render() {
    const on = isPlaying();
    pill.classList.toggle('playing', on);
    pill.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
  }

  function switchToPiano() {
    if (usingPiano || !piano) return;
    usingPiano = true;
    audio.removeAttribute('src');
    setLabel('Midnight Piano', `composed for ${content.her}`);
    pill.hidden = false;
    if (wanted) piano.play();
    render();
  }

  function set(on) {
    if (usingPiano) on ? piano.play() : piano.pause();
    else if (on) audio.play().catch(() => {});
    else audio.pause();
    render();
  }

  audio.volume = VOLUME;
  audio.addEventListener('play', render);
  audio.addEventListener('pause', render);
  audio.addEventListener('playing', () => {
    pill.hidden = false;
    piano?.close(); // her song works → the piano isn't needed
    piano = null;
  });
  audio.addEventListener('error', () => audio.getAttribute('src') && switchToPiano());

  pill.addEventListener('click', () => {
    wanted = !isPlaying();
    set(wanted);
  });
  // pause when she leaves the tab / locks the phone, resume when she's back
  document.addEventListener('visibilitychange', () => {
    if (pill.hidden) return;
    if (document.hidden) set(false);
    else if (wanted) set(true);
  });

  return {
    /** Call inside the tap that opens the gift (browsers only allow sound after a tap). */
    start() {
      wanted = true;
      piano = createPiano();
      if (!song.src) return switchToPiano();
      setLabel(song.title || 'Our Song', song.artist || '');
      audio.src = song.src;
      audio.play().catch(() => {
        if (audio.error) switchToPiano();
        else {
          pill.hidden = false; // autoplay blocked: let her tap play
          render();
        }
      });
    },
    /** Lower the music while the mic listens for her blowing. */
    duck(on) {
      const volume = on ? DUCKED : VOLUME;
      if (usingPiano) piano.setVolume(volume);
      else audio.volume = volume;
    },
  };
}
