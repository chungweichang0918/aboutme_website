import type { Locale } from './routes';

const states: Record<string, [string, string, string]> = {
  'in-progress': ['進行中','In progress','進行中'],
  completed: ['已完成','Completed','完了'],
  maintained: ['維護中','Maintained','保守中'],
  archived: ['已封存','Archived','アーカイブ'],
  published: ['已正式發表','Published','正式発表済み'],
  accepted: ['已接受','Accepted','採択済み'],
  'under-review': ['審查中','Under review','査読中'],
  preprint: ['預印本','Preprint','プレプリント'],
  unpublished: ['未發表專案','Unpublished project','未発表プロジェクト'],
  participant: ['參賽','Participant','参加'],
  shortlisted: ['入圍','Shortlisted','選出'],
  finalist: ['決賽','Finalist','決勝進出'],
  winner: ['獲獎','Winner','受賞'],
  other: ['其他正式紀錄','Other record','その他の記録'],
  current: ['現職','Current','在職中'],
  enrolled: ['在學','Enrolled','在学中'],
  graduated: ['已畢業','Graduated','卒業済み'],
  expected: ['預計畢業','Expected graduation','卒業予定'],
  earned: ['已取得','Earned','取得済み'],
  planned: ['規劃中','Planned','予定'],
  expired: ['已過期','Expired','失効'],
};

export const statusText = (status: string, locale: Locale) => states[status]?.[{ 'zh-tw': 0, en: 1, ja: 2 }[locale]] ?? status;
export const formattedDate = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date));
// Résumé-style entries are recorded to the month, so the day is not shown.
export const formattedMonth = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(date));
