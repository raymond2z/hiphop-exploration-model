import { drumSteps, type DrumPattern } from "./beat-pattern";

export interface AudioBuses {
  output: GainNode;
  drums: GainNode;
  bass: GainNode;
}

interface PlaybackControls {
  bpm(): number;
  drumsOn(): boolean;
  bassOn(): boolean;
  setPlaying(playing: boolean): void;
  showError(): void;
  stepCount?: number;
  outputGain?(): number;
  schedulePlayhead?(step: number, delay: number): void;
}

export interface DrumPlaybackOwner extends PlaybackControls {
  preset(): BackingPreset;
  pattern?(): DrumPattern;
}

export interface ClipPlaybackOwner extends PlaybackControls {
  scheduleClipStep(buses: AudioBuses, step: number, time: number, stepSeconds: number): void;
}

type PlaybackOwner = DrumPlaybackOwner | ClipPlaybackOwner;

interface PlaybackSession {
  owner: PlaybackOwner;
  output?: GainNode;
  buses?: AudioBuses;
  limiter?: DynamicsCompressorNode;
  timer?: number;
}

interface ToneOptions {
  frequency: number;
  endFrequency?: number;
  duration: number;
  volume: number;
  type: OscillatorType;
}

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

export const backingPatterns = {
  pulse: { name: "穩定拍點", bpm: 76 },
  drums: { name: "Hip-hop 鼓循環", bpm: 88 },
  layers: { name: "鼓＋低音", bpm: 88 }
};

export type BackingPreset = keyof typeof backingPatterns;

const bassNotes = new Map([
  [16, { frequency: 65.41, beats: 1.35 }],
  [22, { frequency: 49, beats: 0.65 }],
  [26, { frequency: 58.27, beats: 0.85 }],
  [30, { frequency: 65.41, beats: 0.44 }]
]);

let backingContext: AudioContext | undefined;
let backingNoise: AudioBuffer | undefined;
let activeBacking: PlaybackSession | null = null;

export function stopPracticeBacking(owner?: PlaybackOwner) {
  if (!activeBacking || (owner && activeBacking.owner !== owner)) return;
  const playback = activeBacking;
  activeBacking = null;
  clearInterval(playback.timer);
  playback.output?.disconnect();
  playback.limiter?.disconnect();
  playback.owner.setPlaying(false);
}

export function backingTone(output: GainNode, time: number, { frequency, endFrequency, duration, volume, type }: ToneOptions) {
  const context = output.context;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, time);
  if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, time + duration * 0.58);
  envelope.gain.setValueAtTime(0.001, time);
  envelope.gain.exponentialRampToValueAtTime(volume, time + 0.008);
  envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);
  oscillator.connect(envelope).connect(output);
  oscillator.start(time);
  oscillator.stop(time + duration + 0.01);
}

function backingPercussion(output: GainNode, time: number, { frequency, duration, volume, type }: Omit<ToneOptions, "type" | "endFrequency"> & { type: BiquadFilterType }) {
  const context = output.context;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const envelope = context.createGain();
  source.buffer = backingNoise ?? null;
  filter.type = type;
  filter.frequency.value = frequency;
  envelope.gain.setValueAtTime(volume, time);
  envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);
  source.connect(filter).connect(envelope).connect(output);
  source.start(time);
  source.stop(time + duration + 0.01);
}

export function scheduleDrumStep(drums: GainNode, drumPattern: DrumPattern, step: number, time: number, stepSeconds: number) {
  if (drumPattern.kick.includes(step)) {
    backingTone(drums, time, { frequency: 141, endFrequency: 46, duration: 0.21, volume: 0.72, type: "sine" });
  }
  if (drumPattern.snare.includes(step)) {
    backingPercussion(drums, time, { frequency: 1700, duration: 0.14, volume: 0.55, type: "bandpass" });
    backingTone(drums, time, { frequency: 182, endFrequency: 120, duration: 0.085, volume: 0.19, type: "triangle" });
  }
  if (drumPattern.hat.includes(step)) {
    const onBeat = step % 4 === 0;
    const swing = step % 2 === 0 ? 0 : stepSeconds * 0.15;
    backingPercussion(drums, time + swing, {
      frequency: 6500, duration: onBeat ? 0.055 : 0.035, volume: onBeat ? 0.14 : 0.095, type: "highpass"
    });
  }
}

