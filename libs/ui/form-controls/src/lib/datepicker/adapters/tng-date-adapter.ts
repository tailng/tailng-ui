import { InjectionToken } from '@angular/core';

export type TngDateInput = Date | string | number;

export interface TngDateAdapter {
  now(): Date;
  from(value: TngDateInput): Date | null;
  isValid(date: Date): boolean;
  startOfDay(date: Date): Date;

  year(date: Date): number;
  month(date: Date): number; // 0-11
  date(date: Date): number;  // 1-31
  day(date: Date): number;   // 0-6
  daysInMonth(date: Date): number;

  setYear(date: Date, year: number): Date;
  setMonth(date: Date, month0: number): Date;
  setDate(date: Date, dayOfMonth: number): Date;

  addDays(date: Date, days: number): Date;
  addMonths(date: Date, months: number): Date;

  startOfMonth(date: Date): Date;
  endOfMonth(date: Date): Date;
  startOfYear(date: Date): Date;
  endOfYear(date: Date): Date;

  isSameDay(a: Date, b: Date): boolean;
  isBeforeDay(a: Date, b: Date): boolean;
  isAfterDay(a: Date, b: Date): boolean;

  format(date: Date, format: string, locale?: string): string;
  parse(text: string, format: string, locale?: string): Date | null;
}

export const TNG_DATE_ADAPTER = new InjectionToken<TngDateAdapter>('TNG_DATE_ADAPTER');