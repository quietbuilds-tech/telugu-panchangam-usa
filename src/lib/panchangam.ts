export type Vaaram = { key: string; telugu: string; english: string };
export type KeyedLabel = { key: string; telugu: string; english: string };

export type TimedEntry = {
  label: string;
  key?: string;
  telugu?: string;
  english?: string;
  time: string | null;
  rollover: boolean;
  qualifier: string | null;
  raw: string;
};

export type TimeRange = { start: string; end: string; rollover: boolean };

export type Varjyam = {
  type: 'ranges' | 'none' | 'unknown';
  ranges: TimeRange[];
};

export type Day = {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  vaaram: Vaaram;
  samvatsaram: string | KeyedLabel;
  masam: string | KeyedLabel;
  paksham: KeyedLabel;
  ayanam: KeyedLabel;
  ruthuvu: KeyedLabel;
  tithi: TimedEntry[];
  nakshatra: TimedEntry[];
  durmuhurtham: TimeRange[];
  varjyam: Varjyam;
  festivals: any[]; // data currently mixes string/objects in some places
  weekdayTelugu?: string | null;
};

export type PanchangamYear = {
  meta: {
    year: number;
    location: string;
    timezone: string;
    source: string;
    inputDir?: string;
    generatedAt?: string;
    monthCount?: number;
    dayCount?: number;
  };
  daysByDate: Record<string, Day>;
  monthsIndex?: Record<string, string[]>;
  monthsMeta?: Record<string, { month: number; monthLabel: string; daysInMonth: number }>;
  warnings?: { date: string; field: string; message: string }[];
};

export const YEAR = 2026;
export const TIMEZONE = 'America/New_York';

export type Lang = 'en' | 'te';

/**
 * Format a time range like "14:33–15:13" and append "+" if it rolls over
 * to the next day.
 */
export function formatTimeRange(r: any): string {
  if (!r) return '';
  const start = String((r as any).start ?? '').trim();
  const end = String((r as any).end ?? '').trim();
  if (!start || !end) return '';
  const rollover = Boolean((r as any).rollover);
  const plus = rollover && !end.endsWith('+') ? '+' : '';
  // Use an en dash for readability and match the mockup.
  return `${start}–${end}${plus}`;
}

/**
 * Format a list of time ranges with an optional prefix, e.g. "Du. 14:33–15:13".
 */
export function formatTimeRanges(prefix: string, ranges: any[] | undefined | null): string | null {
  if (!ranges || ranges.length === 0) return null;
  const parts = ranges
    .map(formatTimeRange)
    .filter((s) => s && s.length > 0);
  if (!parts.length) return null;
  return `${prefix} ${parts.join(', ')}`;
}

/**
 * Like formatTimeRanges() but returns one line per range, each prefixed.
 * Useful for month grid cells where multiple Durmuhurtham entries should stack.
 */
export function formatTimeRangesLines(prefix: string, ranges: any[] | undefined | null): string[] {
  if (!ranges || ranges.length === 0) return [];
  return ranges
    .map((r) => formatTimeRanges(prefix, [r]))
    .filter((s): s is string => !!s);
}

/**
 * Like formatTimeRangesLines(), but only prefixes the first line.
 * Example: ["Du. 10:27–11:04", "14:10–14:48"].
 *
 * This matches the desired month-cell rendering where multiple Durmuhurtham
 * ranges should be stacked tightly without repeating the "Du." label.
 */
export function formatTimeRangesLinesFirstPrefix(prefix: string, ranges: any[] | undefined | null): string[] {
  if (!ranges || ranges.length === 0) return [];
  const lines = ranges
    .map((r) => formatTimeRange(r))
    .filter((s): s is string => !!s);
  if (!lines.length) return [];
  return lines.map((line, idx) => (idx === 0 ? `${prefix} ${line}` : line));
}

function hasTeluguScript(s: string): boolean {
  return /[\u0C00-\u0C7F]/.test(s);
}

