import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  Renderer2,
} from '@angular/core';

const badgePositions = ['bottom-end', 'bottom-start', 'top-end', 'top-start'] as const;
const badgeSizes = ['lg', 'md', 'sm'] as const;
const badgeTones = ['danger', 'info', 'neutral', 'success', 'warning'] as const;
const badgeVariants = ['outline', 'soft', 'solid'] as const;

const badgePositionSet = new Set<TngBadgePosition>(badgePositions);
const badgeSizeSet = new Set<TngBadgeSize>(badgeSizes);
const badgeToneSet = new Set<TngBadgeTone>(badgeTones);
const badgeVariantSet = new Set<TngBadgeVariant>(badgeVariants);

const defaultBadgeMax = 99;
const defaultBadgePosition: TngBadgePosition = 'top-end';
const defaultBadgeSize: TngBadgeSize = 'md';
const defaultBadgeTone: TngBadgeTone = 'danger';
const defaultBadgeVariant: TngBadgeVariant = 'solid';

export type TngBadgePosition = (typeof badgePositions)[number];
export type TngBadgeSize = (typeof badgeSizes)[number];
export type TngBadgeStyleMap = Readonly<Record<string, number | string>>;
export type TngBadgeTone = (typeof badgeTones)[number];
export type TngBadgeVariant = (typeof badgeVariants)[number];

type TngBadgeToneColors = Readonly<{
  background: string;
  foreground: string;
}>;

type TngResolvedBadgePlacement = Readonly<{
  bottom: string | null;
  left: string | null;
  right: string | null;
  top: string | null;
  transform: string;
}>;

type ResizeObserverConstructor = new (callback: ResizeObserverCallback) => ResizeObserver;

function isNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function toRoundedNonNegative(value: number): number {
  return Math.max(0, Math.round(value));
}

export function normalizeTngBadgeMax(value: number): number {
  if (!Number.isFinite(value)) {
    return defaultBadgeMax;
  }

  return toRoundedNonNegative(value);
}

export function coerceTngBadgeMax(value: number | string): number {
  return normalizeTngBadgeMax(toNumber(value));
}

export function coerceTngBadgePosition(value: string): TngBadgePosition {
  if (badgePositionSet.has(value as TngBadgePosition)) {
    return value as TngBadgePosition;
  }

  return defaultBadgePosition;
}

export function coerceTngBadgeSize(value: string): TngBadgeSize {
  if (badgeSizeSet.has(value as TngBadgeSize)) {
    return value as TngBadgeSize;
  }

  return defaultBadgeSize;
}

export function coerceTngBadgeTone(value: string): TngBadgeTone {
  if (badgeToneSet.has(value as TngBadgeTone)) {
    return value as TngBadgeTone;
  }

  return defaultBadgeTone;
}

export function coerceTngBadgeVariant(value: string): TngBadgeVariant {
  if (badgeVariantSet.has(value as TngBadgeVariant)) {
    return value as TngBadgeVariant;
  }

  return defaultBadgeVariant;
}

export function resolveTngBadgeContent(
  value: number | string | null | undefined,
  max: number,
  dot: boolean,
): string {
  if (dot || value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return '';
    }

    const normalized = toRoundedNonNegative(value);
    if (normalized > max) {
      return `${max}+`;
    }

    return String(normalized);
  }

  return isNonEmptyText(value) ? value : '';
}

export function resolveTngBadgePlacement(position: TngBadgePosition): TngResolvedBadgePlacement {
  if (position === 'top-start') {
    return { bottom: null, left: '0', right: null, top: '0', transform: 'translate(-50%, -50%)' };
  }

  if (position === 'bottom-start') {
    return { bottom: '0', left: '0', right: null, top: null, transform: 'translate(-50%, 50%)' };
  }

  if (position === 'bottom-end') {
    return { bottom: '0', left: null, right: '0', top: null, transform: 'translate(50%, 50%)' };
  }

  return { bottom: null, left: null, right: '0', top: '0', transform: 'translate(50%, -50%)' };
}

export function toTngBadgeCssLength(value: number | string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return null;
    }

    return `${value}px`;
  }

  return isNonEmptyText(value) ? value.trim() : null;
}

