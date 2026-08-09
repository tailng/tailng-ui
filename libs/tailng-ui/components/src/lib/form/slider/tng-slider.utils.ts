export type TngRangeSliderValue = Readonly<{
  min: number;
  max: number;
}>;

export type TngRangeSliderThumb = 'min' | 'max';

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function decimalPlaces(value: number): number {
  const [, fraction = ''] = String(value).toLowerCase().split('e');
  const exponent = Number(fraction);
  const decimal = String(value).split('.')[1]?.length ?? 0;
  return Math.max(0, decimal - (Number.isFinite(exponent) ? exponent : 0));
}

function roundForStep(value: number, step: number): number {
  const precision = Math.min(12, Math.max(decimalPlaces(value), decimalPlaces(step)));
  return Number(value.toFixed(precision));
}

export function clampTngSliderValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, finiteOr(value, min)));
}

export function snapTngSliderValue(value: number, min: number, max: number, step: number): number {
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const clamped = clampTngSliderValue(value, min, max);
  const stepped = min + Math.round((clamped - min) / safeStep) * safeStep;
  return clampTngSliderValue(roundForStep(stepped, safeStep), min, max);
}

export function tngSliderValuePercent(value: number, min: number, max: number): number {
  const span = max - min;
  if (!Number.isFinite(span) || span <= 0) {
    return 0;
  }

  return ((clampTngSliderValue(value, min, max) - min) / span) * 100;
}

export function normalizeTngRangeSliderGap(
  minGap: number,
  min: number,
  max: number,
  step: number,
): number {
  const span = Math.max(0, max - min);
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const requestedGap = Math.max(0, finiteOr(minGap, 0));
  const steppedGap = Math.ceil(requestedGap / safeStep) * safeStep;
  return clampTngSliderValue(roundForStep(steppedGap, safeStep), 0, span);
}

export function normalizeTngRangeSliderValue(
  value: TngRangeSliderValue,
  min: number,
  max: number,
  step: number,
  minGap: number,
): TngRangeSliderValue {
  const lowerBound = Math.min(min, max);
  const upperBound = Math.max(min, max);
  const gap = normalizeTngRangeSliderGap(minGap, lowerBound, upperBound, step);
  const first = snapTngSliderValue(finiteOr(value.min, lowerBound), lowerBound, upperBound, step);
  const second = snapTngSliderValue(finiteOr(value.max, upperBound), lowerBound, upperBound, step);
  let normalizedMin = Math.min(first, second);
  let normalizedMax = Math.max(first, second);

  if (normalizedMax - normalizedMin < gap) {
    normalizedMax = snapTngSliderValue(normalizedMin + gap, lowerBound, upperBound, step);

    if (normalizedMax - normalizedMin < gap) {
      normalizedMin = snapTngSliderValue(normalizedMax - gap, lowerBound, upperBound, step);
    }
  }

  return { min: normalizedMin, max: normalizedMax };
}
