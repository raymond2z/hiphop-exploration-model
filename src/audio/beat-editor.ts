import {
  beatEditorBpm, beatEditorSteps, defaultPracticeVolume, drumTracks, makePracticeDrumPattern,
  readSavedPracticeBeat, savePracticeBeat, type DrumTrack
} from "./beat-pattern";
import {
  backingPatterns, playPracticeBacking, practiceBackingVolume, stopPracticeBacking,
  updatePracticeBackingVolume, type DrumPlaybackOwner
} from "./engine";
import { requireElement } from "../dom";

export function setupBeatEditor(container: HTMLElement) {
  container.innerHTML = `
    <p class="beat-instruction">點格子加減鼓點，再播放看看同一個動作怎樣回應。每拍四格，共四拍。</p>
    <div class="beat-grid" role="group" aria-label="節拍編輯格"></div>
    <div class="beat-controls">
      <button type="button" class="backing-play" data-beat-play>播放節拍</button>
      <label class="backing-tempo">
        <span>速度 <b><output></output> BPM</b></span>
        <input type="range" min="${beatEditorBpm.min}" max="${beatEditorBpm.max}" step="1" aria-label="節拍速度（BPM）">
      </label>
      <label class="backing-tempo">
        <span>音量 <b><output data-beat-volume-label>80</output>%</b></span>
        <input type="range" min="0" max="100" step="1" value="80" data-beat-volume aria-label="節拍音量">
      </label>
      <button type="button" class="plain-button" data-beat-preset>還原預設</button>
      <button type="button" class="plain-button" data-beat-clear>清空</button>
      <button type="button" class="plain-button" data-beat-save>存成我的節拍</button>
    </div>
    <p class="beat-status" role="status"></p>`;

  const board = requireElement<HTMLElement>(container, ".beat-grid");
  const play = requireElement<HTMLButtonElement>(container, "[data-beat-play]");
  const tempo = requireElement<HTMLInputElement>(container, 'input[type="range"]');
  const readout = requireElement<HTMLOutputElement>(container, "output");
  const volume = requireElement<HTMLInputElement>(container, "[data-beat-volume]");
  const volumeReadout = requireElement<HTMLOutputElement>(container, "[data-beat-volume-label]");
  const status = requireElement<HTMLElement>(container, ".beat-status");
  const saved = readSavedPracticeBeat();
  let pattern = saved?.pattern ?? makePracticeDrumPattern(true);
  let playing = false;
  let currentStep = -1;
  let playheadTimer: number | undefined;

  const cells: { button: HTMLButtonElement; id: DrumTrack; step: number }[] = [];
  const columns = Array.from({ length: beatEditorSteps }, (): HTMLButtonElement[] => []);
  for (let beat = 0; beat < beatEditorSteps / 4; beat++) {
    const group = document.createElement("fieldset");
    group.className = "beat-group";
    const legend = document.createElement("legend");
    legend.textContent = `第 ${beat + 1} 拍`;
    group.append(legend);
    for (const { id, label } of drumTracks) {
      const row = document.createElement("div");
      row.className = "beat-track";
      row.dataset.track = id;
      const name = document.createElement("span");
      name.textContent = label;
      row.append(name);
      for (let subdivision = 0; subdivision < 4; subdivision++) {
        const step = beat * 4 + subdivision;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "beat-cell";
        button.setAttribute("aria-label", `${label}，第 ${beat + 1} 拍第 ${subdivision + 1} 格`);
        row.append(button);
        cells.push({ button, id, step });
        columns[step].push(button);
        button.addEventListener("click", () => {
          const steps = pattern[id];
          const index = steps.indexOf(step);
          if (index === -1) steps.push(step);
          else steps.splice(index, 1);
          drawCells();
          status.textContent = "";
        });
      }
      group.append(row);
    }
    board.append(group);
  }

  function drawCells() {
    for (const { button, id, step } of cells) {
      button.setAttribute("aria-pressed", String(pattern[id].includes(step)));
    }
  }

  function setTempo(bpm: number) {
    tempo.value = String(bpm);
    readout.value = tempo.value;
  }

  function markStep(step: number) {
    columns[currentStep]?.forEach(button => button.classList.remove("is-current"));
    columns[step]?.forEach(button => button.classList.add("is-current"));
    currentStep = step;
  }

  const owner: DrumPlaybackOwner = {
    stepCount: beatEditorSteps,
    preset: () => "drums",
    pattern: () => pattern,
    bpm: () => tempo.valueAsNumber,
    outputGain: () => practiceBackingVolume(volume.valueAsNumber),
    drumsOn: () => true,
    bassOn: () => false,
    schedulePlayhead(step, delay) {
      clearTimeout(playheadTimer);
      playheadTimer = setTimeout(() => markStep(step), Math.max(0, delay * 1000));
    },
    setPlaying(isPlaying) {
      playing = isPlaying;
      play.textContent = playing ? "停止節拍" : "播放節拍";
      play.classList.toggle("is-playing", playing);
      if (!playing) {
        clearTimeout(playheadTimer);
        markStep(-1);
      }
    },
    showError() {
      status.textContent = "節拍未能播放。請再按一次。";
    }
  };

  tempo.addEventListener("input", () => {
    readout.value = tempo.value;
    status.textContent = "";
  });
  volume.addEventListener("input", () => {
    volumeReadout.value = volume.value;
    updatePracticeBackingVolume(owner);
  });
  play.addEventListener("click", () => {
    if (playing) stopPracticeBacking(owner);
    else {
      status.textContent = "";
      playPracticeBacking(owner);
    }
  });
  requireElement<HTMLButtonElement>(container, "[data-beat-preset]").addEventListener("click", () => {
    pattern = makePracticeDrumPattern(true);
    setTempo(backingPatterns.drums.bpm);
    drawCells();
    status.textContent = "已還原 Hip-hop 預設鼓型。";
  });
  requireElement<HTMLButtonElement>(container, "[data-beat-clear]").addEventListener("click", () => {
    pattern = makePracticeDrumPattern(false);
    drawCells();
    status.textContent = "已清空鼓點。";
  });
  requireElement<HTMLButtonElement>(container, "[data-beat-save]").addEventListener("click", () => {
    const saved = savePracticeBeat({ bpm: tempo.valueAsNumber, volume: volume.valueAsNumber, pattern });
    status.textContent = saved ? "已儲存到這個瀏覽器的「我的節拍」。" : "這個瀏覽器無法儲存節拍。";
  });

  const panel = container.closest("details");
  panel?.addEventListener("toggle", () => {
    if (!panel.open) stopPracticeBacking(owner);
  });
  if (panel && location.hash === `#${panel.id}`) panel.open = true;
  setTempo(saved?.bpm ?? backingPatterns.drums.bpm);
  volume.value = String(saved?.volume ?? defaultPracticeVolume);
  volumeReadout.value = volume.value;
  drawCells();
  if (saved) status.textContent = "已載入「我的節拍」。";
}