function resolveTngBadgeToneColors(tone: TngBadgeTone): TngBadgeToneColors {
  if (tone === 'success') {
    return { background: '#16a34a', foreground: '#f0fdf4' };
  }

  if (tone === 'warning') {
    return { background: '#d97706', foreground: '#fffbeb' };
  }

  if (tone === 'danger') {
    return { background: '#dc2626', foreground: '#fef2f2' };
  }

  if (tone === 'neutral') {
    return { background: '#334155', foreground: '#f8fafc' };
  }

  return { background: '#2563eb', foreground: '#eff6ff' };
}

function hasVisibleBadge(hidden: boolean, dot: boolean, content: string): boolean {
  if (hidden) {
    return false;
  }

  return dot || content.length > 0;
}

function resolveResizeObserverConstructor(): ResizeObserverConstructor | null {
  const globalObject = globalThis as { ResizeObserver?: ResizeObserverConstructor };
  const resizeObserver = globalObject.ResizeObserver;
  return typeof resizeObserver === 'function' ? resizeObserver : null;
}

function toCssPixelLength(value: number): string {
  if (!Number.isFinite(value)) {
    return '0px';
  }

  return `${Math.max(0, value)}px`;
}

@Directive({
  selector: '[tngBadge]',
  exportAs: 'tngBadge',
})
export class TngBadge implements OnDestroy {
  public readonly tngBadge = input<number | string | null | undefined>(null);
  public readonly tngBadgeClass = input<string | null | undefined>(null);
  public readonly tngBadgeDisabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly tngBadgeStyle = input<TngBadgeStyleMap | null | undefined>(null);
  public readonly tngBadgeDot = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly tngBadgeHidden = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly tngBadgeMax = input<number, number | string>(defaultBadgeMax, {
    transform: coerceTngBadgeMax,
  });
  public readonly tngBadgeOffsetX = input<number | string | null | undefined>(null);
  public readonly tngBadgeOffsetY = input<number | string | null | undefined>(null);
  public readonly tngBadgePosition = input<TngBadgePosition, string>(defaultBadgePosition, {
    transform: coerceTngBadgePosition,
  });
  public readonly tngBadgeSize = input<TngBadgeSize, string>(defaultBadgeSize, {
    transform: coerceTngBadgeSize,
  });
  public readonly tngBadgeTone = input<TngBadgeTone, string>(defaultBadgeTone, {
    transform: coerceTngBadgeTone,
  });
  public readonly tngBadgeVariant = input<TngBadgeVariant, string>(defaultBadgeVariant, {
    transform: coerceTngBadgeVariant,
  });

  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private badgeElement: HTMLElement | null = null;
  private readonly customStyleKeys = new Set<string>();
  private resizeObserver: ResizeObserver | null = null;
  private removeWindowResizeListener: (() => void) | null = null;

  public constructor() {
    this.configureHost();
    effect((): void => {
      this.renderBadge();
    });
  }

  public ngOnDestroy(): void {
    this.destroyBadge();
  }

  private configureHost(): void {
    this.renderer.addClass(this.hostElement, 'tng-badge-host');
    this.renderer.setAttribute(this.hostElement, 'data-tng-badge-host', '');

    if (this.hostElement.style.position.length === 0) {
      this.renderer.setStyle(this.hostElement, 'position', 'relative');
    }
  }

  private renderBadge(): void {
    const content = resolveTngBadgeContent(this.tngBadge(), this.tngBadgeMax(), this.tngBadgeDot());
    if (!hasVisibleBadge(this.tngBadgeHidden(), this.tngBadgeDot(), content)) {
      this.destroyBadge();
      return;
    }

    this.ensureBadgeElement();
    this.beginRuntimePositionTracking();
    this.patchBadgeClasses();
    this.patchBadgeAttributes();
    this.patchBadgePlacement();
    this.patchBadgeVisualStyles();
    this.patchBadgeCustomStyles();
    this.patchBadgeRuntimeMetrics();
    this.patchBadgeContent(content);
  }

