import { mountAudioTools } from "../audio";
import { stopPracticeBacking } from "../audio/engine";
import { setupPracticeBacking } from "../audio/practice-backing";
import { setupElementExploration } from "../practice/element-exploration";
import { requireElement } from "../dom";

const cases: Record<string, readonly [string, string, string, string, string]> = {
  texture: [
    "同一段音樂裡，孩子的 Groove 很流暢，但想跳得更沉時，常只是把動作做大。",
    "同一段音樂、同一個 Groove、相近幅度。試兩次，一次停頓短，一次停頓長。再比較身體的重量感。",
    "讓孩子選擇先自己試或跟你並排跳。兩個版本跳完後，她可以挑喜歡的一個，也可以提出第三種做法。",
    "看一小段有舞者與場合資訊的 Freestyle。留意舞者是跟隨聲音的質感，還是用反差作出回應。",
    "問「哪一下有你要的感覺？」若兩個版本的差異不清楚，下次可先放慢速度或只留一個部位。"
  ],
  pulse: [
    "孩子跟某些鼓聲點頭，做成踏步時腳步開始忽快忽慢。",
    "先試節奏清楚的一小段。腳踏均勻的脈動，再試用手拍一類鼓聲，觀察加上手拍後腳步怎樣改變。",
    "讓孩子選點頭、手指輕敲或踏步作為起點。一次加一項動作，卡住時回到已能維持的條件。",
    "試聽熟悉的 Hip-hop 音樂，換一段由孩子選的歌，觀察 Groove 怎樣隨聲音層次或樂句而改變。",
    "比較點頭、踏步與加手拍三種情況。哪個條件下脈動最穩？可把那個方法帶到另一首歌試試。"
  ],
  balance: [
    "孩子做靜止 Pose 時很穩定，但一開始轉向，腳步就急著補位。",
    "在小幅度的重心轉移裡，試一次停穩後再跨步，再試一次先蓄勢才跨步。留意哪隻腳在支撐。",
    "讓孩子選方向和幅度。需要時減少轉身角度，先找到可以控制的重心變化。",
    "看一段舞者在 Groove 中停住又移動的片段，記下停頓、朝向和音樂的關係。",
    "旁觀者說出他從哪一刻開始預期移動。舞者說出自己何時把重量移到另一隻腳。"
  ],
  pose: [
    "一個 Pose 引起兩種解讀，有人感覺是在邀請，有人感覺是在等待。",
    "保留同一個 Pose，先看向同伴，再看向地面。感受視線如何改變你對這個姿勢的理解。",
    "孩子可以先保留自己的意圖。讓同伴描述看見的細節，再由孩子決定要不要分享自己在想什麼。",
    "觀看一段 Battle 或 Cypher，留意同一個停頓或眼神，如何隨音樂、對象與場合而被理解。",
    "把「我看見她轉向同伴」和「我覺得她在邀請」分開。再試一次，看看改了哪個細節會讓感受不同。"
  ],
  cypher: [
    "孩子能持續 Freestyle，兩人輪流跳時，各自完成一段，動作之間很少接續。",
    "選同伴上一段的一個停頓、方向或節奏。可以借用它再加一個變化，也可以用另一種質感回應。",
    "先讓孩子選擇觀看、並排試或輪流跳。開跳前可以一起約定怎樣進出和何時換人。",
    "看一小段有脈絡的 Cypher。留意圈內外的人怎樣接住音樂、讓出空間，以及用身體回應彼此。",
    "彼此說出接到的是哪個動作或聲音。若想再試，可以用同一首歌交換先後順序。"
  ],
  initiative: [
    "孩子跳到一個重點動作前，把原本要伸出的手收回來。先問她想要輕輕帶過，還是想讓那一下更突出。",
    "同一首歌、同一個熟悉動作，試一個變化。可以選幅度、質感、時機或視線。",
    "讓孩子自己選要試什麼，以及想不想分享。觀察她是在單做、連起來，還是在被觀看時改變做法。",
    "輪流跳時，可以用小動作、停頓或清楚的方向先提出一個想法，看看同伴怎麼接。",
    "先問她做出來的感覺是否接近想法，再說你看到的細節。下一輪讓她自己決定是否使用這個變化。"
  ],
  habit: [
    "她能把編排跳得很順，轉到自由跳就幾次用同一組動作開場。可先問她是否喜歡這個開場，以及如果想改，她最想改哪一拍。",
    "保留兩個熟悉動作。第一遍照平常跳，第二遍只改一項，例如推遲第二個動作或換方向。再試一次自由跳，看是否想把變化留下。",
    "提供一個可開始的限制，讓她決定改哪一項。她也能保留原版，說明它適合什麼音樂或情境。",
    "選一段 Freestyle，看看舞者如何在不同聲音或與人輪流時，再用一次相近的動作，或讓相同動作在下一次出現時有變化。",
    "先比較兩版哪裡不同。下一次換一段歌，由她自己找一處可以保留、重組或改變的地方。"
  ],
  confidence: [
    "她自己跳時願意試不同質感，有同伴看時就縮回熟悉的做法。也可能是環境、注意力或她對展示的意願有變化。",
    "用同一段歌和同一個 Groove，試兩個低負擔的選擇，例如加一次停頓，或縮小動作但把重心轉清楚。",
    "讓她自己選獨跳、並排跳或小組輪流。問哪個條件讓她想嘗試，不用把第二次安排成必須展示。",
    "跟她一起看一段交流片段，找一個很小但讓對方接得住的停頓、眼神或動作，留意不同表達方式如何被接住。",
    "先描述她做了什麼選擇，再由她自己說感受。用她願意嘗試和能自主作決定的情境理解進展。"
  ],
  plateau: [
    "她在熟悉的歌裡能維持 Groove，換歌時先等提示。可以分開看看，她能否找到規律、維持動作，以及同時作選擇。",
    "用同一個 Groove 比較熟悉與陌生的片段。若換歌就亂，先試點頭，再做小幅 Bounce。每次只改歌、動作幅度或一項任務。",
    "讓她先猜會卡在哪裡，再試看看。能穩定時可自行加一個變化，卡住時可調低難度或暫停。",
    "帶同一個 Groove 到另一種音樂情境，留意聲音層次怎樣改變你想接的節奏或質感。",
    "記下哪個條件做得穩、哪個仍要提示。用「換歌後我還能做什麼」和「我能自己調整什麼」決定下一步。"
  ],
  choice: [
    "可以自己練的時候，她常等大人指定歌曲和動作。問她今天更想聽歌、試變化，還是跟人交流。",
    "她若想探索，可以選熟悉動作加一個變化，或把一個新動作拆成容易做的小部分。試完由她決定要不要再做一次。",
    "大人提供可行的選項和場地界線。孩子可以改變主意。若已跟同伴約好輪流，告訴同伴自己想改成觀看，讓對方安排下一輪。",
    "在同伴交流時，可以選觀看、回應或發起。一起約好等待、讓出空間和換人的方式。",
    "如果她願意回顧，可以問「哪個決定是你自己想做的？下次想怎樣安排？」只聽音樂時可以直接享受，不需要回顧。"
  ],
  daily: [
    "一段對話、一個環境聲音或當天的心情，讓孩子想到某種速度、重量或節奏。",
    "選一個熟悉的 Groove，用快慢、力道或停頓中的一項做兩個短版本。可以只留一個片刻，不必構成完整舞段。",
    "由她挑選想探索的感受，也可以跳完就讓它過去。若想分享，可邀請同伴說看到哪個動作細節。",
    "把這個動作想法帶到一首喜歡的歌中，看看哪些聲音或段落能接住它。也可以在輪流跳時試它如何被回應。",
    "先問她跳出來的感受是否接近原本的想法。若別人讀到其他意思，可以比較他們是從哪些細節看出來的。"
  ]
};

