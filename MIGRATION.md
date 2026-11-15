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

## 目前的 GitHub Pages 發布方式

```sh
npm run stage:pages
```

這個指令先建置，再把三個發布用 HTML 及 `assets/site/` 放到現有 Pages 發布分支的根目錄。發布時將來源和這些產物放在同一個提交。Vite 為資源產生帶雜湊的檔名，頁面會自動引用相符版本。

## 改用 GitHub Actions 時

由具備 Pages 管理權限的帳戶選擇 GitHub Actions 作為發布來源。工作流程以 `npm ci` 安裝依賴、`npm run build` 檢查及建置，並發布 `dist/`。首次自動發布成功後，再從版本庫根目錄移除分支發布用的產物和 `stage:pages` 步驟。

發布變更前先檢查三頁與舊深層連結。需要回復時，可把發布來源切回原本的分支，並發布最近一個已驗證的產物。

參考 [Vite 多頁建置](https://v7.vite.dev/guide/build.html#multi-page-app) 和 [GitHub Pages 發布指南](https://vite.dev/guide/static-deploy#github-pages)。
