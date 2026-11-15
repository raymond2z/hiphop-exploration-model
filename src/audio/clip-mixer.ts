import type { DrumPattern } from "./beat-pattern";
import {
  backingTone, playPracticeBacking, practiceBackingVolume, scheduleDrumStep, stopPracticeBacking,
  updatePracticeBackingVolume, type ClipPlaybackOwner
} from "./engine";
import { requireElement } from "./dom";

type PitchedLayer = "bass" | "chords" | "melody";
type Layer = "drums" | PitchedLayer;
type DrumClip = { name: string; pattern: DrumPattern };
type ClipNote = [step: number, beats: number, ...pitches: number[]];
type PitchedClip = { name: string; notes: ClipNote[] };
type Clip = DrumClip | PitchedClip;
type ClipTrack =
  | { id: "drums"; label: string; clips: DrumClip[] }
  | { id: PitchedLayer; label: string; clips: PitchedClip[]; volume: number; type: OscillatorType };

const clipMixerTracks: ClipTrack[] = [
  { id: "drums", label: "鼓", clips: [
    { name: "穩拍", pattern: { kick: [0, 8], snare: [4, 12], hat: [0, 4, 8, 12] } },
    { name: "錯落", pattern: { kick: [0, 6, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14] } },
    { name: "雙擊", pattern: { kick: [0, 3, 10, 14], snare: [4, 12], hat: [2, 6, 8, 11, 14, 15] } },
    { name: "留白", pattern: { kick: [0, 6], snare: [4, 12], hat: [2, 8, 10] } }
  ] },
  { id: "bass", label: "低音", volume: 0.38, type: "triangle", clips: [
    { name: "長音", notes: [[0, 2, 33], [8, 1.5, 40], [16, 2.5, 33], [28, 0.8, 36]] },
    { name: "短拍", notes: [[0, 0.6, 33], [6, 0.45, 33], [10, 0.5, 40], [16, 0.6, 33], [24, 0.45, 36], [30, 0.35, 40]] },
    { name: "下行", notes: [[0, 1.7, 33], [8, 1.5, 31], [16, 1.7, 29], [24, 1.5, 28]] },
    { name: "八度", notes: [[0, 0.75, 33], [4, 0.6, 45], [10, 0.8, 33], [16, 0.75, 33], [22, 0.6, 45], [28, 0.75, 40]] }
  ] },
  { id: "chords", label: "和弦", volume: 0.115, type: "triangle", clips: [
    { name: "延伸", notes: [[0, 3.5, 57, 60, 64], [16, 3.5, 57, 60, 65]] },
    { name: "切分", notes: [[0, 0.55, 57, 60, 64], [6, 0.55, 57, 60, 64], [10, 0.55, 57, 60, 64], [16, 0.55, 55, 60, 64], [26, 0.55, 55, 60, 64]] },
    { name: "深色", notes: [[0, 2.4, 53, 57, 60], [12, 0.7, 52, 55, 59], [16, 2.5, 57, 60, 64]] },
    { name: "點綴", notes: [[0, 0.7, 60, 64, 67], [8, 0.7, 57, 60, 64], [16, 0.7, 60, 64, 67], [24, 0.7, 57, 60, 64]] }
  ] },
  { id: "melody", label: "旋律", volume: 0.23, type: "sine", clips: [
    { name: "三音", notes: [[0, 0.6, 69], [6, 0.55, 72], [12, 0.8, 76], [20, 0.55, 72], [24, 1.1, 69]] },
    { name: "問答", notes: [[0, 0.45, 72], [4, 0.45, 74], [8, 0.8, 76], [16, 0.45, 76], [22, 0.55, 72], [28, 0.7, 69]] },
    { name: "上行", notes: [[0, 0.8, 64], [4, 0.65, 67], [10, 0.8, 69], [16, 0.85, 72], [24, 1.1, 76]] },
    { name: "疏落", notes: [[0, 1.25, 76], [10, 0.9, 72], [24, 1.25, 69]] }
  ] }
];