function normTelugu(s: string): string {
  return (s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[()\-–—,:;•]/g, '')
    .replace(/(ము|ం)$/u, '');
}

// Dataset 2026 uses Telugu masam as plain strings (e.g., "పుష్యము").
// For /en routes we translate the known set so English pages don't show Telugu.
const MASAM_TE_TO_EN: Record<string, string> = {
  [normTelugu('చైత్రము')]: 'Chaitra',
  [normTelugu('వైశాఖము')]: 'Vaisakha',
  [normTelugu('జ్యేష్ఠము')]: 'Jyeshtha',
  [normTelugu('అధిక జ్యేష్ఠము')]: 'Adhika Jyeshtha',
  [normTelugu('ఆషాఢము')]: 'Ashadha',
  [normTelugu('శ్రావణము')]: 'Shravana',
  [normTelugu('భాద్రపదము')]: 'Bhadrapada',
  [normTelugu('ఆశ్వయుజము')]: 'Ashwin',
  [normTelugu('కార్తీకము')]: 'Kartika',
  [normTelugu('మార్గశిరము')]: 'Margashirsha',
  [normTelugu('పుష్యము')]: 'Pausha',
  [normTelugu('మాఘము')]: 'Magha',
  [normTelugu('ఫాల్గుణము')]: 'Phalguna',
};

const NAKSHATRA_TE_TO_EN: Record<string, string> = {
  [normTelugu('అశ్విని')]: 'Ashwini',
  [normTelugu('భరణి')]: 'Bharani',
  [normTelugu('కృత్తిక')]: 'Krittika',
  [normTelugu('రోహిణి')]: 'Rohini',
  [normTelugu('మృగశిర')]: 'Mrigashirsha',
  [normTelugu('ఆర్ద్ర')]: 'Ardra',
  [normTelugu('ఆరుద్ర')]: 'Ardra',
  [normTelugu('పునర్వసు')]: 'Punarvasu',
  [normTelugu('పుష్యమి')]: 'Pushya',
  [normTelugu('పుష్య')]: 'Pushya',
  [normTelugu('ఆశ్లేష')]: 'Ashlesha',
  [normTelugu('మఘ')]: 'Magha',
  [normTelugu('పూర్వఫల్గుణి')]: 'Purva Phalguni',
  [normTelugu('ఉత్తర')]: 'Uttara',
  [normTelugu('ఉత్తరఫల్గుణి')]: 'Uttara Phalguni',
  [normTelugu('హస్త')]: 'Hasta',
  [normTelugu('చిత్త')]: 'Chitra',
  [normTelugu('చిత్తా')]: 'Chitra',
  [normTelugu('స్వాతి')]: 'Swati',
  [normTelugu('విశాఖ')]: 'Vishakha',
  [normTelugu('అనూరాధ')]: 'Anuradha',
  [normTelugu('జ్యేష్ఠ')]: 'Jyeshtha',
  [normTelugu('మూల')]: 'Mula',
  [normTelugu('పూర్వాషాఢ')]: 'Purva Ashadha',
  [normTelugu('ఉత్తరాషాఢ')]: 'Uttara Ashadha',
  [normTelugu('శ్రవణ')]: 'Shravana',
  [normTelugu('శ్రవణం')]: 'Shravana',
  [normTelugu('ధనిష్ఠ')]: 'Dhanishta',
  [normTelugu('శతభిష')]: 'Shatabhisha',
  [normTelugu('పూర్వభాద్ర')]: 'Purva Bhadrapada',
  [normTelugu('ఉత్తరాభాద్ర')]: 'Uttara Bhadrapada',
  [normTelugu('రేవతి')]: 'Revati',
};

