/** Tiny WebAudio cue engine — no assets required. */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function beep(freq: number, start: number, dur: number, type: OscillatorType, gain = 0.06) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

export const sfx = {
  correct() {
    beep(880, 0, 0.09, "sine");
    beep(1318.5, 0.09, 0.14, "sine");
  },
  wrong() {
    beep(196, 0, 0.16, "square", 0.04);
    beep(147, 0.14, 0.22, "square", 0.04);
  },
  keypress() {
    beep(2200, 0, 0.015, "sine", 0.015);
  },
  success() {
    beep(523.25, 0, 0.1, "sine");
    beep(659.25, 0.1, 0.1, "sine");
    beep(783.99, 0.2, 0.1, "sine");
    beep(1046.5, 0.3, 0.25, "sine");
  },
  badge() {
    beep(659.25, 0, 0.1, "triangle");
    beep(880, 0.1, 0.1, "triangle");
    beep(1174.7, 0.2, 0.3, "triangle");
  },
};
