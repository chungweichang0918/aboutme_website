# 內容、翻譯與 Decap CMS

## 一般維護

先在分支修改內容，通過 CI 後再合併。站點名稱、已核准照片、連結、三語簡介及履歷更新於 src/content/settings.json。專案、研究、獎項、技能、經歷、教育、文章、證照、時間軸、近況各有集合，型別定義在 src/content.config.ts。主介面翻譯在 src/i18n/copy.ts。

每個內容的每個語言使用獨立檔案。檔名建議使用 <locale>-<slug>，locale 為 zh-tw、en 或 ja。翻譯檔沿用 contentId，slug 可翻譯，但同集合與語言內須唯一。日期使用 YYYY-MM-DD。不同集合可重複使用同一 ID。正式發布需要 draft: false 與 visibility: public 同時成立。尚待核准的內容請留在本機或未公開的受控儲存空間。現有 GitHub 儲存庫是公開的，Git 分支及 PR 也可能公開可讀。

下方是文章欄位形狀，請以你實際核准的內容取代欄位值。此例預設為私人草稿。

```mdx
---
contentId: approved-topic
slug: approved-topic
locale: zh-tw
title: 請填入已核准的文章標題
summary: 請填入摘要
date: "2026-11-11"
category: 開發筆記
tags: []
draft: true
visibility: private
featured: false
---

## 背景

填入文章內容。
```

- **專案**填入 category 與 status。以 Markdown 小標撰寫問題、目標、負責工作、架構、流程、開發、測試、成果及後續計畫。已有公開網址時填 github 或 demo。圖表、截圖、影片可放正文或 links。
- **研究**填入領域與研究狀態。正文可使用摘要、方法、實驗、指標、結果、限制與貢獻。可公開時填寫作者、指導教授、引用或 DOI。PDF、海報、簡報、資料集、模型與程式碼使用 links。
- **文章**使用 .mdx，支援 GFM、程式碼區塊與數學公式。使用 Markdown 模式編輯含 JSX 的內容。MDX 會在建置時執行，任何 import、JSX 與運算式都應經審核。
- **翻譯**缺少公開譯文時，專案、研究及文章列表會顯示原文卡片，詳細頁帶提示並以原文為 canonical。待確認翻譯保持草稿狀態。
- **媒體與文件**將核准的圖片、影片與文件置於 src/content/media 或 src/content/documents，頁面使用 /media/ 或 /documents/ 相對站點路徑。使用 ASCII 檔名、小寫副檔名，單檔最多 25 MiB。建置只複製已產出頁面引用的附件。請以實際 PDF 填寫 settings.json 的 resumes 各語系欄位。履歷欄位留空時頁面會顯示狀態。
- **封面**提供 cover 與 coverAlt。正文圖片亦需替代文字。內部影片使用檔案連結，YouTube 嵌入使用隱私加強網域 youtube-nocookie.com。

## CMS 編輯

1. 本機測試在兩個終端分別執行 npm run cms:local 和 npm run dev:cms。開啟 http://localhost:4321/admin/。本機代理可寫入目前工作目錄，只在隔離的分支或測試複本使用。正式建置會移除本機 CMS 模式。
2. 正式站完成 OAuth 後，開啟 /admin/，以授權帳號登入。選擇 Posts、Projects 等集合，填欄位，使用原始 Markdown 模式保留 MDX 語法。
3. 每篇原文和譯文建立獨立項目並沿用同一 contentId。可用語言篩選切換。上傳附件前確認可寫入公開 GitHub 歷史。Media 管理器使用 src/content/media。
4. 將條目保存在 Editorial Workflow 草稿，移到審查狀態後檢查 GitHub PR 和預覽。核准後將 visibility 設為 public、關閉 draft，發布並確認 CI。若 main 有強制審核規則，請在 GitHub 合併通過檢查的 PR。
5. 取消發布時改回私人或草稿，或刪除條目後合併。舊的 Git 歷史、已分享 URL、索引快照或先前 Pages 部署可能仍有副本。請勿將機密或私人素材放進此公開儲存庫。

## 標題卡與分享縮圖

`scripts/cards.py` 會替每篇公開的作品、文章與研究，依語系產生 1200×630 標題卡，輸出到 `src/content/media/og/`。詳細頁會自動把它當成分享縮圖；沒有實際截圖的項目也用它當封面（`cover` 指向同一個檔案）。新增或改標題後，在本機執行一次即可（需要 Python、Pillow 與 Windows 內建的微軟正黑體、游ゴシック、Segoe UI）：

```sh
python scripts/cards.py .
```

沒有標題卡的頁面會退回使用 `cover`，再退回網站預設的分享圖。