function scheduleBackingStep(owner: PlaybackOwner, buses: AudioBuses, step: number, time: number, stepSeconds: number) {
  const { drums, bass } = buses;
  if ("scheduleClipStep" in owner) {
    owner.scheduleClipStep(buses, step, time, stepSeconds);
    return;
  }
  if (owner.preset() === "pulse") {
    if (step % 4 === 0) {
      backingTone(drums, time, {
        frequency: step % 16 === 0 ? 1000 : 750, duration: 0.055, volume: 0.25, type: "sine"
      });
    }
    return;
  }
  scheduleDrumStep(drums, owner.pattern?.() ?? drumSteps, step, time, stepSeconds);
  const note = bassNotes.get(step);
  if (owner.preset() === "layers" && note) {
    backingTone(bass, time, { frequency: note.frequency, duration: note.beats * stepSeconds * 4, volume: 0.52, type: "triangle" });
  }
}

export function isPracticeBackingActive(owner: PlaybackOwner): boolean {
  return activeBacking?.owner === owner;
}

export function updateBackingMix(owner: PlaybackOwner) {
  if (activeBacking?.owner !== owner || !activeBacking.buses) return;
  const { drums, bass } = activeBacking.buses;
  const time = drums.context.currentTime;
  drums.gain.setTargetAtTime(Number(owner.drumsOn()), time, 0.012);
  bass.gain.setTargetAtTime(Number(owner.bassOn()), time, 0.012);
}

export function practiceBackingVolume(percent: number) {
  return percent / 100 * 1.35;
}

export function updatePracticeBackingVolume(owner: PlaybackOwner) {
  const output = activeBacking?.owner === owner && activeBacking.output;
  if (output && owner.outputGain) output.gain.setTargetAtTime(owner.outputGain(), output.context.currentTime, 0.012);
}

export async function playPracticeBacking(owner: PlaybackOwner) {
  stopPracticeBacking();
  for (const audio of document.querySelectorAll<HTMLAudioElement>("audio[data-practice-audio]")) audio.pause();

  const playback: PlaybackSession = { owner };
  activeBacking = playback;
  owner.setPlaying(true);

  try {
    const AudioEngine = window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AudioEngine) throw new Error("Web Audio unavailable");
    const context = backingContext ??= new AudioEngine();
    await context.resume();
    if (activeBacking !== playback) return;

    if (!backingNoise) {
      backingNoise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.2), context.sampleRate);
      const samples = backingNoise.getChannelData(0);
      for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1;
    }

    playback.output = context.createGain();
    playback.output.gain.value = owner.outputGain?.() ?? 0.56;
    if (owner.outputGain) {
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -7;
      limiter.knee.value = 6;
      limiter.ratio.value = 10;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.12;
      playback.output.connect(limiter).connect(context.destination);
      playback.limiter = limiter;
    } else {
      playback.output.connect(context.destination);
    }
    const drums = context.createGain();
    const bass = context.createGain();
    const buses: AudioBuses = { drums, bass, output: playback.output };
    playback.buses = buses;
    drums.gain.value = Number(owner.drumsOn());
    drums.connect(buses.output);
    bass.gain.value = Number(owner.bassOn());
    bass.connect(buses.output);

    let step = 0;
    const stepCount = owner.stepCount ?? 32;
    let nextTime = context.currentTime + 0.04;
    function schedule() {
      const now = context.currentTime;
      if (nextTime < now) nextTime = now + 0.02;
      while (nextTime < now + 0.1) {
        const stepSeconds = 15 / owner.bpm();
        scheduleBackingStep(owner, buses, step, nextTime, stepSeconds);
        owner.schedulePlayhead?.(step, nextTime - now);
        step = (step + 1) % stepCount;
        nextTime += stepSeconds;
      }
    }

    schedule();
    playback.timer = setInterval(schedule, 25);
  } catch {
    if (activeBacking !== playback) return;
    stopPracticeBacking();
    owner.showError();
  }
}


document.addEventListener("play", event => {
  if (event.target instanceof HTMLAudioElement
    && event.target.matches("audio[data-practice-audio]") && !event.target.paused) stopPracticeBacking();
}, true);
window.addEventListener("pagehide", () => stopPracticeBacking());
