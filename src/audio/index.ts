import { setupBeatEditor } from "./beat-editor";
import { setupClipMixer } from "./clip-mixer";

export function mountAudioTools() {
  document.querySelectorAll<HTMLElement>("[data-beat-editor]").forEach(setupBeatEditor);
  document.querySelectorAll<HTMLElement>("[data-clip-mixer]").forEach(setupClipMixer);
}