const routes = [...document.querySelectorAll<HTMLElement>("[data-route]")];
const player = requireElement<HTMLAudioElement>(document, "#player");
const song = requireElement<HTMLInputElement>(document, "#song");
const musicStatus = requireElement<HTMLElement>(document, "#music-status");
setupPracticeBacking(requireElement<HTMLElement>(document, "#listen-backing"));
let audioUrl: string | undefined;

function chooseRoute(name: string | undefined) {
  stopPracticeBacking();
  for (const button of routes) {
    const selected = button.dataset.route === name;
    button.setAttribute("aria-pressed", String(selected));
    const panelId = button.getAttribute("aria-controls");
    if (panelId) requireElement<HTMLElement>(document, "#" + panelId).hidden = !selected;
  }
  if (name !== "music") player.pause();
}

const firstSound = requireElement<HTMLSelectElement>(document, "#decision-first");
const nextSound = requireElement<HTMLSelectElement>(document, "#decision-next");
const switchMoment = requireElement<HTMLSelectElement>(document, "#decision-when");
const decisionSource = requireElement<HTMLSelectElement>(document, "#decision-source");
const decisionBackingPanel = requireElement<HTMLElement>(document, "#decision-backing-panel");
const decisionOwnNote = requireElement<HTMLElement>(document, "#decision-own-note");
const decisionBacking = setupPracticeBacking(requireElement<HTMLElement>(document, "#decision-backing"));

