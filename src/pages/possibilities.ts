import { setupElementExploration } from "../practice/element-exploration";
import { requireElement } from "../dom";

const workshopPlayer = requireElement<HTMLAudioElement>(document, "#workshop-player");
const workshopSong = requireElement<HTMLInputElement>(document, "#workshop-song");
const workshopAudioStatus = requireElement<HTMLElement>(document, "#workshop-audio-status");
let workshopUrl: string | undefined;

workshopSong.addEventListener("change", () => {
  const file = workshopSong.files?.[0];
  if (!file) return;
  workshopPlayer.pause();
  if (workshopUrl) URL.revokeObjectURL(workshopUrl);
  workshopUrl = URL.createObjectURL(file);
  workshopPlayer.src = workshopUrl;
  workshopPlayer.hidden = false;
  workshopAudioStatus.textContent = "已選擇音樂。想聽時按播放。";
});
workshopPlayer.addEventListener("error", () => {
  workshopAudioStatus.textContent = "瀏覽器無法播放這個檔案，可以換另一個音樂檔。";
});
setupElementExploration({
  controls: requireElement<HTMLElement>(document, "#workshop-audio-controls"),
  audioHome: requireElement<HTMLElement>(document, "#workshop-audio-home"),
  player: workshopPlayer,
  listen: () => { location.href = "index.html?listen=1#entry"; }
});
