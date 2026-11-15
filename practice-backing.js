const backingPatterns = {
  pulse: { name: "穩定拍點", bpm: 76 },
  drums: { name: "Hip-hop 鼓循環", bpm: 88 },
  layers: { name: "鼓＋低音", bpm: 88 }
};

const drumSteps = {
  kick: [0, 6, 10, 16, 22, 26, 30],
  snare: [4, 12, 20, 28],
  hat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 23, 24, 26, 28, 29, 30]
};
const bassNotes = new Map([
  [16, { frequency: 65.41, beats: 1.35 }],
  [22, { frequency: 49, beats: 0.65 }],
  [26, { frequency: 58.27, beats: 0.85 }],
  [30, { frequency: 65.41, beats: 0.44 }]
]);

let backingContext;
let backingNoise;
let activeBacking;

function stopPracticeBacking(owner) {
  if (!activeBacking || (owner && activeBacking.owner !== owner)) return;
  const playback = activeBacking;
  activeBacking = null;
  clearInterval(playback.timer);
  playback.output?.disconnect();
  playback.limiter?.disconnect();
  playback.owner.setPlaying(false);
}

function backingTone(output, time, { frequency, endFrequency, duration, volume, type }) {
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

function backingPercussion(output, time, { frequency, duration, volume, type }) {
  const context = output.context;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const envelope = context.createGain();
  source.buffer = backingNoise;
  filter.type = type;
  filter.frequency.value = frequency;
  envelope.gain.setValueAtTime(volume, time);
  envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);
  source.connect(filter).connect(envelope).connect(output);
  source.start(time);
  source.stop(time + duration + 0.01);
}

function scheduleDrumStep(drums, drumPattern, step, time, stepSeconds) {
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

function scheduleBackingStep(playback, step, time, stepSeconds) {
  const { owner, drums, bass } = playback;
  if (owner.scheduleClipStep) {
    owner.scheduleClipStep(playback, step, time, stepSeconds);
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

function updateBackingMix({ owner, drums, bass }) {
  const time = drums.context.currentTime;
  drums.gain.setTargetAtTime(Number(owner.drumsOn()), time, 0.012);
  bass.gain.setTargetAtTime(Number(owner.bassOn()), time, 0.012);
}

function practiceBackingVolume(percent) {
  return percent / 100 * 1.35;
}

function updatePracticeBackingVolume(owner) {
  const output = activeBacking?.owner === owner && activeBacking.output;
  if (output) output.gain.setTargetAtTime(owner.outputGain(), output.context.currentTime, 0.012);
}

async function playPracticeBacking(owner) {
  stopPracticeBacking();
  for (const audio of document.querySelectorAll("audio[data-practice-audio]")) audio.pause();

  const playback = { owner };
  activeBacking = playback;
  owner.setPlaying(true);

  try {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
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
    playback.drums = context.createGain();
    playback.drums.gain.value = Number(owner.drumsOn());
    playback.drums.connect(playback.output);
    playback.bass = context.createGain();
    playback.bass.gain.value = Number(owner.bassOn());
    playback.bass.connect(playback.output);

    let step = 0;
    const stepCount = owner.stepCount ?? 32;
    let nextTime = context.currentTime + 0.04;
    function schedule() {
      const now = context.currentTime;
      if (nextTime < now) nextTime = now + 0.02;
      while (nextTime < now + 0.1) {
        const stepSeconds = 15 / owner.bpm();
        scheduleBackingStep(playback, step, nextTime, stepSeconds);
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

function setupPracticeBacking(container) {
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

  const button = container.querySelector(".backing-play");
  const preset = container.querySelector("select");
  const tempo = container.querySelector("input[type=range]");
  const readout = container.querySelector("output");
  const layers = container.querySelector(".backing-layers");
  const drums = container.querySelector('[data-layer="drums"]');
  const bass = container.querySelector('[data-layer="bass"]');
  const error = container.querySelector(".backing-error");
  const owner = {
    preset: () => preset.value,
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

  function setPreset(value) {
    stopPracticeBacking(owner);
    preset.value = value;
    tempo.value = backingPatterns[value].bpm;
    readout.value = tempo.value;
    layers.hidden = value !== "layers";
    drums.checked = true;
    bass.checked = true;
  }

  preset.closest("label").hidden = container.hasAttribute("data-fixed");
  setPreset(container.dataset.preset ?? "drums");
  preset.addEventListener("change", () => {
    const wasPlaying = activeBacking?.owner === owner;
    setPreset(preset.value);
    if (wasPlaying) playPracticeBacking(owner);
  });
  tempo.addEventListener("input", () => { readout.value = tempo.value; });
  for (const layer of [drums, bass]) {
    layer.addEventListener("change", () => {
      if (activeBacking?.owner === owner && activeBacking.output) updateBackingMix(activeBacking);
    });
  }
  button.addEventListener("click", () => {
    if (activeBacking?.owner === owner) stopPracticeBacking(owner);
    else playPracticeBacking(owner);
  });

  return { setPreset, stop: () => stopPracticeBacking(owner) };
}

document.addEventListener("play", event => {
  if (event.target.matches?.("audio[data-practice-audio]") && !event.target.paused) stopPracticeBacking();
}, true);
window.addEventListener("pagehide", () => stopPracticeBacking());
