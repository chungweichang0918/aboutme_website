# 正式部署與帳戶設定

## MANUAL ACTION REQUIRED — Cloudflare Pages

1. 確認 GitHub 工作區檔案，提交到新分支並審查 PR。確認原站部署方式，因為 repository 根目錄的舊 index.html 仍可被既有 GitHub Pages 設定使用。
2. 登入 Wrangler 後，以 `npx wrangler pages project create cwchang-me --production-branch main` 建立 Direct Upload 專案。若帳號內已有對應專案，可跳過建立。GitHub Actions 先驗證再透過 Wrangler 上傳 dist 與 functions，也可手動上傳。
3. 預覽分支 review 可直接上傳。正式分支 main 使用同帳戶的獨立限流 Worker，請先部署 Worker 再部署正式版本。該 Worker 僅透過 service binding 存取。需更名時同步更新兩份 wrangler.jsonc。
4. GitHub Actions 的 repository 或 environment secrets 設定 CLOUDFLARE_ACCOUNT_ID 與權限限定到該帳戶 Pages 編輯的 CLOUDFLARE_API_TOKEN。建立 production 與 preview environments，視需求限制可部署分支。驗收準備好後設 repository variable CLOUDFLARE_PAGES_DEPLOY=true。預設用 cwchang-me，若要改名稱，同步更新 Pages Wrangler 設定及 CLOUDFLARE_PAGES_PROJECT。只有 push 或手動執行會部署，PR 執行測試。推送專案內的非正式分支可建立預覽。
5. 使用部署輸出的 pages.dev URL 檢查三語、404、搜尋、標頭、RSS、Sitemap 與停用的帳戶功能。測試預覽可使用 Cloudflare Access 限制訪客。開啟 Access 時，請配合服務權杖調整部署後 Smoke Test，或用授權瀏覽器驗證。
6. 在 Pages 專案核對部署記錄及 Cloudflare 預覽的 noindex 標頭。正式的 pages.dev 網址可設網域層級轉址至主域，保留路徑與查詢參數。

```sh
npm ci
npm run build
npx wrangler login
npx wrangler pages project create cwchang-me --production-branch main
npx wrangler pages deploy dist --project-name cwchang-me --branch review
```

[Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) · [Pages Functions 設定](https://developers.cloudflare.com/pages/functions/wrangler-configuration/) · [Workers Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)

## MANUAL ACTION REQUIRED — Namecheap 與 DNS

1. 從現有 DNS 管理介面匯出或記錄 NS、A、AAAA、CNAME、MX、TXT、CAA 與所有子網域、驗證及 TTL。另存副本及原 Nameservers。盤點 Namecheap Shared Hosting、電郵、DNSSEC 和仍在使用的服務。
2. Cloudflare 新增 cwchang.me zone，對照匯入結果逐筆核對。若舊註冊商有 DNSSEC DS，先按 Cloudflare 指引處理舊 DS 與新簽署的時序，避免驗證失敗。
3. Pages 預覽通過、取得網域變更批准後，在 Namecheap Domain List → Manage → Nameservers 選 Custom DNS，填入 Cloudflare 指派的兩筆 NS。Namecheap 繼續負責註冊。
4. 在 Pages 專案加入 apex cwchang.me，自訂網域顯示有效後測 HTTPS、A/AAAA、MX、TXT 與子網域。替 www 設 proxied DNS，並建立 Cloudflare Redirect Rule，條件填 `http.host eq "www.cwchang.me"`，動態目標用 `concat("https://cwchang.me", http.request.uri.path)`，選 301 並保留查詢字串。驗證 www 的 DNS、HTTPS 與 301 回應。
5. 確認 Cloudflare HTTPS 與相關子網域後，按實際範圍啟用 HSTS。確認 DNS 服務穩定後重新啟用 DNSSEC 並核對 DS。
6. 在新舊 DNS 都保留已知可用的設定至傳播完成。確認所有使用中的服務後，再評估舊主機續約。

[Cloudflare Pages 自訂網域](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [Namecheap Nameservers](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)

## MANUAL ACTION REQUIRED — GitHub OAuth

1. GitHub 帳號啟用 MFA，建立 OAuth App，Homepage URL 填 https://cwchang.me/，Authorization callback URL 填 https://cwchang.me/api/auth/callback。
2. 在 Pages Production 設 GITHUB_CLIENT_ID 和 GITHUB_CLIENT_SECRET 為加密 Secrets。CMS_ORIGIN 及 CMS_ALLOWED_LOGINS 由 Wrangler 設定。Decap GitHub backend 使用已確認的 main、editorial workflow 與 public_repo。public_repo 的授權涵蓋帳號可存取的公開儲存庫，OAuth App 本身不能限制單一 repo。登入代理會另外檢查帳號允許清單以及對目標儲存庫的 push 權限。若必須限制 Token 至單一 repo，請維持 GitHub PR 維護，等採用支援 GitHub App 的後台方案再啟用。
3. 啟用 CMS 前，審查驗收報告的 Decap 套件安全公告，優先用 Cloudflare Access 保護 /admin、/admin/* 與 /api/auth/*。驗證允許的管理者可以完成 popup，且 GitHub callback 可在持有 Access session 的同一瀏覽器返回。維護期間也可直接使用 GitHub PR。
4. 以允許的帳號驗證登入、開編輯草稿、PR、媒體上傳、發布與重建。以另一帳號驗證無寫入權限。登出並撤銷 OAuth 授權做為權限撤回測試。分支保護需符合你的審查方式。

[Decap GitHub backend](https://decapcms.org/docs/github-backend/) · [GitHub OAuth Web application flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

## MANUAL ACTION REQUIRED — 收信轉寄與聯絡表單

- **轉寄收信** 在 Cloudflare Email Service 啟用 Email Routing，驗證 Gmail 收件地址，建立 hello@cwchang.me 的轉寄，再從外部信箱測收信。先確認現有 MX、轉寄與防偽紀錄。維持每個 hostname 只有一筆 SPF，核對 DKIM 與 DMARC。Email Routing 只處理收信轉寄。
- **表單寄信** 在 Resend 驗證寄件網域，建議使用專用子網域以隔離 MX 與 SPF。使用 Resend 提供的 SPF/DKIM 值，設定與核對 DMARC。建立僅限寄信與該網域的 API key。在 Cloudflare Production 設 RESEND_API_KEY、CONTACT_FROM、CONTACT_TO。
- **Turnstile** 新增允許 cwchang.me 的 widget，設定 TURNSTILE_SITE_KEY 和 TURNSTILE_SECRET。確認 CONTACT_ORIGIN 和 CONTACT_LIMITER。初次啟用後用實際信箱測試收信及 Reply-To，確認失敗時顯示直接寄信方式。正式憑證限 Production。
- **分析** 可透過 Cloudflare Web Analytics 啟用免 Cookie 的公開站統計。在 Cloudflare 後台 Web Analytics 新增 cwchang.me，取得公開 beacon ID 後，設成 GitHub repository variable `CLOUDFLARE_ANALYTICS_TOKEN`，CI 建置時就會插入 beacon，三語隱私權政策也會自動改為已啟用的說明。不要同時開啟 Pages 專案內建的自動注入，以免重複計算。未設定時維持關閉。

[Cloudflare Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/) · [Resend 網域驗證](https://resend.com/docs/dashboard/domains/introduction) · [Turnstile Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) · [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/)

## 免費額度與維運

預算以各服務免費額度內 NT$0／月估算，不含網域續費、舊主機或未核准升級。實際費用需於開通時確認。

| 服務 | 初始方案 |
| --- | --- |
| Pages | 免費方案每月 500 次平台建置。此專案採 GitHub Actions 建置與 Wrangler 上傳。 |
| Pages Functions / Worker | 免費 Workers 額度。Functions 呼叫與獨立 Worker 的資源應監測。 |
| Turnstile | Free，可用 20 個 widgets，每個至多 10 個主機名稱。 |
| Email Routing | 免費收信轉寄。 |
| Resend | Free，每月 3,000 封，每天 100 封。 |
| GitHub、Decap CMS、Web Analytics | 公開儲存庫、開源 CMS 與免費 Web Analytics。 |

[Pages limits](https://developers.cloudflare.com/pages/platform/limits/) · [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/) · [Resend pricing](https://resend.com/pricing)

## 備份、回滾與值班

- 在部署記錄保留已驗收的 Git SHA、Pages deployment ID 與 DNS 匯出。安全保存 Secrets 的復原管道及經核准的原始媒體。
- 部署失敗時 Cloudflare 保留前一次可用的部署。已發布版本有問題時，在 Pages Deployments 回滾到已驗收版本，再透過 Git revert 與新 PR 修正 main。回滾後驗證首頁、API、RSS、搜尋及 404。
- 若服務故障，在 Cloudflare 先停用對應 secrets 或 binding 以關閉表單或 OAuth。檢查應用程式設定、必要時輪替憑證。緊急回滾 DNS 依備份恢復舊設定，同時考量 DNSSEC 和郵件。
- 啟用 Pages 回滾後核對現行 Cloudflare Dashboard 設定與 Secrets，因為部署版本及帳戶設定可能有不同生命週期。
