# cwchang.me 實作計畫

Phase 0 讀取 GitHub 預設分支，確認 main 與基準提交 fe577bc。原始庫只有 README.md 與一個跳往 YouTube 的 index.html。GitHub 公開帳號 API 回傳 200。保留 index.html，README 保留原標題再補上使用指南。上游提交 fe577bc 保留原始版本。

| 階段 | 改動 | 驗證 |
| --- | --- | --- |
| 1 | Astro 靜態輸出、TypeScript、Tailwind、鎖定檔、CI | lint、typecheck、build |
| 2 | 導覽、電光藍主題、外觀選項、動態與響應式版型 | Playwright、Lighthouse |
| 3 | 三語各 13 主頁、404、隱私與搜尋 | HTTP 路由、canonical、鍵盤、窄螢幕 |
| 4 | Content Collections、MDX、原文 fallback、Pagefind | 公開與私人內容建置測試 |
| 5 | Decap 編輯流程、同網域 GitHub OAuth Pages Functions | 單元測試、待正式帳戶驗證 |
| 6 | Turnstile、Resend、GitHub 活動、PWA、RSS、SEO | 模擬服務測試、瀏覽器與建置驗證 |
| 7 | CSP、權限、依賴公告、效能和無障礙 | 依賴稽核、模擬及瀏覽器結果 |
| 8 | Pages 設定、GitHub Actions、速率限制 Worker、DNS 與回滾 | 本機 Wrangler、需實際 Cloudflare 預覽 |
| 9 | 驗收紀錄、內容與正式啟用手冊 | 見驗收報告 |

正式網址與 OAuth 只接受已配置的網域。根路徑顯示繁體中文版，canonical 指向 /zh-tw/。初始頁面沒有未經核准的個人素材或履歷。正式部署、帳號與 DNS 操作由網站擁有者執行。