function showDecisionOptions(field: HTMLSelectElement, available: (option: HTMLOptionElement) => boolean) {
  for (const option of field.options) {
    option.hidden = option.disabled = !available(option);
  }
  if (field.selectedOptions[0]?.disabled ?? true) {
    field.value = [...field.options].find(option => !option.disabled)?.value ?? "";
  }
}

function updateDecisionPractice() {
  const useBacking = decisionSource.value === "backing";
  const soundAvailable = (option: HTMLOptionElement) => !useBacking || !option.hasAttribute("data-own-track");
  showDecisionOptions(firstSound, soundAvailable);
  showDecisionOptions(nextSound, option => soundAvailable(option) && option.value !== firstSound.value);
  showDecisionOptions(switchMoment, option => {
    const cue = option.dataset.backing;
    if (cue) return useBacking && (cue === "any" || cue === nextSound.value);
    return soundAvailable(option);
  });

  const first = firstSound.selectedOptions[0].text;
  const next = nextSound.selectedOptions[0].text;
  requireElement<HTMLElement>(document, "#decision-a").textContent = `第一輪只用這個 Groove 回應${first}。`;
  requireElement<HTMLElement>(document, "#decision-b").textContent =
    `第二輪先回應${first}，在${switchMoment.value}改聽${next}。腳步可以保持不變。`;
}

function updateDecisionSource() {
  const useBacking = decisionSource.value === "backing";
  decisionBackingPanel.hidden = !useBacking;
  decisionOwnNote.hidden = useBacking;
  if (!useBacking) decisionBacking.stop();
  switchMoment.selectedIndex = useBacking ? 0 : 2;
  updateDecisionPractice();
}

for (const field of [firstSound, nextSound, switchMoment]) {
  field.addEventListener("change", updateDecisionPractice);
}
decisionSource.addEventListener("change", updateDecisionSource);
updateDecisionSource();

for (const button of routes) button.addEventListener("click", () => chooseRoute(button.dataset.route));
for (const link of document.querySelectorAll<HTMLElement>("[data-choose]")) {
  link.addEventListener("click", () => chooseRoute(link.dataset.choose));
}

if (new URLSearchParams(location.search).get("listen") === "1") chooseRoute("music");

song.addEventListener("change", () => {
  const file = song.files?.[0];
  if (!file) return;
  player.pause();
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(file);
  player.src = audioUrl;
  player.hidden = false;
  musicStatus.textContent = "已選擇音樂。想聽的時候按播放。";
});
player.addEventListener("error", () => {
  musicStatus.textContent = "瀏覽器無法播放這個檔案。可以換另一個音樂檔，或用你喜歡的播放器。";
});

const caseSelect = requireElement<HTMLSelectElement>(document, "#case-select");
const casePanel = requireElement<HTMLElement>(document, "#case-panel");
const caseGuidance = requireElement<HTMLElement>(document, "#case-guidance");
const caseLenses = requireElement<HTMLDetailsElement>(document, "#case-lenses");
const guidanceArticles = [...caseGuidance.querySelectorAll<HTMLElement>(".guidance")];
const practice = requireElement<HTMLDialogElement>(document, "#practice");
const practiceArticles = [...practice.querySelectorAll("article")];
const musicControls = requireElement<HTMLElement>(document, "#music-controls");
const musicHome = requireElement<HTMLElement>(document, "#music-home");
const practiceMusic = requireElement<HTMLElement>(document, "#practice-music");
const practiceAudio = requireElement<HTMLDetailsElement>(document, ".practice-audio");
const practiceListen = requireElement<HTMLElement>(document, "#practice-listen");
const openPractice = requireElement<HTMLButtonElement>(document, "#open-practice");
const initiativeChoice = requireElement<HTMLSelectElement>(document, "#initiative-choice");
const initiativePrompt = requireElement<HTMLElement>(document, "#initiative-prompt");
const initiativePrompts: Record<string, string> = {
  timing: "照平常跳一次。第二次由你選在哪一拍開始。",
  size: "想做大一點還是小一點？試著做到你原本想停的位置。",
  texture: "用同一個動作試兩次。一次放鬆，一次試試帶一點彈性。",
  focus: "挑一個你想讓我留意的片刻。可以停一下，也可以選一個方向。",
  exchange: "由你先出一個動作，我用動作回應。然後你決定要怎樣接下去。",
  attitude: "用同一個動作試兩種感覺。一次冷靜，一次直接。你想用哪一版？"
};

