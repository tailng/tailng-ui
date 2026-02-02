import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ContentChild,
  ElementRef,
  effect,
  input,
  output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OptionTplContext } from '@tociva/tailng-cdk/util';

import { TngOverlayPanel } from '../overlay-panel/overlay-panel.component';

type TypeaheadMatchMode = 'startsWith' | 'includes';
export type TngOptionListKeyAction = 'move' | 'select' | 'typeahead' | 'none';

export type TngOptionListKeyStroke = {
  key: string;
  handled: boolean;
  prevented: boolean;
  action: TngOptionListKeyAction;
  nextActiveIndex?: number;
  query?: string;
  originalEvent: KeyboardEvent;
};

@Component({
  selector: 'tng-option-list',
  standalone: true,
  imports: [CommonModule, TngOverlayPanel],
  templateUrl: './option-list.component.html',
})
export class TngOptionList<T> {
  // IMPORTANT: because #listbox is under @if branches (modal/non-modal),
  // keep static:false so Angular always resolves the *current* element.
  @ViewChild('listbox', { read: ElementRef })
  listbox?: ElementRef<HTMLElement>;

  /* =====================
   * Modal (optional)
   * ===================== */
  readonly modal = input<boolean>(false);

  /** overlay-panel options (only used when modal=true) */
  readonly panelKlass = input<string>('p-0');
  readonly restoreFocus = input<boolean>(true);
  readonly autoCapture = input<boolean>(true);
  readonly deferCaptureElements = input<boolean>(false);

  /** a11y (for listbox container) */
  readonly ariaLabel = input<string>(''); // applied to listbox container
  readonly ariaLabelledby = input<string>('');
  readonly ariaDescribedby = input<string>('');

  /**
   * tabindex for listbox container:
   * - Default: 0 (focusable, good for keyboard + typeahead)
   * - Set -1 for programmatic focus only
   * - Set null to omit tabindex attribute
   */
  readonly tabindex = input<number | null>(0);

  /* =====================
   * Templates + data
   * ===================== */
  readonly optionTemplate = input<TemplateRef<OptionTplContext<T>> | null>(null);

  readonly items = input<T[]>([]);
  readonly activeIndex = input<number>(-1);

  readonly displayWith = input<(item: T) => string>((v) => String(v));
  readonly emptyText = input<string>('No results');

  readonly containerKlass = input<string>('py-1 overflow-auto max-h-60');
  readonly optionKlass = input<string>('px-3 py-2 text-sm cursor-pointer select-none');
  readonly optionActiveKlass = input<string>('bg-primary text-on-primary');
  readonly optionInactiveKlass = input<string>('bg-bg text-fg');
  readonly emptyKlass = input<string>('px-3 py-2 text-sm text-disable');

  @ContentChild(TemplateRef, { descendants: true })
  optionTpl?: TemplateRef<OptionTplContext<T>>;

  /* =====================
   * Outputs
   * ===================== */
  readonly optionMouseDown = output<{ item: T; index: number }>();
  readonly optionHover = output<number>();

  /** Parent-controlled active index */
  readonly activeIndexChange = output<number>();

  /** Parent decides what selection means */
  readonly requestSelectActive = output<void>();

  /** Optional: parent can observe typeahead match */
  readonly requestTypeaheadMatch = output<{ query: string; index: number }>();

  /** Optional: key stroke propagation */
  readonly propagateKeys = input<boolean>(false);
  readonly keyStroke = output<TngOptionListKeyStroke>();

  /* =====================
   * Keyboard / typeahead config
   * ===================== */
  readonly keyboard = input<boolean>(true);
  readonly loop = input<boolean>(true);
  readonly selectOnEnter = input<boolean>(true);
  readonly typeahead = input<boolean>(true);
  readonly typeaheadMode = input<TypeaheadMatchMode>('startsWith');
  readonly typeaheadResetMs = input<number>(500);
  readonly pageJumpSize = input<number>(8);

