const explorationData = {
  "turn": {
    "title": "轉圈",
    "base": "選一個能穩定做的小幅轉向，先照平常的方式轉一次。",
    "question": "怎樣轉，會讓你更想接下一步？",
    "hints": [
      "保留角度和速度。試向左轉，再試向右轉。",
      "保留轉動方向和角度。分別試在同一數拍的前半、後半開始。",
      "保留起點和終點。試連續轉完，再試轉到中間停一下。",
      "保留轉向和腳步。試手貼近身體，再試手稍微向外。"
    ],
    "compare": "哪一版比較容易站穩並接下一步？",
    "note": "先用小幅轉向，暈眩就停下。"
  },
  "weight": {
    "title": "重心轉移",
    "base": "雙腳在原地，選一個熟悉的左右重心轉移。",
    "question": "重量什麼時候到達另一隻腳？",
    "hints": [
      "腳的位置保持不變。試快一點把重量移過去，再試慢慢移過去。",
      "保留一樣的速度。試轉移後立刻回來，再試先留一拍。",
      "保留腳位和節奏。比較多移一點重量，或少移一點重量。"
    ],
    "compare": "哪一版讓你最清楚感到哪隻腳在支撐？",
    "note": "可以扶著穩固的支撐物試小幅度。"
  },
  "direction": {
    "title": "同一步，換方向",
    "base": "選一個熟悉的踏步，保留腳步順序和節奏。",
    "question": "同一步可以往哪裡走？",
    "hints": [
      "用同一踏步向正前方走，再試向斜前方走。",
      "保持身體朝前，試往左側走，再試往右側走。",
      "保留方向和拍子。試只走一步的距離，再試幾乎留在原地。"
    ],
    "compare": "哪個方向最容易保留原來的 Groove？",
    "note": "先確認四周有空位。"
  },
  "connect": {
    "title": "兩個動作之間",
    "base": "選兩個熟悉的動作 A 和 B。每次維持 A → B 的順序。",
    "question": "兩個動作可以怎樣接起來？",
    "hints": [
      "用同一個速度試直接接，再試在 A 末尾留半拍才接。",
      "保持 B 的起點，用手試從近路帶過去，再試從外側繞過去。",
      "維持兩個動作，試由視線先轉向 B，再試視線和身體同時到。"
    ],
    "compare": "哪一版讓前後兩個動作更像一句話？",
    "note": "先慢一點，讓兩個動作都做得舒服。"
  },
  "hands": {
    "title": "手部流動",
    "backingPreset": "layers",
    "base": "選一個熟悉的手勢，固定手的起點、終點和簡單腳步。",
    "question": "同一個起點和終點，中間可以怎麼走？",
    "hints": [
      "保持起點和終點。試走直線，再試繞成弧線。",
      "保留同一條路徑。試一口氣走完，再試在中間停一次。",
      "保留路線和速度。想像手掠過空氣，再想像手推過水。",
      "保留路線和速度。試用左手走一次，再用右手走一次。"
    ],
    "compare": "哪一版的路徑或質感差異最明顯？",
    "note": "腳步簡單一點，方便留意手上的變化。"
  },
  "shoulder": {
    "title": "肩膀的律動",
    "base": "選一個舒服的肩膀輕抬動作，手臂自然垂放。",
    "question": "小小的肩膀動作也可以有不同節奏嗎？",
    "hints": [
      "保留速度和幅度。試只動單側，再試兩側一起動。",
      "保留同一側和幅度。試每拍一下，再試每兩拍一下。",
      "保留同一側和節奏。試很小的幅度，再試稍微明顯一點。"
    ],
    "compare": "哪一版最容易保留肩膀和手臂的放鬆感？",
    "note": "幅度保持舒適，頸部可以自然放鬆。"
  },
  "pose": {
    "title": "同一個 Pose",
    "base": "選一個站得穩的 Pose，保留腳位、手和身體的形狀。",
    "question": "同一個姿勢，可以讓人感受到不同的意思嗎？",
    "hints": [
      "保留姿勢和停留時間。試看向遠處，再試看向自己的手。",
      "保持視線方向。試停半拍，再試停兩拍。",
      "保持 Pose 本身。試視線早一點到，再試到 Pose 後才抬起視線。"
    ],
    "compare": "哪一版讓你更想讓別人留意這個瞬間？",
    "note": "選不用勉強就能停住的姿勢。"
  },
  "texture": {
    "title": "同一個動作，換質感",
    "base": "選一個熟悉的小動作，保留它的形狀、路徑和速度。",
    "question": "同一個動作可以讓人感到輕、沉，或有彈性嗎？",
    "hints": [
      "保留路線和幅度。想像手是羽毛，再想像手推著一件有重量的東西。",
      "保留路線和速度。一次放鬆地結束，一次在終點做出清楚的停住。",
      "保留同一動作和速度。選兩種你想探索的感覺，只改用力方式來表達。"
    ],
    "compare": "哪一版最像你的感受？哪一版讓你意外？",
    "note": "用適合自己的力道，不必放大動作。"
  },
  "head": {
    "title": "用頭部回應節奏",
    "backingPreset": "drums",
    "base": "選一段短節奏和一個舒服的小點頭。有歌可聽鼓點，無歌可自己輕拍。",
    "question": "同一段節奏，可以回應哪一下？",
    "hints": [
      "保持短節奏和點頭幅度。先回應第一下，再試只回應最後一下。",
      "保持相同拍點。試輕輕點頭，再試小幅側傾。",
      "保持同一個點頭。試連續回應兩下，再試第二下保持安靜。"
    ],
    "compare": "少回應一個拍點之後，哪一下變得更清楚？",
    "note": "保持小幅舒適，避免快甩頭或勉強轉頸。"
  },
  "bounce": {
    "title": "同一個 Bounce",
    "backingPreset": "drums",
    "base": "先做自己舒服的 Bounce。每輪保留基本拍子和腳位。",
    "question": "這個 Bounce 可以有幾種感覺？",
    "hints": [
      "保留拍子。試比較小的 Bounce，再試稍大一點。",
      "維持幅度。第一次每拍平均，第二次只讓其中一拍更明顯。",
      "保持下沉的深度。試回升乾脆一點，再試回升柔和一些。"
    ],
    "compare": "哪一版既有差別，又保留了你熟悉的律動？",
    "note": "膝蓋輕鬆，從小幅度開始。"
  },
  "pause": {
    "title": "在同一個動作裡停一下",
    "base": "選一個慢慢就能完成的動作，保留它的路徑和終點。",
    "question": "停的位置不同，整個動作會怎樣變？",
    "hints": [
      "保持動作路徑。試在開始前停，再試在路徑中間停。",
      "選定同一個位置，試停半拍，再試停一整拍。",
      "保持停頓的位置和長度。一次讓視線也停住，一次讓視線繼續走。"
    ],
    "compare": "哪一次停頓讓下一個動作更有期待感？",
    "note": "選站得穩的停點，姿勢保持舒服。"
  },
  "sound": {
    "title": "同一個動作，換聲音回應",
    "backingPreset": "layers",
    "base": "保留一個熟悉的 Groove 和同一段聲音。可以用鼓和低音，也可以自己輕拍和哼唱。",
    "question": "換一個聆聽對象，身體會做出什麼選擇？",
    "hints": [
      "保留腳步和同一段聲音。先回應鼓聲或輕拍，再試回應低音、旋律或哼唱。",
      "用同一個 Groove 回應同一種聲音。試在聲音來時做，再試聽過才做。",
      "保留回應的聲音。試每次都回應，再試只挑一句裡最想回應的一下。"
    ],
    "compare": "換了聆聽的對象或時機，你最先感到哪裡改變？",
    "note": "先重播同一小段。若不易分辨聲音，可從兩種簡單聲響開始。"
  }
};
const explorationMarkup = `<dialog class="practice explore-dialog" id="explore-dialog" aria-labelledby="explore-title">
  <form method="dialog" class="practice-top"><button class="plain-button">今天到這裡</button></form>
  <h2 id="explore-title" tabindex="-1"></h2>

  <div id="explore-pick">
    <div class="step-choices step-choices-elements">
      <button type="button" class="plain-button" data-pick-element="turn">轉圈</button>
      <button type="button" class="plain-button" data-pick-element="weight">重心轉移</button>
      <button type="button" class="plain-button" data-pick-element="direction">同一步，換方向</button>
      <button type="button" class="plain-button" data-pick-element="connect">兩個動作之間</button>
      <button type="button" class="plain-button" data-pick-element="hands">手部流動</button>
      <button type="button" class="plain-button" data-pick-element="shoulder">肩膀的律動</button>
      <button type="button" class="plain-button" data-pick-element="pose">同一個 Pose</button>
      <button type="button" class="plain-button" data-pick-element="texture">同一個動作，換質感</button>
      <button type="button" class="plain-button" data-pick-element="head">用頭部回應節奏</button>
      <button type="button" class="plain-button" data-pick-element="bounce">同一個 Bounce</button>
      <button type="button" class="plain-button" data-pick-element="pause">在同一個動作裡停一下</button>
      <button type="button" class="plain-button" data-pick-element="sound">同一個動作，換聲音回應</button>
    </div>
  </div>

  <div id="explore-context-step" hidden>
    <p id="explore-element"></p>
    <p id="explore-base"></p>
    <div class="step-choices">
      <button type="button" class="plain-button" data-explore-mode="silent">無音樂探索</button>
      <button type="button" class="plain-button" data-explore-mode="music">跟音樂探索</button>
    </div>
    <button type="button" class="explore-back" data-explore-back="pick">返回選動作</button>
  </div>

  <div id="explore-round" hidden>
    <p id="explore-question"></p>
    <p id="explore-context"></p>
    <p class="explore-round-base"><strong>保持不變</strong> <span id="explore-constant"></span></p>
    <p id="explore-hint" aria-live="polite"></p>
    <div class="hint-actions">
      <button type="button" id="explore-next" class="cta">換一個提示，再試</button>
      <button type="button" id="explore-own" class="plain-button">自己想一種</button>
    </div>
    <p id="explore-note" class="explore-note"></p>
    <div id="explore-backing" data-preset="pulse" hidden></div>
    <details id="explore-compare">
      <summary>比較剛才的兩個版本</summary>
      <p id="explore-compare-question"></p>
      <p>想的話，把喜歡的一種放回一小段 Freestyle，或換個情境再試。也可以到這裡就好。</p>
    </details>
    <details id="explore-audio" hidden>
      <summary>用自己的音樂</summary>
      <div id="explore-music"></div>
    </details>
    <button type="button" class="explore-back" data-explore-back="context">返回選音樂情境</button>
  </div>

  <button type="button" class="plain-button" id="explore-listen">只想享受音樂</button>
</dialog>`;

