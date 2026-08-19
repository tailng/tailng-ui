import type { RegistryItem } from '../registry.types';

const types = `export type TngConfettiOrigin = 'bottom' | 'center';
export type TngConfettiVariant = 'paper';
export type TngConfettiReducedMotion = boolean | 'auto';
export type TngConfettiPiece = Readonly<{ id: number; startX: number; startY: number; apexX: number; apexY: number; endX: number; endY: number; rotation: number; delay: number; animationDuration: number; color: string; scale: number; aspectRatio: number; }>;
`;

const utils = `import type { TngConfettiOrigin, TngConfettiPiece } from './tng-confetti.types';
export const TNG_CONFETTI_DEFAULT_COLORS: readonly string[] = Object.freeze(['var(--tng-confetti-color-1, #ef4444)', 'var(--tng-confetti-color-2, #f59e0b)', 'var(--tng-confetti-color-3, #22c55e)', 'var(--tng-confetti-color-4, #3b82f6)', 'var(--tng-confetti-color-5, #a855f7)']);
export function normalizeTngConfettiPieces(value: number): number { return Number.isFinite(value) ? Math.min(Math.max(Math.floor(value), 0), 300) : 0; }
export function normalizeTngConfettiDuration(value: number): number { return Number.isFinite(value) ? Math.max(value, 0) : 0; }
export function resolveTngConfettiColors(colors: readonly string[] | null): readonly string[] { return colors === null || colors.length === 0 ? TNG_CONFETTI_DEFAULT_COLORS : [...colors]; }
function between(random: () => number, min: number, max: number): number { return min + random() * (max - min); }
export function generateTngConfettiPieces(options: Readonly<{ count: number; duration: number; origin: TngConfettiOrigin; colors: readonly string[]; random?: () => number; }>): readonly TngConfettiPiece[] {
  const random = options.random ?? Math.random; const count = normalizeTngConfettiPieces(options.count); const duration = normalizeTngConfettiDuration(options.duration); const colors = resolveTngConfettiColors(options.colors);
  return Array.from({ length: count }, (_, id) => { const delay = duration * between(random, 0, .12); const apexX = between(random, 5, 95); return Object.freeze({ id, startX: between(random, -4, 4), startY: 0, apexX, apexY: options.origin === 'bottom' ? between(random, 22, 62) : between(random, 4, 38), endX: Math.min(105, Math.max(-5, apexX + between(random, -12, 12))), endY: 110, rotation: between(random, -900, 900), delay, animationDuration: Math.max(duration - delay, 0), color: colors[Math.floor(random() * colors.length)] ?? colors[0], scale: between(random, .65, 1.35), aspectRatio: between(random, .55, 1.35) }); });
}
`;

const component = `import { DOCUMENT } from '@angular/common';
import { booleanAttribute, Component, DestroyRef, effect, inject, input, output, signal, untracked } from '@angular/core';
import type { TngConfettiOrigin, TngConfettiPiece, TngConfettiReducedMotion, TngConfettiVariant } from './tng-confetti.types';
import { generateTngConfettiPieces, normalizeTngConfettiDuration, normalizeTngConfettiPieces, resolveTngConfettiColors } from './tng-confetti.utils';
@Component({ selector: 'tng-confetti', templateUrl: './tng-confetti.html', styleUrl: './tng-confetti.css', host: { class: 'tng-confetti' } })
export class TngConfetti {
  private readonly documentRef = inject(DOCUMENT); private readonly destroyRef = inject(DestroyRef); private timer: ReturnType<typeof setTimeout> | null = null; private previousActive = false;
  readonly active = input<boolean, boolean | string>(false, { transform: booleanAttribute }); readonly origin = input<TngConfettiOrigin>('bottom'); readonly variant = input<TngConfettiVariant>('paper');
  readonly duration = input<number, number | string>(3000, { transform: value => normalizeTngConfettiDuration(Number(value)) }); readonly pieces = input<number, number | string>(120, { transform: value => normalizeTngConfettiPieces(Number(value)) });
  readonly fullscreen = input<boolean, boolean | string>(true, { transform: booleanAttribute }); readonly reducedMotion = input<TngConfettiReducedMotion>('auto'); readonly colors = input<string[] | null>(null); readonly zIndex = input<number | null>(null); readonly completed = output<void>();
  protected readonly renderedPieces = signal<readonly TngConfettiPiece[]>([]); protected readonly running = signal(false); protected readonly launchFullscreen = signal(true); protected readonly launchOrigin = signal<TngConfettiOrigin>('bottom'); protected readonly launchDuration = signal(0); protected readonly launchZIndex = signal<number | null>(null);
  constructor() { effect(() => { const active = this.active(); untracked(() => { if (active && !this.previousActive) this.launch(); if (!active && this.previousActive) this.cancel(); this.previousActive = active; }); }); this.destroyRef.onDestroy(() => this.cancel()); }
  private launch(): void { const view = this.documentRef.defaultView; if (view === null) return; this.cancel(); const duration = this.duration(); const reduced = this.reducedMotion() === true || (this.reducedMotion() === 'auto' && view.matchMedia('(prefers-reduced-motion: reduce)').matches); this.launchFullscreen.set(this.fullscreen()); this.launchOrigin.set(this.origin()); this.launchDuration.set(duration); this.launchZIndex.set(this.zIndex()); this.renderedPieces.set(reduced ? [] : generateTngConfettiPieces({ count: this.pieces(), duration, origin: this.origin(), colors: resolveTngConfettiColors(this.colors()) })); this.running.set(!reduced); this.timer = setTimeout(() => { this.timer = null; this.renderedPieces.set([]); this.running.set(false); this.completed.emit(); }, reduced ? 0 : duration); }
  private cancel(): void { if (this.timer !== null) clearTimeout(this.timer); this.timer = null; this.renderedPieces.set([]); this.running.set(false); }
}
`;