  private readonly typeaheadQuery = signal('');
  private typeaheadTimer: number | null = null;

  /* =====================
   * Computeds
   * ===================== */
  readonly hasItems = computed(() => (this.items()?.length ?? 0) > 0);

  constructor() {
    /**
     * Scroll follows the controlled `activeIndex`:
     * This guarantees scrolling even when parent changes activeIndex via:
     * - hover
     * - open() initialization
     * - programmatic updates
     * - any external state
     *
     * (Not just when OptionList handles keydown.)
     */
    effect(() => {
      const i = this.activeIndex();
      if (i < 0) return;

      // Wait for DOM update / projection / overlay paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.scrollIndexIntoView(i));
      });
    });
  }

  get tpl(): TemplateRef<OptionTplContext<T>> | undefined {
    return this.optionTemplate() ?? this.optionTpl;
  }

  display(item: T) {
    return this.displayWith()(item);
  }

  isActive(i: number) {
    return i === this.activeIndex();
  }

  optionClasses(i: number) {
    const state = this.isActive(i) ? this.optionActiveKlass() : this.optionInactiveKlass();
    return `${this.optionKlass()} ${state}`.trim();
  }

  onMouseDown(item: T, index: number, ev: MouseEvent) {
    ev.preventDefault();
    this.optionMouseDown.emit({ item, index });
  }

  onMouseEnter(index: number) {
    this.optionHover.emit(index);
  }

  /* =====================
   * Keyboard handling
   * ===================== */
  onKeydown(ev: KeyboardEvent): void {
    const key = ev.key;

    if (!this.hasItems()) {
      this.emitKeyStroke({ key, handled: false, prevented: false, action: 'none', originalEvent: ev });
      return;
    }

    if (ev.defaultPrevented) {
      this.emitKeyStroke({ key, handled: false, prevented: false, action: 'none', originalEvent: ev });
      return;
    }

    const anyEv = ev as any;
    if (anyEv.isComposing === true || anyEv.keyCode === 229) {
      this.emitKeyStroke({ key, handled: false, prevented: false, action: 'none', originalEvent: ev });
      return;
    }

    if (!this.keyboard()) {
      this.emitKeyStroke({ key, handled: false, prevented: false, action: 'none', originalEvent: ev });
      return;
    }

    // Navigation
    if (key === 'ArrowDown') {
      ev.preventDefault();
      const next = this.computeNextIndex(1);
      this.commitActive(next);
      this.emitKeyStroke({ key, handled: true, prevented: true, action: 'move', nextActiveIndex: next, originalEvent: ev });
      return;
    }

    if (key === 'ArrowUp') {
      ev.preventDefault();
      const next = this.computeNextIndex(-1);
      this.commitActive(next);
      this.emitKeyStroke({ key, handled: true, prevented: true, action: 'move', nextActiveIndex: next, originalEvent: ev });
      return;
    }

    if (key === 'Home') {
      ev.preventDefault();
      const next = 0;
      this.commitActive(next);
      this.emitKeyStroke({ key, handled: true, prevented: true, action: 'move', nextActiveIndex: next, originalEvent: ev });
      return;
    }

    if (key === 'End') {
      ev.preventDefault();
      const next = this.items().length - 1;
      this.commitActive(next);
      this.emitKeyStroke({ key, handled: true, prevented: true, action: 'move', nextActiveIndex: next, originalEvent: ev });
      return;
    }

    if (key === 'PageDown') {
      ev.preventDefault();
      const next = this.computeNextIndex(this.pageJumpSize());
      this.commitActive(next);
      this.emitKeyStroke({ key, handled: true, prevented: true, action: 'move', nextActiveIndex: next, originalEvent: ev });
      return;
    }

    if (key === 'PageUp') {
      ev.preventDefault();
      const next = this.computeNextIndex(-this.pageJumpSize());
      this.commitActive(next);
      this.emitKeyStroke({ key, handled: true, prevented: true, action: 'move', nextActiveIndex: next, originalEvent: ev });
      return;
    }

    // Selection
    if (key === 'Enter') {
      if (!this.selectOnEnter()) {
        this.emitKeyStroke({ key, handled: false, prevented: false, action: 'none', originalEvent: ev });
        return;
      }
      ev.preventDefault();
      this.requestSelectActive.emit();
      this.emitKeyStroke({ key, handled: true, prevented: true, action: 'select', originalEvent: ev });
      return;
    }

    // Typeahead
    if (this.typeahead() && this.isPrintableKey(ev)) {
      const { query, matchIndex } = this.onTypeaheadKey(key);

      if (matchIndex >= 0) {
        this.commitActive(matchIndex);
        this.emitKeyStroke({
          key,
          handled: true,
          prevented: false,
          action: 'typeahead',
          nextActiveIndex: matchIndex,
          query,
          originalEvent: ev,
        });
        return;
      }

      this.emitKeyStroke({ key, handled: true, prevented: false, action: 'typeahead', query, originalEvent: ev });
      return;
    }

    this.emitKeyStroke({ key, handled: false, prevented: false, action: 'none', originalEvent: ev });
  }

  private emitKeyStroke(e: TngOptionListKeyStroke): void {
    if (!this.propagateKeys()) return;
    this.keyStroke.emit(e);
  }

  private computeNextIndex(delta: number): number {
    const len = this.items().length;
    if (len <= 0) return -1;

    const current = this.activeIndex();
    const base = current < 0 ? (delta < 0 && this.loop() ? len - 1 : 0) : current;

    const nextRaw = base + delta;

    if (this.loop()) {
      return ((nextRaw % len) + len) % len;
    }

    return Math.max(0, Math.min(len - 1, nextRaw));
  }

  /**
   * Controlled activeIndex
   * - Emit activeIndexChange (parent owns state)
   * - Scrolling is handled by the effect() reacting to activeIndex()
   */
  private commitActive(index: number): void {
    if (index < 0) return;
    this.activeIndexChange.emit(index);
  }

  /**
   * Scroll the active option into view.
   * Let the browser pick the nearest scrollable ancestor.
   */
  private scrollIndexIntoView(index: number): void {
    const root = this.listbox?.nativeElement;
    if (!root) return;

    const optionEl = root.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!optionEl) return;

    optionEl.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'auto',
    });
  }

  /* =====================
   * Typeahead
   * ===================== */
  private onTypeaheadKey(char: string): { query: string; matchIndex: number } {
    if (this.typeaheadTimer != null) {
      window.clearTimeout(this.typeaheadTimer);
    }

    const nextQuery = (this.typeaheadQuery() + char).toLowerCase();
    this.typeaheadQuery.set(nextQuery);

    this.typeaheadTimer = window.setTimeout(() => {
      this.typeaheadQuery.set('');
      this.typeaheadTimer = null;
    }, this.typeaheadResetMs());

    const idx = this.findTypeaheadMatch(nextQuery);
    if (idx >= 0) {
      this.requestTypeaheadMatch.emit({ query: nextQuery, index: idx });
    }

    return { query: nextQuery, matchIndex: idx };
  }

  private findTypeaheadMatch(query: string): number {
    const items = this.items();
    const mode = this.typeaheadMode();

    const start = this.activeIndex();
    const from = start < 0 ? 0 : start + 1;

    const matches = (item: T) => {
      const label = this.display(item).toLowerCase();
      return mode === 'includes' ? label.includes(query) : label.startsWith(query);
    };

    for (let i = from; i < items.length; i++) if (matches(items[i])) return i;
    for (let i = 0; i < from && i < items.length; i++) if (matches(items[i])) return i;

    return -1;
  }

  private isPrintableKey(ev: KeyboardEvent): boolean {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
    if (ev.key.length !== 1) return false;
    if (ev.key === ' ') return false;
    return true;
  }
}