export function setupClipMixer(container: HTMLElement) {
  container.innerHTML = `
    <p class="beat-instruction">點一張卡開始，也可以逐層疊加。播放中換卡會在下一小節生效。</p>
    <div class="clip-banks" aria-label="可疊加的音樂片段"></div>
    <div class="beat-controls">
      <button type="button" class="plain-button" data-clip-stop disabled>停止全部</button>
      <label class="backing-tempo">
        <span>速度 <b><output data-clip-bpm>88</output> BPM</b></span>
        <input type="range" min="60" max="130" value="88" aria-label="片段速度（BPM）" data-clip-tempo>
      </label>
      <label class="backing-tempo">
        <span>音量 <b><output data-clip-volume-label>80</output>%</b></span>
        <input type="range" min="0" max="100" value="80" aria-label="片段音量" data-clip-volume>
      </label>
    </div>
    <p class="beat-status" role="status"></p>`;

  const banks = requireElement<HTMLElement>(container, ".clip-banks");
  const stop = requireElement<HTMLButtonElement>(container, "[data-clip-stop]");
  const tempo = requireElement<HTMLInputElement>(container, "[data-clip-tempo]");
  const volume = requireElement<HTMLInputElement>(container, "[data-clip-volume]");
  const status = requireElement<HTMLElement>(container, ".beat-status");
  const playingClips = new Map<Layer, { clip: Clip; start: number }>();
  const queuedClips = new Map<Layer, Clip | null>();
  const pads: { button: HTMLButtonElement; caption: HTMLSpanElement; track: ClipTrack; clip: Clip }[] = [];
  let playing = false;

  function render() {
    for (const { button, caption, track, clip } of pads) {
      const active = playingClips.get(track.id)?.clip === clip;
      const queued = queuedClips.get(track.id) === clip;
      const changing = active && queuedClips.has(track.id);
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("is-queued", queued);
      caption.textContent = queued ? "候播" : changing ? "將切換" : active ? "播放中" : "";
    }
  }

  const sceneSteps = 32;
  const owner: ClipPlaybackOwner = {
    stepCount: sceneSteps,
    bpm: () => tempo.valueAsNumber,
    outputGain: () => practiceBackingVolume(volume.valueAsNumber),
    drumsOn: () => true,
    bassOn: () => true,
    setPlaying(value) {
      playing = value;
      stop.disabled = !value;
      if (!value) {
        playingClips.clear();
        queuedClips.clear();
      }
      render();
    },
    showError() {
      status.textContent = "音樂片段未能播放。請再點一次卡片。";
    },
    scheduleClipStep(playback, step, time, stepSeconds) {
      if (step % 16 === 0 && queuedClips.size) {
        for (const [id, clip] of queuedClips) {
          if (clip) playingClips.set(id, { clip, start: step });
          else playingClips.delete(id);
        }
        queuedClips.clear();
        render();
      }
      for (const track of clipMixerTracks) {
        const active = playingClips.get(track.id);
        if (!active) continue;
        const offset = (step - active.start + sceneSteps) % sceneSteps;
        if ("pattern" in active.clip) {
          scheduleDrumStep(playback.drums, active.clip.pattern, offset % 16, time, stepSeconds);
          continue;
        }
        if (track.id === "drums") continue;
        const output = track.id === "bass" ? playback.bass : playback.output;
        for (const [at, beats, ...pitches] of active.clip.notes) {
          if (at !== offset) continue;
          for (const pitch of pitches) {
            backingTone(output, time, {
              frequency: 440 * 2 ** ((pitch - 69) / 12),
              duration: beats * stepSeconds * 4,
              volume: track.volume,
              type: track.type
            });
          }
        }
      }
    }
  };

  for (const track of clipMixerTracks) {
    const bank = document.createElement("fieldset");
    bank.className = "clip-bank";
    bank.dataset.layer = track.id;
    const legend = document.createElement("legend");
    legend.textContent = track.label;
    bank.append(legend);
    for (const clip of track.clips) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "clip-pad";
      button.setAttribute("aria-label", `${track.label}，${clip.name}`);
      button.textContent = clip.name;
      const caption = document.createElement("span");
      caption.setAttribute("aria-hidden", "true");
      button.append(caption);
      pads.push({ button, caption, track, clip });
      bank.append(button);
      button.addEventListener("click", () => {
        status.textContent = "";
        const current = playingClips.get(track.id)?.clip ?? null;
        const selected = queuedClips.has(track.id) ? queuedClips.get(track.id) : current;
        const next = selected === clip ? null : clip;
        if (!playing) {
          playingClips.set(track.id, { clip, start: 0 });
          playPracticeBacking(owner);
        } else {
          if (next === current) queuedClips.delete(track.id);
          else queuedClips.set(track.id, next);
          render();
        }
      });
    }
    banks.append(bank);
  }
  render();
  stop.addEventListener("click", () => stopPracticeBacking(owner));
  tempo.addEventListener("input", () => {
    requireElement<HTMLOutputElement>(container, "[data-clip-bpm]").value = tempo.value;
  });
  volume.addEventListener("input", () => {
    requireElement<HTMLOutputElement>(container, "[data-clip-volume-label]").value = volume.value;
    updatePracticeBackingVolume(owner);
  });
  const panel = container.closest("details");
  panel?.addEventListener("toggle", () => {
    if (!panel.open) stopPracticeBacking(owner);
  });
  if (panel && location.hash === `#${panel.id}`) panel.open = true;
}