const html = `@if (running()) {
<div class="tng-confetti-overlay" aria-hidden="true" data-slot="confetti" [attr.data-fullscreen]="launchFullscreen()" [attr.data-origin]="launchOrigin()" [style.--tng-confetti-duration]="launchDuration() + 'ms'" [style.--tng-confetti-z-index]="launchZIndex()">
@for (piece of renderedPieces(); track piece.id) { <span class="tng-confetti-piece" [style.--tng-confetti-start-x]="piece.startX + '%'" [style.--tng-confetti-start-y]="piece.startY + '%'" [style.--tng-confetti-apex-x]="piece.apexX + '%'" [style.--tng-confetti-apex-y]="piece.apexY + '%'" [style.--tng-confetti-end-x]="piece.endX + '%'" [style.--tng-confetti-end-y]="piece.endY + '%'" [style.--tng-confetti-rotation]="piece.rotation + 'deg'" [style.--tng-confetti-delay]="piece.delay + 'ms'" [style.--tng-confetti-piece-duration]="piece.animationDuration + 'ms'" [style.--tng-confetti-piece-color]="piece.color" [style.--tng-confetti-scale]="piece.scale" [style.--tng-confetti-aspect-ratio]="piece.aspectRatio"></span> }
</div> }
`;

const css = `:host{pointer-events:none}.tng-confetti-overlay{inset:0;overflow:hidden;pointer-events:none;position:fixed;z-index:var(--tng-confetti-z-index,9999);--tng-confetti-origin-x:50%;--tng-confetti-origin-y:100%}.tng-confetti-overlay[data-fullscreen='false']{position:absolute}.tng-confetti-overlay[data-origin='center']{--tng-confetti-origin-y:50%}.tng-confetti-piece{animation:tng-confetti-paper var(--tng-confetti-piece-duration,var(--tng-confetti-duration,3000ms)) cubic-bezier(.16,.7,.3,1) var(--tng-confetti-delay,0ms) both;aspect-ratio:var(--tng-confetti-aspect-ratio,.7);background:var(--tng-confetti-piece-color);height:calc(var(--tng-confetti-piece-size,8px)*var(--tng-confetti-scale,1));left:calc(var(--tng-confetti-origin-x) + var(--tng-confetti-start-x,0%));opacity:0;position:absolute;top:calc(var(--tng-confetti-origin-y) + var(--tng-confetti-start-y,0%));will-change:left,top,opacity,transform}@keyframes tng-confetti-paper{0%{opacity:0;transform:translate(-50%,-50%) rotate(0)}8%{opacity:var(--tng-confetti-opacity,1)}48%{left:var(--tng-confetti-apex-x);top:var(--tng-confetti-apex-y);opacity:var(--tng-confetti-opacity,1);transform:translate(-50%,-50%) rotate(calc(var(--tng-confetti-rotation)*.55))}100%{left:var(--tng-confetti-end-x);top:var(--tng-confetti-end-y);opacity:0;transform:translate(-50%,-50%) rotate(var(--tng-confetti-rotation))}}@media(prefers-reduced-motion:reduce){.tng-confetti-piece{animation:none}}
`;

export const confettiRegistryItem = {
  name: 'confetti',
  dependencies: [],
  description: 'Ownable DOM and CSS paper-confetti celebration component.',
  install: {
    importPath: './tailng-ui/confetti',
    importSymbols: ['TngConfetti'],
  },
  files: [
    { path: 'src/app/tailng-ui/confetti/tng-confetti.ts', content: component },
    { path: 'src/app/tailng-ui/confetti/tng-confetti.types.ts', content: types },
    { path: 'src/app/tailng-ui/confetti/tng-confetti.utils.ts', content: utils },
    { path: 'src/app/tailng-ui/confetti/tng-confetti.html', content: html },
    { path: 'src/app/tailng-ui/confetti/tng-confetti.css', content: css },
    {
      path: 'src/app/tailng-ui/confetti/index.ts',
      content: `export * from './tng-confetti';\nexport * from './tng-confetti.types';\nexport * from './tng-confetti.utils';\n`,
    },
  ],
} satisfies RegistryItem;
