const MUTE_KEY = 'formwork.soundMuted';
const MUTE_EVENT = 'formwork-sound-mute-change';

let muted = false;
if (typeof window !== 'undefined') {
  try {
    muted = window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    muted = false;
  }
}

export function isSoundMuted(): boolean {
  return muted;
}

export function setSoundMuted(next: boolean): void {
  muted = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    } catch {
      // Storage may be unavailable in restricted contexts
    }
    window.dispatchEvent(new CustomEvent(MUTE_EVENT));
  }
}

export function toggleSoundMuted(): boolean {
  setSoundMuted(!muted);
  return muted;
}

export function subscribeSoundMuted(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(MUTE_EVENT, callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === MUTE_KEY) {
      muted = event.newValue === '1';
      callback();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(MUTE_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}

let audioCtx: AudioContext | null = null;

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (typeof window.AudioContext === 'function') {
    return window.AudioContext;
  }
  return null;
}

function initAudio(): AudioContext | null {
  const Ctor = getAudioContextConstructor();
  if (!Ctor) return null;
  if (!audioCtx) {
    try {
      audioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

if (typeof window !== 'undefined') {
  const unlock = () => {
    initAudio();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
}

export function playHoverSound(volume = 0.08, pitch = 1.2): void {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(350 * pitch, now + 0.012);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.012);
  } catch {
    // Ignore audio errors when context is blocked
  }
}

export function playClickSound(volume = 0.14, pitch = 1): void {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(850 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(160 * pitch, now + 0.02);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  } catch {
    // Ignore audio errors when context is blocked
  }
}

export function playTickSound(volume = 0.08, pitch = 1.5): void {
  if (muted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(450 * pitch, now + 0.01);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.01);
  } catch {
    // Ignore audio errors when context is blocked
  }
}