const TITHI_TE_TO_EN: Record<string, string> = {
  [normTelugu('పాడ్యమి')]: 'Pratipada',
  [normTelugu('విదియ')]: 'Dvitiya',
  [normTelugu('తదియ')]: 'Tritiya',
  [normTelugu('చవితి')]: 'Chaturthi',
  [normTelugu('పంచమి')]: 'Panchami',
  [normTelugu('షష్ఠి')]: 'Shashthi',
  [normTelugu('సప్తమి')]: 'Saptami',
  [normTelugu('అష్టమి')]: 'Ashtami',
  [normTelugu('నవమి')]: 'Navami',
  [normTelugu('దశమి')]: 'Dashami',
  [normTelugu('ఏకాదశి')]: 'Ekadashi',
  [normTelugu('ద్వాదశి')]: 'Dwadashi',
  [normTelugu('త్రయోదశి')]: 'Trayodashi',
  [normTelugu('చతుర్దశి')]: 'Chaturdashi',
  [normTelugu('పౌర్ణమి')]: 'Purnima',
  [normTelugu('అమావాస్య')]: 'Amavasya',
};

function translateMasamIfNeeded(v: string, lang: Lang): string {
  if (lang === 'te') return v;
  if (!v || !hasTeluguScript(v)) return v;
  const mapped = MASAM_TE_TO_EN[normTelugu(v)];
  return mapped ?? v;
}

function translateNakshatraIfNeeded(v: string, lang: Lang): string {
  if (lang === 'te') return v;
  if (!v || !hasTeluguScript(v)) return v;
  const mapped = NAKSHATRA_TE_TO_EN[normTelugu(v)];
  return mapped ?? v;
}

function translateTithiLabelIfNeeded(v: string, lang: Lang): string {
  if (lang === 'te') return v;
  if (!v || !hasTeluguScript(v)) return v;

  // Dataset uses prefix like "శు." (Shukla) and "బ." (Krishna/Bahula)
  const m = v.match(/^(శు\.|బ\.)\s*(.+)$/u);
  if (!m) return v;
  const prefix = m[1];
  const rest = m[2];
  const phase = prefix.startsWith('శు') ? 'Shukla' : 'Krishna';
  const tithiEn = TITHI_TE_TO_EN[normTelugu(rest)] ?? rest;
  return `${phase} ${tithiEn}`;
}


export function pickLabel(v: any, lang: Lang): string {
  if (v == null) return '';
  if (typeof v === 'string') return translateMasamIfNeeded(v, lang);
  // Day fields (vaaram/paksham/ayanam/ruthuvu/masam/samvatsaram) may be KeyedLabel-like.
  if (typeof v === 'object') {
    const te = (v.telugu ?? v.te ?? v.label ?? '') as string;
    const en = (v.english ?? v.en ?? v.label ?? '') as string;
    return lang === 'te' ? (te || en) : (en || te);
  }
  return String(v);
}

export function pickTimedLabel(entry: any, lang: Lang): string {
  if (!entry) return '';
  // Newer data: { key, telugu, english, ... } plus legacy { label, ... }
  if (typeof entry === 'string') return entry;
  if (typeof entry === 'object') {
    const te = (entry.telugu ?? entry.label ?? '') as string;
    const en = (entry.english ?? entry.label ?? '') as string;
    if (lang === 'te') return te || en;
    // English: prefer explicit english; otherwise translate known Telugu labels.
    if (en && !hasTeluguScript(en)) return en;
    const base = te || en;
    // Detect tithi-style label with prefix or nakshatra.
    const tithiMaybe = translateTithiLabelIfNeeded(base, lang);
    if (tithiMaybe !== base) return tithiMaybe;
    return translateNakshatraIfNeeded(base, lang);
  }
  return String(entry);
}