initiativeChoice.addEventListener("change", () => {
  initiativePrompt.textContent = initiativePrompts[initiativeChoice.value] ?? "";
});

openPractice.addEventListener("click", () => {
  const practiceArticle = document.getElementById("practice-" + caseSelect.value);
  if (!practiceArticle) return;

  stopPracticeBacking();
  for (const article of practiceArticles) article.hidden = article !== practiceArticle;
  const title = requireElement<HTMLHeadingElement>(practiceArticle, "h2");
  practice.setAttribute("aria-labelledby", title.id);
  practiceMusic.append(musicControls);
  practiceAudio.open = Boolean(audioUrl);
  practice.showModal();
  title.focus();
});

practiceListen.addEventListener("click", event => {
  event.preventDefault();
  practice.close("listen");
});

practice.addEventListener("close", () => {
  musicHome.append(musicControls);
  if (practice.returnValue === "listen") {
    chooseRoute("music");
    requireElement<HTMLElement>(document, "#entry").scrollIntoView();
    requireElement<HTMLButtonElement>(document, '[data-route="music"]').focus({ preventScroll: true });
  } else {
    player.pause();
    openPractice.focus({ preventScroll: true });
  }
  practice.returnValue = "";
});
const caseFields = ["observe", "dance", "psych", "culture", "feedback"].map(name => requireElement<HTMLElement>(document, "#case-" + name));
function showCase(name: string | undefined) {
  if (!name || !Object.hasOwn(cases, name)) return;
  const current = cases[name];
  caseSelect.value = name;
  caseFields.forEach((field, index) => { field.textContent = current[index]; });

  const selectedGuidance = document.getElementById("guidance-" + name);
  caseGuidance.hidden = !selectedGuidance;
  for (const article of guidanceArticles) article.hidden = article !== selectedGuidance;
  if (selectedGuidance) {
    caseLenses.open = false;
    caseLenses.append(casePanel);
  } else {
    caseGuidance.after(casePanel);
  }
}
caseSelect.addEventListener("change", () => showCase(caseSelect.value));
for (const link of document.querySelectorAll<HTMLElement>("[data-case]")) {
  link.addEventListener("click", () => showCase(link.dataset.case));
}
const requestedCase = new URLSearchParams(location.search).get("case");
if (requestedCase && Object.hasOwn(cases, requestedCase)) {
  showCase(requestedCase);
  if (!location.hash) {
    requireElement<HTMLElement>(document, "#example").scrollIntoView();
  }
} else {
  showCase(caseSelect.value);
}

let resourceOrigin: string | null = null;
function revealResource(id: string | undefined) {
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  if (target instanceof HTMLDetailsElement) target.open = true;
  target.querySelectorAll<HTMLElement>(".resource-return").forEach(link => { link.hidden = !resourceOrigin; });
}
document.querySelectorAll<HTMLElement>("[data-resource]").forEach(link => {
  link.addEventListener("click", () => {
    resourceOrigin = link.closest(".guidance") ? caseSelect.value : null;
    revealResource(link.dataset.resource);
  });
});
document.querySelectorAll(".resource-return").forEach(link => {
  link.addEventListener("click", () => {
    if (resourceOrigin) showCase(resourceOrigin);
  });
});
window.addEventListener("hashchange", () => revealResource(location.hash.slice(1)));
revealResource(location.hash.slice(1));


setupElementExploration({
  controls: musicControls,
  audioHome: musicHome,
  player,
  listen: () => {
    chooseRoute("music");
    requireElement<HTMLElement>(document, "#entry").scrollIntoView();
    requireElement<HTMLButtonElement>(document, '[data-route="music"]').focus({ preventScroll: true });
  }
});

mountAudioTools();
