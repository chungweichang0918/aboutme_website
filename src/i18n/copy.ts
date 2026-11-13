import type { Locale, Section } from '../lib/routes';

const sections: Section[] = ['home','about','projects','research','awards','skills','experience','blog','resume','contact','certifications','timeline','now','privacy','search'];
const titles = {
  'zh-tw': ['首頁','關於我','工程作品','學術研究','競賽與獎項','技術領域','經歷與教育','技術文章','履歷','聯絡','證照與認證','時間軸','近況','隱私權政策','站內搜尋'],
  en: ['Home','About','Projects','Research','Awards','Skills','Experience & education','Writing','Résumé','Contact','Certifications','Timeline','Now','Privacy policy','Search'],
  ja: ['ホーム','プロフィール','プロジェクト','研究','コンテスト・受賞','技術分野','経歴・学歴','技術記事','履歴書','お問い合わせ','資格・認定','タイムライン','近況','プライバシーポリシー','サイト内検索'],
};
const descriptions = {
  'zh-tw': ['個人作品集與研究網站','認識張鈞崴，探索這個網站的技術主題。','從軟體、硬體到系統整合的工程紀錄。','研究問題、方法、個人貢獻與公開成果。','已確認的參賽、入圍、決賽與獲獎紀錄。','以實際經驗呈現使用過的工具與技術。','公開的教育背景及專業經歷。','開發筆記、實作心得與技術文章。','教育、技術、專案及研究的公開摘要。','歡迎來信交流專案、研究與合作機會。','證照狀態、發證機構及公開驗證資訊。','依時間瀏覽已公開的學習與工程里程碑。','近期公開的學習、作品與寫作動態。','網站如何處理聯絡資料與本機偏好。','搜尋目前語系的公開內容。'],
  en: ['Personal portfolio and research website','Meet Wayne Chang and explore the technical themes of this site.','Engineering work across software, hardware, and system integration.','Research questions, methods, individual contributions, and public results.','Verified competition participation, finalist records, and awards.','Tools and technologies backed by hands-on work.','Public academic and professional experience.','Development notes and technical articles.','A public overview of education, technical work, projects, and research.','Get in touch about projects, research, and collaboration.','Credential status, issuers, and public verification details.','Explore public engineering and learning milestones by year.','Recent public notes on learning, projects, and writing.','How the site handles contact information and local preferences.','Find published content in your selected language.'],
  ja: ['個人ポートフォリオと研究サイト','Wayne Chang のプロフィールとサイトの技術テーマ。','ソフトウェア、ハードウェア、システム統合の制作記録。','研究課題、手法、個人の貢献、公開成果。','参加、選出、決勝進出、受賞の確認済み記録。','実際の制作経験に基づくツールと技術。','公開されている学歴と職務経験。','開発メモと技術記事。','学歴、技術、プロジェクト、研究の公開概要。','プロジェクト、研究、共同制作についてご連絡ください。','認定状況、発行機関、公開されている確認情報。','公開されている学習と開発の節目を年ごとに閲覧。','学習、制作、執筆に関する最近の公開情報。','連絡先情報と端末上の設定の取り扱い。','選択した言語の公開コンテンツを検索。'],
};
export const titleFor = (locale: Locale, page: Section) => titles[locale][sections.indexOf(page)];
export const descriptionFor = (locale: Locale, page: Section) => descriptions[locale][sections.indexOf(page)];

