import { MatchLevel } from '../types';

/**
 * 格式化排名显示
 * @param ranking - 排名数值
 * @returns 格式化后的排名字符串
 */
export function formatRanking(ranking: number | null | undefined): string {
  if (ranking === null || ranking === undefined) return '-';
  return `#${ranking}`;
}

/**
 * 格式化日期时间
 * @param dateStr - ISO 日期字符串
 * @returns 格式化后的日期字符串 YYYY-MM-DD HH:mm
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 截断文本
 * @param text - 原文
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string | null | undefined, maxLength: number = 50): string {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 根据备注文本推测匹配度
 * @param notes - 备注原文
 * @returns 推测的匹配度等级
 */
export function parseMatchLevelFromNotes(notes: string | null | undefined): MatchLevel | null {
  if (!notes) return null;
  if (notes.includes('建议多看看')) return MatchLevel.HIGH;
  if (notes.includes('可以备选')) return MatchLevel.MEDIUM;
  return null;
}

/**
 * 获取匹配度颜色
 * @param matchLevel - 匹配度等级
 * @returns 十六进制颜色值
 */
export function getMatchLevelColor(matchLevel: MatchLevel | null): string {
  if (matchLevel === MatchLevel.HIGH) return '#2e7d32';
  if (matchLevel === MatchLevel.MEDIUM) return '#ed6c02';
  return '#9e9e9e';
}

/**
 * 获取匹配度背景色
 * @param matchLevel - 匹配度等级
 * @returns 十六进制背景色值
 */
export function getMatchLevelBgColor(matchLevel: MatchLevel | null): string {
  if (matchLevel === MatchLevel.HIGH) return '#e8f5e9';
  if (matchLevel === MatchLevel.MEDIUM) return '#fff3e0';
  return '#f5f5f5';
}

/**
 * 生成唯一 ID（用于前端临时 key）
 */
export function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 防抖函数
 * @param fn - 要防抖的函数
 * @param delay - 延迟毫秒
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
