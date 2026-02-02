import { Injectable } from '@angular/core';
import { TngDateAdapter, TngDateInput } from './tng-date-adapter';

@Injectable({ providedIn: 'root' })
export class TngNativeDateAdapter implements TngDateAdapter {
  now(): Date {
    return new Date();
  }

  from(value: TngDateInput): Date | null {
    const d = new Date(value as any);
    return this.isValid(d) ? d : null;
  }

  isValid(date: Date): boolean {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  year(date: Date): number { return date.getFullYear(); }
  month(date: Date): number { return date.getMonth(); }
  date(date: Date): number { return date.getDate(); }
  day(date: Date): number { return date.getDay(); }

  daysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  setYear(date: Date, year: number): Date {
    const d = new Date(date);
    d.setFullYear(year);
    return d;
  }

  setMonth(date: Date, month0: number): Date {
    const d = new Date(date);
    d.setMonth(month0);
    return d;
  }

  setDate(date: Date, dayOfMonth: number): Date {
    const d = new Date(date);
    d.setDate(dayOfMonth);
    return d;
  }

  addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  startOfMonth(date: Date): Date {
    return this.startOfDay(new Date(this.year(date), this.month(date), 1));
  }

  endOfMonth(date: Date): Date {
    return this.startOfDay(new Date(this.year(date), this.month(date) + 1, 0));
  }

  startOfYear(date: Date): Date {
    return this.startOfDay(new Date(this.year(date), 0, 1));
  }

  endOfYear(date: Date): Date {
    return this.startOfDay(new Date(this.year(date), 11, 31));
  }

  isSameDay(a: Date, b: Date): boolean {
    return this.year(a) === this.year(b) && this.month(a) === this.month(b) && this.date(a) === this.date(b);
  }

  isBeforeDay(a: Date, b: Date): boolean {
    return this.startOfDay(a).getTime() < this.startOfDay(b).getTime();
  }

  isAfterDay(a: Date, b: Date): boolean {
    return this.startOfDay(a).getTime() > this.startOfDay(b).getTime();
  }

  format(date: Date, format: string, _locale?: string): string {
    const dd = String(this.date(date)).padStart(2, '0');
    const mm = String(this.month(date) + 1).padStart(2, '0');
    const yyyy = String(this.year(date));

    if (format === 'DD/MM/YYYY') return `${dd}/${mm}/${yyyy}`;
    if (format === 'MM/DD/YYYY') return `${mm}/${dd}/${yyyy}`;
    if (format === 'DD-MM-YYYY') return `${dd}-${mm}-${yyyy}`;
    if (format === 'MM-DD-YYYY') return `${mm}-${dd}-${yyyy}`;

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if (format === 'DD MMM YYYY') return `${dd} ${months[this.month(date)]} ${yyyy}`;

    return `${dd}/${mm}/${yyyy}`;
  }

  parse(text: string, format: string, _locale?: string): Date | null {
    const s = text.trim();
    if (!s) return null;

    if (format === 'DD/MM/YYYY') {
      const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return null;

      const dd = Number(m[1]);
      const mm = Number(m[2]);
      const yyyy = Number(m[3]);

      const d = new Date(yyyy, mm - 1, dd);
      if (!this.isValid(d)) return null;
      if (this.month(d) !== mm - 1 || this.date(d) !== dd) return null;

      return this.startOfDay(d);
    }

    if (format === 'MM/DD/YYYY') {
      const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return null;

      const mm = Number(m[1]);
      const dd = Number(m[2]);
      const yyyy = Number(m[3]);

      const d = new Date(yyyy, mm - 1, dd);
      if (!this.isValid(d)) return null;
      if (this.month(d) !== mm - 1 || this.date(d) !== dd) return null;

      return this.startOfDay(d);
    }

    if (format === 'DD-MM-YYYY') {
      const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (!m) return null;

      const dd = Number(m[1]);
      const mm = Number(m[2]);
      const yyyy = Number(m[3]);

      const d = new Date(yyyy, mm - 1, dd);
      if (!this.isValid(d)) return null;
      if (this.month(d) !== mm - 1 || this.date(d) !== dd) return null;

      return this.startOfDay(d);
    }

    if (format === 'MM-DD-YYYY') {
      const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (!m) return null;

      const mm = Number(m[1]);
      const dd = Number(m[2]);
      const yyyy = Number(m[3]);

      const d = new Date(yyyy, mm - 1, dd);
      if (!this.isValid(d)) return null;
      if (this.month(d) !== mm - 1 || this.date(d) !== dd) return null;

      return this.startOfDay(d);
    }

    if (format === 'DD MMM YYYY') {
      const m = s.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
      if (!m) return null;

      const dd = Number(m[1]);
      const mon = m[2].toLowerCase();
      const yyyy = Number(m[3]);

      const map: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      };
      const month0 = map[mon];
      if (month0 == null) return null;

      const d = new Date(yyyy, month0, dd);
      if (this.month(d) !== month0 || this.date(d) !== dd) return null;

      return this.startOfDay(d);
    }

    return null;
  }
}