function setupElementExploration({ controls, audioHome, player, listen }) {
  document.body.insertAdjacentHTML("beforeend", explorationMarkup);
  const dialog = document.getElementById("explore-dialog");
  const title = document.getElementById("explore-title");
  const hint = document.getElementById("explore-hint");
  const audio = document.getElementById("explore-audio");
  const backingPanel = document.getElementById("explore-backing");
  const backing = setupPracticeBacking(backingPanel);
  const compare = document.getElementById("explore-compare");
  const picker = document.getElementById("explore-pick");
  const context = document.getElementById("explore-context-step");
  const round = document.getElementById("explore-round");
  let current;
  let hintIndex;

  function showStep(panel, heading) {
    for (const step of [picker, context, round]) step.hidden = step !== panel;
    title.textContent = heading;
    if (dialog.open) title.focus();
  }

  function pickElement(element) {
    current = explorationData[element];
    document.getElementById("explore-element").textContent = current.title;
    document.getElementById("explore-base").textContent = current.base;
    showStep(context, "選擇音樂情境");
  }

  function startRound(mode) {
    const withMusic = mode === "music";
    hintIndex = 0;
    document.getElementById("explore-question").textContent = current.question;
    document.getElementById("explore-constant").textContent = current.base;
    document.getElementById("explore-context").textContent = withMusic
      ? "播同一小段音樂，比較兩種做法。"
      : "留意身體感覺，或用輕拍和哼唱帶出節奏。";
    hint.textContent = current.hints[0];
    document.getElementById("explore-note").textContent = current.note;
    document.getElementById("explore-compare-question").textContent = current.compare;
    compare.open = false;
    audio.hidden = !withMusic;
    audio.open = withMusic && Boolean(player.getAttribute("src"));
    backingPanel.hidden = !withMusic;
    if (withMusic) {
      backing.setPreset(current.backingPreset ?? "pulse");
      document.getElementById("explore-music").append(controls);
    }
    showStep(round, current.title);
  }

  for (const button of document.querySelectorAll(".explore-start")) {
    button.addEventListener("click", () => {
      stopPracticeBacking();
      player.pause();
      if (button.dataset.element) {
        pickElement(button.dataset.element);
      } else {
        showStep(picker, "你想探索哪一個元素？");
      }
      dialog.showModal();
      title.focus();
    });
  }
  for (const button of dialog.querySelectorAll("[data-pick-element]")) {
    button.addEventListener("click", () => pickElement(button.dataset.pickElement));
  }
  for (const button of dialog.querySelectorAll("[data-explore-mode]")) {
    button.addEventListener("click", () => startRound(button.dataset.exploreMode));
  }
  dialog.querySelector('[data-explore-back="pick"]').addEventListener("click", () => {
    showStep(picker, "你想探索哪一個元素？");
  });
  dialog.querySelector('[data-explore-back="context"]').addEventListener("click", () => {
    backing.stop();
    player.pause();
    audioHome.append(controls);
    showStep(context, "選擇音樂情境");
  });
  document.getElementById("explore-next").addEventListener("click", () => {
    hintIndex = (hintIndex + 1) % current.hints.length;
    hint.textContent = current.hints[hintIndex];
  });
  document.getElementById("explore-own").addEventListener("click", () => {
    hint.textContent = "保留這個元素，由你決定想改哪一項。可以用你自己的想法試兩次。";
  });
  document.getElementById("explore-listen").addEventListener("click", () => {
    dialog.close("listen");
  });
  dialog.addEventListener("close", () => {
    backing.stop();
    const listening = dialog.returnValue === "listen";
    dialog.returnValue = "";
    audioHome.append(controls);
    if (listening) listen();
    else player.pause();
  });
}