  private ensureBadgeElement(): HTMLElement {
    if (this.badgeElement !== null) {
      return this.badgeElement;
    }

    const badgeElement = this.renderer.createElement('span') as HTMLElement;
    this.renderer.appendChild(this.hostElement, badgeElement);
    this.badgeElement = badgeElement;
    return badgeElement;
  }

  private destroyBadge(): void {
    this.endRuntimePositionTracking();

    if (this.badgeElement === null) {
      return;
    }

    this.renderer.removeChild(this.hostElement, this.badgeElement);
    this.badgeElement = null;
    this.customStyleKeys.clear();
  }

  private patchBadgeAttributes(): void {
    if (this.badgeElement === null) {
      return;
    }

    const badgeElement = this.badgeElement;
    this.renderer.setAttribute(badgeElement, 'aria-hidden', 'true');
    this.renderer.setAttribute(badgeElement, 'data-placement', this.tngBadgePosition());
    this.renderer.setAttribute(badgeElement, 'data-position', this.tngBadgePosition());
    this.renderer.setAttribute(badgeElement, 'data-size', this.tngBadgeSize());
    this.renderer.setAttribute(badgeElement, 'data-slot', 'badge');
    this.renderer.setAttribute(badgeElement, 'data-tone', this.tngBadgeTone());
    this.renderer.setAttribute(badgeElement, 'data-variant', this.tngBadgeVariant());

    if (this.tngBadgeDisabled()) {
      this.renderer.setAttribute(badgeElement, 'data-disabled', '');
    } else {
      this.renderer.removeAttribute(badgeElement, 'data-disabled');
    }

    if (this.tngBadgeDot()) {
      this.renderer.setAttribute(badgeElement, 'data-dot', '');
      return;
    }

    this.renderer.removeAttribute(badgeElement, 'data-dot');
  }

  private patchBadgeClasses(): void {
    if (this.badgeElement === null) {
      return;
    }

    const badgeElement = this.badgeElement;
    const className = this.tngBadgeClass() ?? '';
    const normalizedClassName = className.trim();
    const classes =
      normalizedClassName.length > 0 ? `tng-badge ${normalizedClassName}` : 'tng-badge';
    this.renderer.setAttribute(badgeElement, 'class', classes);
  }

  private patchBadgeContent(content: string): void {
    if (this.badgeElement === null) {
      return;
    }

    this.renderer.setProperty(this.badgeElement, 'textContent', content);
  }

  private patchBadgeCustomStyles(): void {
    if (this.badgeElement === null) {
      return;
    }

    const badgeElement = this.badgeElement;
    const nextStyleKeys = new Set<string>();
    const styleMap = this.tngBadgeStyle();
    if (styleMap !== null && styleMap !== undefined) {
      for (const [key, value] of Object.entries(styleMap)) {
        this.renderer.setStyle(badgeElement, key, String(value));
        nextStyleKeys.add(key);
      }
    }

    for (const key of this.customStyleKeys) {
      if (!nextStyleKeys.has(key)) {
        this.renderer.removeStyle(badgeElement, key);
      }
    }

    this.customStyleKeys.clear();
    for (const key of nextStyleKeys) {
      this.customStyleKeys.add(key);
    }
  }

  private patchBadgePlacement(): void {
    if (this.badgeElement === null) {
      return;
    }

    const placement = resolveTngBadgePlacement(this.tngBadgePosition());
    this.setNullableStyle('bottom', placement.bottom);
    this.setNullableStyle('left', placement.left);
    this.setNullableStyle('right', placement.right);
    this.setNullableStyle('top', placement.top);

    const offsetX = toTngBadgeCssLength(this.tngBadgeOffsetX()) ?? '0px';
    const offsetY = toTngBadgeCssLength(this.tngBadgeOffsetY()) ?? '0px';
    const transform = `${placement.transform} translate(${offsetX}, ${offsetY})`;
    this.renderer.setStyle(this.badgeElement, 'transform', transform);
  }