export async function loadYearData(): Promise<PanchangamYear> {
  // Read JSON from disk (avoids stale module-cache issues during dev and ensures updated data is used).
  // Use process.cwd() so it always reads from the *project root* you are running (important when multiple
  // copies of this repo exist on disk).
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const filePath = path.join(process.cwd(), 'data', '2026-daysByDate.json');
  const txt = await fs.readFile(filePath, 'utf8');

  // The source HTML extraction step can occasionally leave trailing commas in arrays/objects.
  // Strip them so the site can still build without manual JSON cleanup.
  const cleaned = txt.replace(/,\s*(\}|\])/g, '$1');
  return JSON.parse(cleaned) as PanchangamYear;
}

export function etTodayISO(): string {
  // Returns YYYY-MM-DD in America/New_York, regardless of the user device timezone.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const map = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function formatHumanDate(isoDate: string): { title: string; weekday: string } {
  const d = new Date(`${isoDate}T12:00:00Z`); // stable parsing
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const parts = dtf.formatToParts(d);
  const weekday = parts.find(p => p.type === 'weekday')?.value ?? '';
  const month = parts.find(p => p.type === 'month')?.value ?? '';
  const day = parts.find(p => p.type === 'day')?.value ?? '';
  const year = parts.find(p => p.type === 'year')?.value ?? '';
  return { title: `${month} ${day}, ${year}`, weekday };
}

export function formatHumanDateLang(isoDate: string, lang: Lang): { title: string; weekday: string } {
  const d = new Date(`${isoDate}T12:00:00Z`);
  const locale = lang === 'te' ? 'te-IN' : 'en-US';
  const dtf = new Intl.DateTimeFormat(locale, {
    timeZone: TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const parts = dtf.formatToParts(d);
  const weekday = parts.find(p => p.type === 'weekday')?.value ?? '';
  const month = parts.find(p => p.type === 'month')?.value ?? '';
  const day = parts.find(p => p.type === 'day')?.value ?? '';
  const year = parts.find(p => p.type === 'year')?.value ?? '';
  // te-IN typically returns "YYYY, Month Day" ordering; normalize to "Month Day, Year" for consistency.
  const title = lang === 'te' ? `${month} ${day}, ${year}` : `${month} ${day}, ${year}`;
  return { title, weekday };
}

export function isoToYM(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function ymToLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1, 15));
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: TIMEZONE }).format(d);
}

export function ymToLabelLang(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1, 15));
  const locale = lang === 'te' ? 'te-IN' : 'en-US';
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: TIMEZONE }).format(d);
}

export function monthDays(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  // JS month is 0-based; day 0 of next month is last day of current month
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function weekdayIndexSun0(isoDate: string): number {
  // Return 0=Sun...6=Sat in America/New_York
  const d = new Date(`${isoDate}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: TIMEZONE }).format(d);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday] ?? 0;
}

export function normalizeFestivalList(
  festivals: any[] | undefined | null,
  lang: Lang
): { name: string; key?: string }[] {
  if (!festivals || festivals.length === 0) return [];
  return festivals
    .map((f: any) => {
      // Old format: string
      if (typeof f === 'string') return { name: f };

      // New format: { key, telugu, english }
      if (f && typeof f === 'object') {
        const key = typeof f.key === 'string' ? f.key : undefined;
        const tel = typeof f.telugu === 'string' ? f.telugu : undefined;
        const eng = typeof f.english === 'string' ? f.english : undefined;

        if (tel || eng) {
          const name = lang === 'te' ? (tel ?? eng ?? '') : (eng ?? tel ?? '');
          if (name) return { name, key };
        }

        // Legacy object formats
        if (typeof f.name === 'string') return { name: f.name, key };
        if (typeof f.title === 'string') return { name: f.title, key };
      }

      return null;
    })
    .filter(Boolean) as { name: string; key?: string }[];
}

export function nextPrevDates(allDatesSorted: string[], isoDate: string): { prev?: string; next?: string } {
  const idx = allDatesSorted.indexOf(isoDate);
  return {
    prev: idx > 0 ? allDatesSorted[idx - 1] : undefined,
    next: idx >= 0 && idx < allDatesSorted.length - 1 ? allDatesSorted[idx + 1] : undefined
  };
}