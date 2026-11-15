import {
  backingPatterns, isPracticeBackingActive, playPracticeBacking, stopPracticeBacking, updateBackingMix,
  type BackingPreset, type DrumPlaybackOwner
} from "./engine";
import { requireElement } from "../dom";

function readPreset(value: string | undefined): BackingPreset {
  return value === "pulse" || value === "layers" ? value : "drums";
}

export function setupPracticeBacking(container: HTMLElement) {
  container.innerHTML = `
    <div class="backing-controls" role="group" aria-label="練習伴奏">
      <button type="button" class="backing-play">播放伴奏</button>
      <label class="backing-preset">
        <span>伴奏</span>
        <select>${Object.entries(backingPatterns).map(([key, pattern]) =>
          `<option value="${key}">${pattern.name}</option>`).join("")}</select>
      </label>
      <label class="backing-tempo">
        <span>速度 <b><output>88</output> BPM</b></span>
        <input type="range" min="60" max="130" step="1" value="88" aria-label="速度（BPM）">
      </label>
      <div class="backing-layers" role="group" aria-label="聲音開關" hidden>
        <label><input type="checkbox" data-layer="drums" checked>鼓聲</label>
        <label><input type="checkbox" data-layer="bass" checked>低音</label>
      </div>
      <p class="backing-error" role="status" hidden></p>
    </div>`;

  const button = requireElement<HTMLButtonElement>(container, ".backing-play");
  const preset = requireElement<HTMLSelectElement>(container, "select");
  const tempo = requireElement<HTMLInputElement>(container, "input[type=range]");
  const readout = requireElement<HTMLOutputElement>(container, "output");
  const layers = requireElement<HTMLElement>(container, ".backing-layers");
  const drums = requireElement<HTMLInputElement>(container, '[data-layer="drums"]');
  const bass = requireElement<HTMLInputElement>(container, '[data-layer="bass"]');
  const error = requireElement<HTMLElement>(container, ".backing-error");
  const owner: DrumPlaybackOwner = {
    preset: () => readPreset(preset.value),
    bpm: () => tempo.valueAsNumber,
    drumsOn: () => preset.value !== "layers" || drums.checked,
    bassOn: () => preset.value === "layers" && bass.checked,
    setPlaying: playing => {
      button.textContent = playing ? "停止伴奏" : "播放伴奏";
      button.classList.toggle("is-playing", playing);
      error.hidden = true;
    },
    showError: () => {
      error.textContent = "伴奏未能播放。請再按一次，或改用自己的音樂。";
      error.hidden = false;
    }
  };

  function setPreset(value: BackingPreset) {
    stopPracticeBacking(owner);
    preset.value = value;
    tempo.value = String(backingPatterns[value].bpm);
    readout.value = tempo.value;
    layers.hidden = value !== "layers";
    drums.checked = true;
    bass.checked = true;
  }

  const presetLabel = preset.closest("label");
  if (presetLabel) presetLabel.hidden = container.hasAttribute("data-fixed");
  setPreset(readPreset(container.dataset.preset));
  preset.addEventListener("change", () => {
    const wasPlaying = isPracticeBackingActive(owner);
    setPreset(readPreset(preset.value));
    if (wasPlaying) playPracticeBacking(owner);
  });
  tempo.addEventListener("input", () => { readout.value = tempo.value; });
  for (const layer of [drums, bass]) {
    layer.addEventListener("change", () => {
      updateBackingMix(owner);
    });
  }
  button.addEventListener("click", () => {
    if (isPracticeBackingActive(owner)) stopPracticeBacking(owner);
    else playPracticeBacking(owner);
  });

  return { setPreset, stop: () => stopPracticeBacking(owner) };
}
