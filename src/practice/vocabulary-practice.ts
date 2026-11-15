import { requireElement } from "../dom";

function makeStepDeck(names: string[]) {
  let remaining: string[] = [];
  let last: string | undefined;

  return function drawStep() {
    if (!remaining.length) {
      remaining = [...names];
      for (let index = remaining.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [remaining[index], remaining[other]] = [remaining[other], remaining[index]];
      }
      const tail = remaining.length - 1;
      if (tail > 0 && remaining[tail] === last) {
        [remaining[tail], remaining[0]] = [remaining[0], remaining[tail]];
      }
    }
    last = remaining.pop();
    return { name: last, drawn: names.length - remaining.length, total: names.length };
  };
}

const conditionCards = Object.entries({
  constraint: [
    ["留一拍", "挑一個位置停一拍，再接回熟悉的跳法。"],
    ["提早或延後半拍", "只改其中一下的時機，其他落點照原來的方式。"],
    ["縮小幅度", "試把動作縮到大約一半，保留原來的節奏。"],
    ["留在原地", "把移動收在原地，用重心轉移呈現同一個動作。"]
  ],
  style: [
    ["鬆弛", "試讓動作之間接得更柔和，看看有甚麼感覺。"],
    ["俐落", "挑一下讓動作停得清楚，其他地方維持原來的跳法。"],
    ["俏皮", "選一個瞬間加點出其不意的表情或動作，自己決定放在哪。"],
    ["沉穩", "讓其中一次重心轉移更紮實，感受動作的重量。"]
  ],
  body: [
    ["頭部", "保留原來的腳步，選一拍用小幅點頭或轉向回應。"],
    ["肩膀", "挑一個位置讓肩膀先動，看看其他部位怎樣接上。"],
    ["胸口", "選一拍讓胸口帶出重音，其他地方保留原來的節奏。"],
    ["手臂", "保留腳步與重心，試讓手臂走一條新的路徑。"],
    ["膝蓋", "用膝蓋的小幅彎伸改變彈性，保留步伐的節奏。"]
  ],
  level: [
    ["上層", "讓重心保持較高，從舒服的站姿跳出動作。"],
    ["中層", "微彎膝與髖，把重心降到中位，試保留原來的律動。"],
    ["地板層", "把重心帶到靠近地面的低位，用熟悉的支撐方式試一小段。"]
  ]
}).flatMap(([category, cards]) => cards.map(([title, cue], index) => ({
  category, title, cue, id: `${category}-${index}`
})));

const moveNames = [...document.querySelectorAll(".vocabulary-steps li")].map(item => (item.textContent ?? "").trim());
const drawStep = makeStepDeck(moveNames);
const drawMove = requireElement<HTMLButtonElement>(document, "#draw-move");
const moveName = requireElement<HTMLElement>(document, "#draw-move-name");
const drawProgress = requireElement<HTMLElement>(document, "#draw-progress");
const moveObservation = requireElement<HTMLFormElement>(document, "#move-observation");
const variationObservation = requireElement<HTMLFormElement>(document, "#variation-observation");
const drawControls = requireElement<HTMLElement>(document, "#draw-controls");
const conditionChooser = requireElement<HTMLDetailsElement>(document, "#condition-chooser");
const categorySelect = requireElement<HTMLSelectElement>(document, "#condition-category");
const cardSelect = requireElement<HTMLSelectElement>(document, "#condition-option");
const conditionTitle = requireElement<HTMLElement>(document, "#draw-condition-title");
const conditionCue = requireElement<HTMLElement>(document, "#draw-condition-cue");
const categoryLabels = new Map([...categorySelect.options].map(option => [option.value, option.text]));
type ConditionCard = (typeof conditionCards)[number];
let currentCondition: ConditionCard | undefined;

function availableCards() {
  return categorySelect.value === "all"
    ? conditionCards
    : conditionCards.filter(card => card.category === categorySelect.value);
}

function updateCardChoices() {
  cardSelect.replaceChildren(...availableCards().map(card =>
    new Option(categorySelect.value === "all" ? `${categoryLabels.get(card.category)} · ${card.title}` : card.title, card.id)
  ));
}

function showCondition(card: ConditionCard) {
  currentCondition = card;
  conditionTitle.textContent = `${categoryLabels.get(card.category)} · ${card.title}`;
  conditionCue.textContent = card.cue;
  variationObservation.reset();
  variationObservation.hidden = false;
}

drawMove.addEventListener("click", () => {
  const { name, drawn, total } = drawStep();
  if (!name) return;
  moveName.textContent = name;
  drawMove.textContent = "抽下一個動作";
  drawProgress.textContent = drawn === total ? "本輪抽完，下次重新洗牌。" : `本輪已抽 ${drawn}／${total}`;
  moveObservation.reset();
  moveObservation.hidden = false;
  drawControls.hidden = false;
  conditionChooser.open = false;
  variationObservation.reset();
  variationObservation.hidden = true;
  currentCondition = undefined;
  conditionTitle.textContent = "跳完原來的版本，再加一個條件。";
  conditionCue.textContent = "";
});

categorySelect.addEventListener("change", updateCardChoices);
requireElement<HTMLButtonElement>(document, "#draw-condition-button").addEventListener("click", () => {
  const candidates = availableCards().filter(card => card !== currentCondition);
  if (candidates.length) showCondition(candidates[Math.floor(Math.random() * candidates.length)]);
});
requireElement<HTMLButtonElement>(document, "#apply-condition").addEventListener("click", () => {
  const card = conditionCards.find(card => card.id === cardSelect.value);
  if (card) showCondition(card);
});

updateCardChoices();
requireElement<HTMLElement>(document, "#card-practice").hidden = !moveNames.length;
