# TypeScript + Vite 維護與發布

## 現況

三個頁面已接入 Vite 多頁建置。HTML 和 CSS 來源放在 `src/`。首頁、探索練習及動作詞庫各有一個 TypeScript 入口，共用音訊引擎與相關模組。節拍資料、抽卡條件及探索流程均納入嚴格型別檢查。

| 維護範圍 | 來源 |
| --- | --- |
| 首頁、案例及音樂中的選擇 | `src/index.html`、`src/pages/home.ts` |
| 探索頁及兩頁共用的練習步驟 | `src/possibilities.html`、`src/pages/possibilities.ts`、`src/practice/element-exploration.ts` |
| 動作清單、搜尋及抽卡 | `src/vocabulary.html`、`src/pages/vocabulary.ts`、`src/practice/vocabulary-practice.ts` |
| 伴奏、節拍編輯及疊加片段 | `src/audio/` |

## 開發與驗收

使用 Node.js 22.12 以上的 22.x 版本，或 Node.js 24 以上版本。

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`npm run build` 先做 TypeScript 型別檢查，再產生 `dist/` 中的三個頁面及共用資源。修改請從 `src/` 開始。用 `npm run preview` 檢查建置結果。

- 首頁測試切換案例、音樂來源、四軌播放及「只想享受音樂」。
- 探索頁測試有音樂及無音樂的練習、換提示與關閉伴奏。
- 詞庫測試搜尋、同輪抽卡、指定條件及節拍編輯。
- 使用已儲存的「我的節拍」驗證相容性，並確認舊網址和頁內連結可以開啟。

## GitHub Pages 自動發布

GitHub Pages 的發布來源設為 GitHub Actions。推送至 `main` 後，[發布流程](.github/workflows/pages.yml) 會執行 `npm ci` 和 `npm run build`，型別檢查及建置成功後便將 `dist/` 發布至網站。也可從儲存庫的 Actions 頁面手動執行 **Build and deploy website**。

發布後可在 Actions 頁面確認 `build` 和 `deploy` 都成功，再打開三個頁面與原有的錨點連結。需要回復網站版本時，可在 `main` 還原出問題的提交，再由流程發布。

如需暫時恢復分支發布，可從切換前的提交 `93618b3` 建立分支，將 Pages 的發布來源切到該分支的根目錄。

參考 [Vite 多頁建置](https://v7.vite.dev/guide/build.html#multi-page-app) 和 [GitHub Pages 發布指南](https://vite.dev/guide/static-deploy#github-pages)。