export const ui = {
  'zh-tw': {
    portfolio: '工程作品集與研究', work: '作品與研究', credentials: '證照與獎項', more: '更多', relatedAwards: '相關競賽', relatedResearch: '相關研究', relatedWriting: '相關文章', filterTag: '篩選標籤', highlight: '重點證照', highlights: '成果摘要', jump: '快速跳到分類', verify: '查證', credentialId: '證號', total: '共', menu: '選單', navigation: '主要導覽', language: '語言', skip: '跳至主要內容',
    theme: '外觀', system: '系統', light: '淺色', dark: '深色', sound: '介面音效', update: '重新載入新版',
    greeting: '你好，我是', roles: ['嵌入式系統', '物聯網', '軟體工程'], tagline: '從硬體到軟體，探索系統如何運作。這裡收錄工程作品、研究與技術筆記。',
    explore: '探索工程作品', overview: '探索網站', featured: '精選作品', latest: '最新文章', all: '查看全部',
    empty: '目前沒有已公開的紀錄。', fallback: '目前語言的譯文尚未發布，以下為原文。', original: '原文', download: '下載履歷 PDF', cvEmpty: '履歷 PDF 尚未公開。',
    query: '搜尋關鍵字', allCategories: '所有分類', sort: '排序', newest: '最新優先', oldest: '最早優先', noResults: '找不到符合條件的項目。', year: '年份',
    email: '電子郵件', send: '送出訊息', fields: ['姓名', '電子郵件', '主旨', '訊息'], contactOff: '表單服務尚未啟用，請直接來信。',
    sending: '傳送中…', sent: '訊息已送出。', sendError: '傳送失敗。請重試或直接來信。', rate: '送出次數過多，請稍後再試。', challenge: '請完成驗證後再送出。', invalid: '請確認必填欄位及字數。',
    toc: '文章目錄', previous: '上一篇', next: '下一篇', related: '相關文章', minutes: '分鐘閱讀', copy: '複製程式碼', copied: '已複製', back: '返回列表',
    missing: '找不到頁面', missingCopy: '這個網址沒有對應的公開頁面。', rss: 'RSS 訂閱',
    privacy: ['聯絡表單啟用後，本站會處理姓名、電子郵件、主旨與訊息以回覆聯絡。Cloudflare Turnstile 驗證請求，Resend 負責寄送。訊息不寫入本站資料庫，收件信箱與郵件服務會依各自的設定留存資料。', '主題、語言及音效偏好儲存在此瀏覽器。公開靜態資源可離線快取。'],
    analyticsOn: '本站使用 Cloudflare Web Analytics 統計瀏覽次數、來源頁面與載入效能。它不使用 Cookie，也不追蹤個別訪客。',
  },
  en: {
    portfolio: 'Engineering portfolio & research', work: 'Work', credentials: 'Credentials', more: 'More', relatedAwards: 'Related competitions', relatedResearch: 'Related research', relatedWriting: 'Related writing', filterTag: 'Filter by tag', highlight: 'Highlight', highlights: 'At a glance', jump: 'Jump to category', verify: 'Verify', credentialId: 'Credential ID', total: 'Total', menu: 'Menu', navigation: 'Main navigation', language: 'Language', skip: 'Skip to content',
    theme: 'Appearance', system: 'System', light: 'Light', dark: 'Dark', sound: 'Interface sound', update: 'Reload to update',
    greeting: 'Hello, I’m', roles: ['Embedded systems', 'Internet of Things', 'Software engineering'], tagline: 'Exploring how systems work, from hardware to software. Find engineering projects, research, and technical notes here.',
    explore: 'Explore projects', overview: 'Explore the site', featured: 'Featured projects', latest: 'Latest writing', all: 'View all',
    empty: 'There are no published entries yet.', fallback: 'A translation is pending. The original text is shown below.', original: 'Original', download: 'Download résumé PDF', cvEmpty: 'A résumé PDF has yet to be published.',
    query: 'Search keywords', allCategories: 'All categories', sort: 'Sort', newest: 'Newest first', oldest: 'Oldest first', noResults: 'No matching results.', year: 'Year',
    email: 'Email', send: 'Send message', fields: ['Name', 'Email', 'Subject', 'Message'], contactOff: 'The contact form is currently unavailable. Please send an email.',
    sending: 'Sending…', sent: 'Message sent.', sendError: 'Could not send the message. Try again or send an email.', rate: 'Too many submissions. Please try again later.', challenge: 'Complete the verification before submitting.', invalid: 'Check the required fields and length limits.',
    toc: 'Contents', previous: 'Previous post', next: 'Next post', related: 'Related posts', minutes: 'min read', copy: 'Copy code', copied: 'Copied', back: 'Back to list',
    missing: 'Page not found', missingCopy: 'There is no published page at this address.', rss: 'RSS feed',
    privacy: ['When enabled, the contact form processes your name, email, subject, and message to reply to your inquiry. Cloudflare Turnstile verifies requests and Resend delivers them. The site has no message database. The recipient’s mailbox and delivery provider retain data according to their settings.', 'Theme, language, and sound preferences stay in this browser. Public static assets may be cached for offline access.'],
    analyticsOn: 'This site uses Cloudflare Web Analytics to count page views, referring pages, and load performance. It sets no cookies and does not track individual visitors.',
  },
  ja: {
    portfolio: 'エンジニアリング作品集・研究', work: '制作・研究', credentials: '資格・受賞', more: 'その他', relatedAwards: '関連コンテスト', relatedResearch: '関連研究', relatedWriting: '関連記事', filterTag: 'タグで絞り込む', highlight: '注目の資格', highlights: '実績の概要', jump: '分類へ移動', verify: '確認', credentialId: '認定番号', total: '合計', menu: 'メニュー', navigation: 'メインナビゲーション', language: '言語', skip: '本文へ移動',
    theme: '外観', system: 'システム', light: 'ライト', dark: 'ダーク', sound: '操作音', update: '再読み込みして更新',
    greeting: 'こんにちは。', roles: ['組み込みシステム', 'IoT', 'ソフトウェア工学'], tagline: 'ハードウェアからソフトウェアまで、システムの仕組みを探究。制作、研究、技術メモをまとめています。',
    explore: 'プロジェクトを見る', overview: 'サイトを探す', featured: '注目のプロジェクト', latest: '最新の記事', all: 'すべて表示',
    empty: '公開されている記録はまだありません。', fallback: '翻訳は未公開です。以下に原文を表示します。', original: '原文', download: '履歴書 PDF をダウンロード', cvEmpty: '履歴書 PDF はまだ公開されていません。',
    query: 'キーワード検索', allCategories: 'すべての分類', sort: '並び順', newest: '新しい順', oldest: '古い順', noResults: '条件に合う項目がありません。', year: '年',
    email: 'メール', send: 'メッセージを送信', fields: ['お名前', 'メール', '件名', 'メッセージ'], contactOff: 'フォームは現在利用できません。メールでご連絡ください。',
    sending: '送信中…', sent: '送信しました。', sendError: '送信できませんでした。再試行するか、メールでご連絡ください。', rate: '送信回数が上限に達しました。しばらくしてから再試行してください。', challenge: '認証を完了してから送信してください。', invalid: '必須項目と文字数を確認してください。',
    toc: '目次', previous: '前の記事', next: '次の記事', related: '関連記事', minutes: '分で読めます', copy: 'コードをコピー', copied: 'コピー済み', back: '一覧に戻る',
    missing: 'ページが見つかりません', missingCopy: 'この URL に公開ページはありません。', rss: 'RSS フィード',
    privacy: ['フォームが有効な場合、返信のために氏名、メールアドレス、件名、本文を処理します。Cloudflare Turnstile が認証し、Resend が配信します。サイトのデータベースには保存せず、受信メールボックスと配信事業者の設定に従って保管されます。', '外観、言語、操作音の設定はこのブラウザーに保存されます。公開静的ファイルはオフライン用にキャッシュされる場合があります。'],
    analyticsOn: 'このサイトでは Cloudflare Web Analytics で閲覧数、参照元ページ、読み込み性能を集計しています。Cookie は使わず、個々の訪問者を追跡しません。',
  },
};
