# aboutme_website

Wayne Chang｜張鈞崴的三語工程作品集與研究網站。Astro 產出靜態頁面，Cloudflare Pages Functions 提供 GitHub OAuth 與聯絡表單，Decap CMS 透過 GitHub 管理內容。

## 本機開發

使用 Node.js 24 LTS 與 npm。

```powershell
npm ci
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm run dev
```

開啟 http://localhost:4321/ 。根路徑顯示繁中首頁，正式索引網址是 /zh-tw/ 。英文與日文從 /en/ 和 /ja/ 進入。既有根目錄 index.html 仍保留作為歷史檔案，正式輸出由 Astro 的 src/pages 產生，部署目錄為 dist/ 。

## 建置與驗收

```powershell
npm run lint
npm run check
npm test
npm run test:content
npx playwright install chromium
npm run e2e
npm run preview
```

一般正式建置使用 npm run build。它會產出三語頁面、Sitemap、RSS、Pagefind 索引、PWA 和 Decap 設定。npm run test:content 暫時新增測試資料來驗證內容管線，並在完成後清除測試資料與重建。請使用 npm run preview 驗證完整索引與已公開媒體。npm run pages:dev 可在 Wrangler 中檢查 Pages Functions 及 HTTP Headers。

- [工程實作計畫](docs/plan.md)
- [內容、翻譯與 Decap CMS](docs/content.md)
- [Cloudflare、GitHub OAuth、Namecheap DNS、郵件與回滾](docs/deployment.md)
- [驗收、安全與效能](docs/acceptance.md)