  private patchBadgeRuntimeMetrics(): void {
    if (this.badgeElement === null) {
      return;
    }

    const hostRect = this.hostElement.getBoundingClientRect();
    const badgeRect = this.badgeElement.getBoundingClientRect();
    this.badgeElement.style.setProperty('--tng-badge-anchor-width', toCssPixelLength(hostRect.width));
    this.badgeElement.style.setProperty('--tng-badge-anchor-height', toCssPixelLength(hostRect.height));
    this.badgeElement.style.setProperty('--tng-badge-self-width', toCssPixelLength(badgeRect.width));
    this.badgeElement.style.setProperty('--tng-badge-self-height', toCssPixelLength(badgeRect.height));
  }

  private patchBadgeVisualStyles(): void {
    if (this.badgeElement === null) {
      return;
    }

    const badgeElement = this.badgeElement;
    const toneColors = resolveTngBadgeToneColors(this.tngBadgeTone());
    const sharedStyles = this.resolveSharedStyles(toneColors);
    for (const [property, value] of sharedStyles) {
      this.renderer.setStyle(badgeElement, property, value);
    }

    if (this.tngBadgeDot()) {
      this.patchDotStyles();
      return;
    }

    this.patchContentStyles();
  }

  private patchContentStyles(): void {
    if (this.badgeElement === null) {
      return;
    }

    this.renderer.setStyle(this.badgeElement, 'height', 'var(--tng-badge-size, 1.125rem)');
    this.renderer.setStyle(this.badgeElement, 'min-width', 'var(--tng-badge-size, 1.125rem)');
    this.renderer.setStyle(
      this.badgeElement,
      'padding-inline',
      'var(--tng-badge-padding-x, 0.3rem)',
    );
  }

  private patchDotStyles(): void {
    if (this.badgeElement === null) {
      return;
    }

    this.renderer.setStyle(this.badgeElement, 'height', 'var(--tng-badge-dot-size, 0.625rem)');
    this.renderer.setStyle(this.badgeElement, 'min-width', 'var(--tng-badge-dot-size, 0.625rem)');
    this.renderer.setStyle(this.badgeElement, 'padding-inline', '0');
  }

  private resolveSharedStyles(
    toneColors: TngBadgeToneColors,
  ): readonly Readonly<[string, string]>[] {
    return [
      ['align-items', 'center'],
      ['background', `var(--tng-badge-bg, ${toneColors.background})`],
      ['border-radius', 'var(--tng-badge-radius, var(--tng-radius-control, 0.5rem))'],
      ['box-sizing', 'border-box'],
      ['color', `var(--tng-badge-fg, ${toneColors.foreground})`],
      ['display', 'inline-flex'],
      ['font-size', 'var(--tng-badge-font-size, 0.7rem)'],
      ['font-weight', 'var(--tng-badge-font-weight, 700)'],
      ['justify-content', 'center'],
      ['line-height', '1'],
      ['pointer-events', 'none'],
      ['position', 'absolute'],
      ['white-space', 'nowrap'],
      ['z-index', 'var(--tng-badge-z-index, 1)'],
    ];
  }

  private setNullableStyle(property: string, value: string | null): void {
    if (this.badgeElement === null) {
      return;
    }

    if (value === null) {
      this.renderer.removeStyle(this.badgeElement, property);
      return;
    }

    this.renderer.setStyle(this.badgeElement, property, value);
  }

  private beginRuntimePositionTracking(): void {
    if (this.badgeElement === null) {
      return;
    }

    const resizeObserverConstructor = resolveResizeObserverConstructor();
    if (resizeObserverConstructor !== null) {
      if (this.resizeObserver === null) {
        this.resizeObserver = new resizeObserverConstructor(() => {
          this.syncRuntimePositioning();
        });
      }

      this.resizeObserver.observe(this.hostElement);
      this.resizeObserver.observe(this.badgeElement);
      return;
    }

    if (this.removeWindowResizeListener === null) {
      this.removeWindowResizeListener = this.renderer.listen('window', 'resize', () => {
        this.syncRuntimePositioning();
      });
    }
  }

  private endRuntimePositionTracking(): void {
    if (this.resizeObserver !== null) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.removeWindowResizeListener !== null) {
      this.removeWindowResizeListener();
      this.removeWindowResizeListener = null;
    }
  }

  private syncRuntimePositioning(): void {
    if (this.badgeElement === null) {
      return;
    }

    this.patchBadgePlacement();
    this.patchBadgeRuntimeMetrics();
  }
}
