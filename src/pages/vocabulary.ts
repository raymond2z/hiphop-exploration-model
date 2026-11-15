import "../practice/vocabulary-practice";
import { mountAudioTools } from "../audio";
import { requireElement } from "../dom";

const search = requireElement<HTMLInputElement>(document, "#step-search");
const count = requireElement<HTMLElement>(document, "#step-count");
const steps = document.querySelectorAll<HTMLLIElement>(".vocabulary-steps li");
const normalizeStep = (value: string) => value.toLowerCase().replace(/[\s-]+/g, "");

function filterSteps() {
  const term = normalizeStep(search.value);
  let matches = 0;
  for (const step of steps) {
    const names = [step.textContent ?? "", step.dataset.alternate ?? ""];
    const visible = names.some(name => normalizeStep(name).includes(term));
    step.hidden = !visible;
    if (visible) matches++;
  }
  count.textContent = matches ? `${matches} 個動作` : "找不到符合的動作。";
}

search.addEventListener("input", filterSteps);
requireElement<HTMLElement>(document, ".vocabulary-search").hidden = false;
filterSteps();

mountAudioTools();
