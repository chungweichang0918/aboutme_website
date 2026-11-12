# 驗收、安全與效能報告

驗收日期 2026-11-12（Asia/Taipei）。基準為 GitHub main 的 fe577bc。本機工作區保留原有根目錄 index.html 及 Git 歷史，README 保留原標題並新增維護說明。正式部署目錄為 dist。

## 驗收結果

| 檢查 | 結果 |
| --- | --- |
| ESLint、Astro 型別、Pages Functions 與 Worker 型別 | 通過 |
| 正式靜態建置 | 通過，三語各 13 主頁。42 筆 canonical URL 包含三語隱私政策。另有根首頁、404、搜尋、RSS 與 admin。 |
| 內容整合 | 通過，測試資料驗證專案與研究詳細頁、MDX、KaTeX、翻譯關係與原文 fallback、RSS、Sitemap、私人與草稿條目排除及附件隔離。測試檔已清除，輸出已重建。 |
| Decap 本機代理 | 通過，官方瀏覽器套件可登入本機代理、開啟集合及 Markdown 編輯器，並寫入私人 MDX 測試稿。已清除測試稿。正式 OAuth 及 GitHub 審查發布仍待驗。 |
| Pages Functions 模擬 | 6 項通過，包含停用狀態、來源限制、格式與長度、節流、Turnstile 失敗與重複 token、寄信重試、OAuth state 及儲存庫權限。 |
| Wrangler | Pages Functions 可在本機編譯並執行。CMS 和表單在缺少憑證時正確停用，回應包含預期的 CSP 與 no-store。限流 Worker dry-run 成功，顯示每 60 秒 4 次的 binding。 |
| Playwright | 10 項通過。包含 39 個主頁、鍵盤切換語言、主題保存、320–1440px、三語搜尋、404、WCAG axe 掃描、無 JavaScript、減少動態效果、PWA 離線頁。 |
| PWA | Manifest、192px/512px icons、Service Worker 與離線回應已驗證。實際裝置上的安裝介面待驗。 |

## Lighthouse 手機模式

使用本機 Cloudflare Wrangler、Chrome 與 Lighthouse 13.6.0。聯絡表單處於停用狀態。LCP 為實驗室測值，CLS 為單次頁面測量。

| 頁面 | 效能 | 無障礙 | 最佳實務 | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 繁中首頁 | 100 | 100 | 100 | 100 | 1.14 秒 | 0 |
| 英文聯絡 | 100 | 100 | 100 | 100 | 0.98 秒 | 0 |
| 日文研究 | 100 | 100 | 100 | 100 | 0.93 秒 | 0 |

正式站的 INP、網路條件及第三方服務載入成本需要在配置 Cloudflare、Turnstile 與核准媒體後測量。已跑自動無障礙檢查及鍵盤流程。實體手機、Safari、螢幕閱讀器與完整 WCAG 2.2 AA 手動審核待驗。

重現方式為先啟動 npm run pages:dev，再以 Lighthouse 手機預設量測各頁。瀏覽器套件可使用 npx --no-install lighthouse。npm run e2e 可自行啟動靜態預覽，或設定 TEST_BASE_URL 指向 Wrangler。Windows Codex 沙箱可能阻止 Pagefind 原生程式寫入索引，需用一般本機終端執行。

## 安全與已知限制

- Astro 升級至已修補的 7.4.10，Tailwind 使用 PostCSS 以相容目前 Vite。本次 npm audit --omit=dev 報告 0 重大、7 高、26 中、5 低，包含傳遞相依。高風險項目集中在 Decap 及其 Markdown 相依套件。正式啟用 CMS 前應重新稽核並審查可用的已修補版本。現有後台用原始 Markdown 編輯，並關閉內嵌預覽。 [Astro 安全公告](https://github.com/withastro/astro/security/advisories) · [trim 公告](https://github.com/advisories/GHSA-w5p7-h5w8-2hfq)
- OAuth 檢查 state、PKCE、允許來源、GitHub 帳號與 repo push 權限。Token 只透過指定視窗及來源交給 Decap。GitHub 的 public_repo 是帳號層級公開儲存庫範圍。限制 admin 存取並審查發布 PR。 [GitHub OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
- 表單使用相同來源的 JSON、字元與請求大小限制、Turnstile Siteverify 的 hostname 及 action 驗證。Resend 以重試識別碼建立冪等鍵。限流採 Cloudflare 每個邊緣位置的計數。訊息不存入網站資料庫。 [Turnstile Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) · [Resend 冪等鍵](https://resend.com/docs/dashboard/emails/idempotency-keys)
- 只有 Astro 已渲染公開頁面引用的附件會複製到 dist。GitHub repo 本身公開，私密檔案須留在 GitHub repo 之外。MDX 允許可信任的作者使用 JSX，應審查第三方內容和 PR。
- CSP、noindex 與 Service Worker 排除規則已實作。HTTPS、HSTS、預覽站索引隔離與回滾需要 Cloudflare 的實際部署驗證。

## MANUAL ACTION REQUIRED

- 核准照片、個人介紹、技術描述、履歷 PDF、社群網址及各項作品、研究、證照、獎項等內容。現有首頁採抽象硬體圖形，未提供的內容顯示空狀態。
- 配置 GitHub Actions、Cloudflare Pages 及限流 Worker。跑真正的 Cloudflare Preview smoke test。
- 配置 GitHub OAuth 憑證、允許帳號與審查流程，實測登入、拒絕非授權者、內容及附件管理、發布後重建。
- 配置 Turnstile、Resend、寄件網域、收件信箱、Email Routing，測試真實驗證與收信。設定選用的分析服務前更新隱私政策。
- 核對 Namecheap DNS 與郵件紀錄，按批准的切換時間設定 Nameservers、www 轉址、HTTPS/HSTS 與 DNSSEC。

本次交付為本機原始碼與靜態建置。正式服務尚未部署。操作、費用與復原流程見 [部署指南](deployment.md)。
