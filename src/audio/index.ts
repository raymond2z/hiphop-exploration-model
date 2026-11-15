import { setupBeatEditor } from "./beat-editor";
import { setupClipMixer } from "./clip-mixer";

export { setupPracticeBacking } from "./practice-backing";
export { stopPracticeBacking } from "./engine";

function mountAudioTools() {
  document.querySelectorAll<HTMLElement>("[data-beat-editor]").forEach(setupBeatEditor);
  document.querySelectorAll<HTMLElement>("[data-clip-mixer]").forEach(setupClipMixer);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAudioTools, { once: true });
} else {
  mountAudioTools();
}
