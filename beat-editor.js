const beatEditorTracks = [
  { id: "kick", label: "踢鼓" },
  { id: "snare", label: "小鼓" },
  { id: "hat", label: "Hi-hat" }
];
const beatEditorSteps = 16;
const beatEditorBpm = { min: 60, max: 130 };
const beatEditorStorageKey = "hiphop-exploration.my-beat.v1";

function makePracticeDrumPattern(usePreset) {
  return Object.fromEntries(beatEditorTracks.map(({ id }) => [
    id,
    usePreset ? drumSteps[id].filter(step => step < beatEditorSteps) : []
  ]));
}

function readSavedPracticeBeat() {
  try {
    const stored = JSON.parse(localStorage.getItem(beatEditorStorageKey));
    if (!stored || !Number.isInteger(stored.bpm)
      || stored.bpm < beatEditorBpm.min || stored.bpm > beatEditorBpm.max) return null;
    const tracks = beatEditorTracks.map(({ id }) => stored.pattern?.[id]);
    const valid = tracks.every(steps => Array.isArray(steps)
      && steps.every(step => Number.isInteger(step) && step >= 0 && step < beatEditorSteps));
    if (!valid) return null;
    return {
      bpm: stored.bpm,
      pattern: Object.fromEntries(beatEditorTracks.map(({ id }, index) => [id, [...new Set(tracks[index])]]))
    };
  } catch {
    return null;
  }
}

function setupBeatEditor(container) {
  container.innerHTML = `
    <p class="beat-instruction">點格子加減鼓點，再播放看看同一個動作怎樣回應。每拍四格，共四拍。</p>
    <div class="beat-grid" role="group" aria-label="節拍編輯格"></div>
    <div class="beat-controls">
      <button type="button" class="backing-play" data-beat-play>播放節拍</button>
      <label class="backing-tempo">
        <span>速度 <b><output></output> BPM</b></span>
        <input type="range" min="${beatEditorBpm.min}" max="${beatEditorBpm.max}" step="1" aria-label="節拍速度（BPM）">
      </label>
      <button type="button" class="plain-button" data-beat-preset>還原預設</button>
      <button type="button" class="plain-button" data-beat-clear>清空</button>
      <button type="button" class="plain-button" data-beat-save>存成我的節拍</button>
    </div>
    <p class="beat-status" role="status"></p>`;

  const board = container.querySelector(".beat-grid");
  const play = container.querySelector("[data-beat-play]");
  const tempo = container.querySelector('input[type="range"]');
  const readout = container.querySelector("output");
  const status = container.querySelector(".beat-status");
  const saved = readSavedPracticeBeat();
  let pattern = saved?.pattern ?? makePracticeDrumPattern(true);
  let playing = false;
  let currentStep = -1;
  let playheadTimer;

  const cells = [];
  const columns = Array.from({ length: beatEditorSteps }, () => []);
  for (let beat = 0; beat < beatEditorSteps / 4; beat++) {
    const group = document.createElement("fieldset");
    group.className = "beat-group";
    const legend = document.createElement("legend");
    legend.textContent = `第 ${beat + 1} 拍`;
    group.append(legend);
    for (const { id, label } of beatEditorTracks) {
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

  function setTempo(bpm) {
    tempo.value = bpm;
    readout.value = tempo.value;
  }

  function markStep(step) {
    columns[currentStep]?.forEach(button => button.classList.remove("is-current"));
    columns[step]?.forEach(button => button.classList.add("is-current"));
    currentStep = step;
  }

  const owner = {
    stepCount: beatEditorSteps,
    preset: () => "drums",
    pattern: () => pattern,
    bpm: () => tempo.valueAsNumber,
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
  play.addEventListener("click", () => {
    if (playing) stopPracticeBacking(owner);
    else {
      status.textContent = "";
      playPracticeBacking(owner);
    }
  });
  container.querySelector("[data-beat-preset]").addEventListener("click", () => {
    pattern = makePracticeDrumPattern(true);
    setTempo(backingPatterns.drums.bpm);
    drawCells();
    status.textContent = "已還原 Hip-hop 預設鼓型。";
  });
  container.querySelector("[data-beat-clear]").addEventListener("click", () => {
    pattern = makePracticeDrumPattern(false);
    drawCells();
    status.textContent = "已清空鼓點。";
  });
  container.querySelector("[data-beat-save]").addEventListener("click", () => {
    try {
      localStorage.setItem(beatEditorStorageKey, JSON.stringify({ bpm: tempo.valueAsNumber, pattern }));
      status.textContent = "已儲存到這個瀏覽器的「我的節拍」。";
    } catch {
      status.textContent = "這個瀏覽器無法儲存節拍。";
    }
  });

  const panel = container.closest("details");
  panel?.addEventListener("toggle", () => {
    if (!panel.open) stopPracticeBacking(owner);
  });
  if (panel && location.hash === `#${panel.id}`) panel.open = true;
  setTempo(saved?.bpm ?? backingPatterns.drums.bpm);
  drawCells();
  if (saved) status.textContent = "已載入「我的節拍」。";
}

document.querySelectorAll("[data-beat-editor]").forEach(setupBeatEditor);
