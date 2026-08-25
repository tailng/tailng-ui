import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  computed,
  effect,
  inject,
  input,
  signal,
  type OnInit,
  type Signal,
} from '@angular/core';
import type {
  TngDateCell,
  TngDateRangePickerAttributeMap,
  TngDateRangePickerController,
  TngDateRangePickerOutputs,
  TngMonthOption,
  TngYearOption,
} from './date-range-picker.types';

type TngDateRangePickerControllerLike = TngDateRangePickerController<any>;
export type TngBoundDateRangePicker<TDate> = Readonly<{
  outputs: Signal<TngDateRangePickerOutputs<TDate>>;
  periodLabel: Signal<string>;
}>;

export function resolveTngDateRangePickerPeriodLabel<TDate>(
  controller: TngDateRangePickerController<TDate>,
  outputs: TngDateRangePickerOutputs<TDate>,
): string {
  if (outputs.view === 'year') {
    const startYear = outputs.yearOptions[0]?.year;
    const endYear = outputs.yearOptions[outputs.yearOptions.length - 1]?.year;
    if (startYear !== undefined && endYear !== undefined) {
      return `${startYear} - ${endYear}`;
    }
  }

  if (outputs.view === 'month') {
    return controller.formatDate(outputs.visibleMonth, 'year-label');
  }

  return outputs.labelMonthYear;
}

export function bindTngDateRangePicker<TDate>(
  controller: TngDateRangePickerController<TDate>,
): TngBoundDateRangePicker<TDate> {
  const destroyRef = inject(DestroyRef);
  const version = signal(0);
  const unsubscribe = controller.subscribe(() => {
    version.update((value) => value + 1);
  });

  destroyRef.onDestroy(() => unsubscribe());

  const outputs = computed(() => {
    version();
    return controller.getOutputs();
  });

  const periodLabel = computed(() => resolveTngDateRangePickerPeriodLabel(controller, outputs()));

  return Object.freeze({ outputs, periodLabel });
}

function resolveCurrentFocusTargetId(outputs: TngDateRangePickerOutputs<unknown>): string | null {
  if (outputs.view === 'day') {
    const activeCalendar =
      outputs.calendars.find((calendar) =>
        calendar.cells.some((cell) => cell.active && !cell.hidden),
      ) ?? outputs.calendars[0];
    const gridAttributes = activeCalendar?.getGridAttributes() ?? outputs.getGridAttributes();
    if (gridAttributes['aria-activedescendant'] !== undefined) {
      return gridAttributes.id ?? null;
    }

    return activeCalendar?.cells.find((cell) => cell.active && !cell.hidden)?.id ?? null;
  }

  if (outputs.view === 'month') {
    return outputs.monthOptions.find((option) => option.active)?.id ?? null;
  }

  if (outputs.view === 'year') {
    return outputs.yearOptions.find((option) => option.active)?.id ?? null;
  }

  return null;
}

function shouldSyncOverlayFocusAfterPickerKey(key: string): boolean {
  return (
    key === 'ArrowUp' ||
    key === 'ArrowDown' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'Home' ||
    key === 'End' ||
    key === 'PageUp' ||
    key === 'PageDown' ||
    key === 'Enter' ||
    key === ' ' ||
    key === 'Escape'
  );
}

function isPickerActivationKey(key: string): boolean {
  return key === 'Enter' || key === ' ';
}

function queueDateRangePickerOverlayFocusSync(
  controller: TngDateRangePickerControllerLike,
  ownerDocument: Document | null,
): void {
  const targetDocument = ownerDocument ?? document;

  queueMicrotask(() => {
    const focusTarget = (): void => {
      const outputs = controller.getOutputs();
      if (!outputs.open) {
        return;
      }

      const targetId = resolveCurrentFocusTargetId(outputs);
      if (targetId === null) {
        return;
      }

      const target = targetDocument.getElementById(targetId);
      if (!(target instanceof HTMLElement)) {
        return;
      }

      target.focus();
    };

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => focusTarget());
      return;
    }

    setTimeout(() => focusTarget(), 0);
  });
}

function resolveAttribute(attributes: TngDateRangePickerAttributeMap, key: string): string | null {
  return attributes[key] ?? null;
}

@Directive()
abstract class TngDateRangePickerControllerPart implements OnInit {
  protected readonly injector = inject(Injector);
  protected readonly ownerDocument =
    inject(ElementRef<HTMLElement>).nativeElement.ownerDocument ?? null;
  protected readonly renderVersion = signal(0);
  public abstract readonly controller: Signal<TngDateRangePickerControllerLike>;

  public ngOnInit(): void {
    effect(
      (onCleanup) => {
        const controller = this.controller();
        const unsubscribe = controller.subscribe(() => {
          this.renderVersion.update((value) => value + 1);
        });

        onCleanup(() => unsubscribe());
      },
      { injector: this.injector },
    );
  }

  protected syncOverlayFocus(): void {
    queueDateRangePickerOverlayFocusSync(this.controller(), this.ownerDocument);
  }
}

@Directive({
  selector: '[tngDateRangePickerHost]',
  exportAs: 'tngDateRangePickerHost',
  standalone: true,
})
export class TngDateRangePickerHost extends TngDateRangePickerControllerPart {
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerHost',
  });

  private readonly attributes = computed(() => {
    this.renderVersion();
    return this.controller().getOutputs().getHostAttributes();
  });

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedby(): string | null {
    return resolveAttribute(this.attributes(), 'aria-describedby');
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabel(): string | null {
    return resolveAttribute(this.attributes(), 'aria-label');
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    return resolveAttribute(this.attributes(), 'aria-labelledby');
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'data-disabled');
  }

  @HostBinding('attr.data-calendar-layout')
  protected get dataCalendarLayout(): string | null {
    return resolveAttribute(this.attributes(), 'data-calendar-layout');
  }

  @HostBinding('attr.data-open')
  protected get dataOpen(): string | null {
    return resolveAttribute(this.attributes(), 'data-open');
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    return resolveAttribute(this.attributes(), 'data-slot');
  }

  @HostBinding('attr.data-view')
  protected get dataView(): string | null {
    return resolveAttribute(this.attributes(), 'data-view');
  }

  @HostBinding('attr.dir')
  protected get dir(): string | null {
    return resolveAttribute(this.attributes(), 'dir');
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    return resolveAttribute(this.attributes(), 'role');
  }
}

@Directive({
  selector: 'input[tngDateRangePickerInput]',
  exportAs: 'tngDateRangePickerInput',
  standalone: true,
})
export class TngDateRangePickerInput extends TngDateRangePickerControllerPart {
  private readonly inputElement = inject<ElementRef<HTMLInputElement>>(ElementRef);
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerInput',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'date-range-picker-input' as const;

  @HostBinding('value')
  protected get valueProp(): string {
    this.renderVersion();
    return this.controller().getOutputs().inputText;
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalid(): 'true' | null {
    this.renderVersion();
    return this.controller().getOutputs().validationError !== null ? 'true' : null;
  }

  @HostListener('blur')
  protected onBlur(): void {
    this.controller().commitInputText();
  }

  @HostListener('input')
  protected onInput(): void {
    this.controller().setInputText(this.inputElement.nativeElement.value);
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.controller().getOutputs().open) {
      return;
    }

    this.controller().open();
    this.syncOverlayFocus();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.controller().getOutputs().open) {
        this.controller().open();
        this.syncOverlayFocus();
        return;
      }

      this.controller().commitInputText();
      return;
    }

    if (event.key === 'ArrowDown' && !this.controller().getOutputs().open) {
      event.preventDefault();
      this.controller().open();
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDateRangePickerTrigger]',
  exportAs: 'tngDateRangePickerTrigger',
  standalone: true,
})
export class TngDateRangePickerTrigger extends TngDateRangePickerControllerPart {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerTrigger',
  });

  public override ngOnInit(): void {
    super.ngOnInit();

    effect(
      (onCleanup) => {
        const controller = this.controller();
        const element = this.elementRef.nativeElement;
        controller.registerTrigger(element);

        onCleanup(() => controller.registerTrigger(null));
      },
      { injector: this.injector },
    );
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'date-range-picker-trigger' as const;

  @HostBinding('attr.aria-haspopup')
  protected get ariaHaspopup(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['aria-haspopup'] ?? null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['aria-expanded'] ?? null;
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['aria-controls'] ?? null;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['aria-disabled'] ?? null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['data-disabled'] ?? null;
  }

  @HostBinding('disabled')
  protected get disabled(): boolean {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['disabled'] === 'true';
  }

  @HostBinding('attr.data-open')
  protected get dataOpen(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['data-open'] ?? null;
  }

  @HostBinding('attr.tabindex')
  protected get tabindex(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getTriggerAttributes()['tabindex'] ?? null;
  }

  @HostListener('click')
  protected onClick(): void {
    const wasOpen = this.controller().getOutputs().open;
    this.controller().toggleOpen();
    if (!wasOpen && this.controller().getOutputs().open) {
      this.syncOverlayFocus();
    }
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const wasOpen = this.controller().getOutputs().open;
    this.controller().handleTriggerKeyDown(event);
    if (!wasOpen && this.controller().getOutputs().open) {
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDateRangePickerPrevButton]',
  exportAs: 'tngDateRangePickerPrevButton',
  standalone: true,
})
export class TngDateRangePickerPrevButton extends TngDateRangePickerControllerPart {
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerPrevButton',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'date-range-picker-nav-button' as const;

  @HostListener('click')
  protected onClick(): void {
    if (this.controller().getOutputs().view === 'day') {
      this.controller().prevMonth();
    } else {
      this.controller().prevYear();
    }

    this.syncOverlayFocus();
  }
}

@Directive({
  selector: 'button[tngDateRangePickerNextButton]',
  exportAs: 'tngDateRangePickerNextButton',
  standalone: true,
})
export class TngDateRangePickerNextButton extends TngDateRangePickerControllerPart {
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerNextButton',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'date-range-picker-nav-button' as const;

  @HostListener('click')
  protected onClick(): void {
    if (this.controller().getOutputs().view === 'day') {
      this.controller().nextMonth();
    } else {
      this.controller().nextYear();
    }

    this.syncOverlayFocus();
  }
}

@Directive({
  selector: 'button[tngDateRangePickerPeriodButton]',
  exportAs: 'tngDateRangePickerPeriodButton',
  standalone: true,
})
export class TngDateRangePickerPeriodButton extends TngDateRangePickerControllerPart {
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerPeriodButton',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'date-range-picker-period-button' as const;

  @HostBinding('attr.data-interactive')
  protected get dataInteractive(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().view !== 'year' ? 'true' : null;
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.controller().getOutputs().view === 'year') {
      return;
    }

    this.controller().showYearsPanel();
    this.syncOverlayFocus();
  }
}

@Directive({
  selector: '[tngDateRangePickerDayGrid]',
  exportAs: 'tngDateRangePickerDayGrid',
  standalone: true,
})
export class TngDateRangePickerDayGrid extends TngDateRangePickerControllerPart {
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerDayGrid',
  });
  public readonly calendarIndex = input<number>(0, {
    alias: 'tngDateRangePickerCalendarIndex',
  });
  @HostBinding('attr.data-calendar-index')
  protected get dataCalendarIndex(): string {
    return `${this.calendarIndex()}`;
  }
  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    this.renderVersion();
    return (
      this.controller().getOutputs().getGridAttributes(this.calendarIndex())['data-slot'] ??
      'date-range-picker-grid'
    );
  }

  @HostBinding('attr.id')
  protected get id(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getGridAttributes(this.calendarIndex()).id ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getGridAttributes(this.calendarIndex())['role'] ?? null;
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    this.renderVersion();
    return (
      this.controller().getOutputs().getGridAttributes(this.calendarIndex())[
        'aria-activedescendant'
      ] ?? null
    );
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabel(): string | null {
    this.renderVersion();
    return (
      this.controller().getOutputs().getGridAttributes(this.calendarIndex())['aria-label'] ?? null
    );
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    this.renderVersion();
    return (
      this.controller().getOutputs().getGridAttributes(this.calendarIndex())['aria-labelledby'] ??
      null
    );
  }

  @HostBinding('attr.data-range-boundary')
  protected get dataRangeBoundary(): string | null {
    this.renderVersion();
    return (
      this.controller().getOutputs().getGridAttributes(this.calendarIndex())[
        'data-range-boundary'
      ] ?? null
    );
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.controller().handleGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDateRangePickerDayCell]',
  exportAs: 'tngDateRangePickerDayCell',
  standalone: true,
})
export class TngDateRangePickerDayCell extends TngDateRangePickerControllerPart {
  private readonly dayGrid = inject(TngDateRangePickerDayGrid);
  public readonly controller = computed(() => this.dayGrid.controller());
  public readonly cell = input.required<Readonly<TngDateCell<any>>>({
    alias: 'tngDateRangePickerDayCell',
  });

  private readonly attributes = computed(() => {
    this.renderVersion();
    return this.controller().getOutputs().getCellAttributes(this.cell());
  });

  @HostBinding('attr.id')
  protected get id(): string | null {
    return this.attributes().id ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    return resolveAttribute(this.attributes(), 'role');
  }

  @HostBinding('attr.tabindex')
  protected get tabindex(): string | null {
    return resolveAttribute(this.attributes(), 'tabindex');
  }

  @HostBinding('disabled')
  protected get disabled(): boolean {
    return this.cell().disabled;
  }

  @HostBinding('attr.aria-current')
  protected get ariaCurrent(): string | null {
    return resolveAttribute(this.attributes(), 'aria-current');
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'aria-disabled');
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabel(): string | null {
    return resolveAttribute(this.attributes(), 'aria-label');
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelected(): string | null {
    return resolveAttribute(this.attributes(), 'aria-selected');
  }

  @HostBinding('attr.data-active')
  protected get dataActive(): string | null {
    return resolveAttribute(this.attributes(), 'data-active');
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'data-disabled');
  }

  @HostBinding('attr.data-focused')
  protected get dataFocused(): string | null {
    return resolveAttribute(this.attributes(), 'data-focused');
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisible(): string | null {
    return resolveAttribute(this.attributes(), 'data-focus-visible');
  }

  @HostBinding('attr.data-hidden')
  protected get dataHidden(): string | null {
    return resolveAttribute(this.attributes(), 'data-hidden');
  }

  @HostBinding('attr.data-in-month')
  protected get dataInMonth(): string | null {
    return resolveAttribute(this.attributes(), 'data-in-month');
  }

  @HostBinding('attr.data-in-range')
  protected get dataInRange(): string | null {
    return resolveAttribute(this.attributes(), 'data-in-range');
  }

  @HostBinding('attr.data-outside-month')
  protected get dataOutsideMonth(): string | null {
    return resolveAttribute(this.attributes(), 'data-outside-month');
  }

  @HostBinding('attr.data-preview-end')
  protected get dataPreviewEnd(): string | null {
    return resolveAttribute(this.attributes(), 'data-preview-end');
  }

  @HostBinding('attr.data-preview-range')
  protected get dataPreviewRange(): string | null {
    return resolveAttribute(this.attributes(), 'data-preview-range');
  }

  @HostBinding('attr.data-range-end')
  protected get dataRangeEnd(): string | null {
    return resolveAttribute(this.attributes(), 'data-range-end');
  }

  @HostBinding('attr.data-range-start')
  protected get dataRangeStart(): string | null {
    return resolveAttribute(this.attributes(), 'data-range-start');
  }

  @HostBinding('attr.data-selected')
  protected get dataSelected(): string | null {
    return resolveAttribute(this.attributes(), 'data-selected');
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    return resolveAttribute(this.attributes(), 'data-slot');
  }

  @HostBinding('attr.data-today')
  protected get dataToday(): string | null {
    return resolveAttribute(this.attributes(), 'data-today');
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    const cell = this.cell();
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller().selectCalendarDate(cell.date, this.dayGrid.calendarIndex(), {
      shiftKey: event.shiftKey,
      trigger: 'pointer',
    });
    this.syncOverlayFocus();
  }

  @HostListener('pointerenter')
  protected onPointerEnter(): void {
    const cell = this.cell();
    if (cell.disabled || cell.hidden) {
      return;
    }
    if (
      this.controller().getOutputs().calendarLayout === 'dual' &&
      this.dayGrid.calendarIndex() === 0
    ) {
      return;
    }

    this.controller().handleCellPointerEnter(cell.date);
  }
}

@Directive({
  selector: '[tngDateRangePickerMonthGrid]',
  exportAs: 'tngDateRangePickerMonthGrid',
  standalone: true,
})
export class TngDateRangePickerMonthGrid extends TngDateRangePickerControllerPart {
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerMonthGrid',
  });
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'date-range-picker-grid' as const;

  @HostBinding('attr.role')
  protected readonly role = 'grid' as const;

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.controller().handleMonthGridKeyDown(event);
    if (isPickerActivationKey(event.key)) {
      this.controller().showDaysPanel();
    }
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDateRangePickerMonthOption]',
  exportAs: 'tngDateRangePickerMonthOption',
  standalone: true,
})
export class TngDateRangePickerMonthOption extends TngDateRangePickerControllerPart {
  private readonly monthGrid = inject(TngDateRangePickerMonthGrid);
  public readonly controller = computed(() => this.monthGrid.controller());
  public readonly option = input.required<Readonly<TngMonthOption<any>>>({
    alias: 'tngDateRangePickerMonthOption',
  });

  private readonly attributes = computed(() => {
    this.renderVersion();
    return this.controller().getOutputs().getMonthAttributes(this.option());
  });

  @HostBinding('attr.id')
  protected get id(): string | null {
    return this.attributes().id ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    return resolveAttribute(this.attributes(), 'role');
  }

  @HostBinding('attr.tabindex')
  protected get tabindex(): string | null {
    return resolveAttribute(this.attributes(), 'tabindex');
  }

  @HostBinding('disabled')
  protected get disabled(): boolean {
    return this.option().disabled;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'aria-disabled');
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelected(): string | null {
    return resolveAttribute(this.attributes(), 'aria-selected');
  }

  @HostBinding('attr.data-active')
  protected get dataActive(): string | null {
    return resolveAttribute(this.attributes(), 'data-active');
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'data-disabled');
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisible(): string | null {
    return resolveAttribute(this.attributes(), 'data-focus-visible');
  }

  @HostBinding('attr.data-selected')
  protected get dataSelected(): string | null {
    return resolveAttribute(this.attributes(), 'data-selected');
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    return resolveAttribute(this.attributes(), 'data-slot');
  }

  @HostListener('click')
  protected onClick(): void {
    const option = this.option();
    if (option.disabled) {
      return;
    }

    this.controller().selectMonth(option.index);
    this.controller().showDaysPanel();
    this.syncOverlayFocus();
  }
}

@Directive({
  selector: '[tngDateRangePickerYearGrid]',
  exportAs: 'tngDateRangePickerYearGrid',
  standalone: true,
})
export class TngDateRangePickerYearGrid extends TngDateRangePickerControllerPart {
  public readonly controller = input.required<TngDateRangePickerControllerLike>({
    alias: 'tngDateRangePickerYearGrid',
  });
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'date-range-picker-grid' as const;

  @HostBinding('attr.role')
  protected readonly role = 'grid' as const;

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.controller().handleYearGridKeyDown(event);
    if (isPickerActivationKey(event.key)) {
      this.controller().showMonthsPanel();
    }
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.syncOverlayFocus();
    }
  }
}

@Directive({
  selector: 'button[tngDateRangePickerYearOption]',
  exportAs: 'tngDateRangePickerYearOption',
  standalone: true,
})
export class TngDateRangePickerYearOption extends TngDateRangePickerControllerPart {
  private readonly yearGrid = inject(TngDateRangePickerYearGrid);
  public readonly controller = computed(() => this.yearGrid.controller());
  public readonly option = input.required<Readonly<TngYearOption<any>>>({
    alias: 'tngDateRangePickerYearOption',
  });

  private readonly attributes = computed(() => {
    this.renderVersion();
    return this.controller().getOutputs().getYearAttributes(this.option());
  });

  @HostBinding('attr.id')
  protected get id(): string | null {
    return this.attributes().id ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    return resolveAttribute(this.attributes(), 'role');
  }

  @HostBinding('attr.tabindex')
  protected get tabindex(): string | null {
    return resolveAttribute(this.attributes(), 'tabindex');
  }

  @HostBinding('disabled')
  protected get disabled(): boolean {
    return this.option().disabled;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'aria-disabled');
  }

  @HostBinding('attr.aria-selected')
  protected get ariaSelected(): string | null {
    return resolveAttribute(this.attributes(), 'aria-selected');
  }

  @HostBinding('attr.data-active')
  protected get dataActive(): string | null {
    return resolveAttribute(this.attributes(), 'data-active');
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): string | null {
    return resolveAttribute(this.attributes(), 'data-disabled');
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisible(): string | null {
    return resolveAttribute(this.attributes(), 'data-focus-visible');
  }

  @HostBinding('attr.data-selected')
  protected get dataSelected(): string | null {
    return resolveAttribute(this.attributes(), 'data-selected');
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    return resolveAttribute(this.attributes(), 'data-slot');
  }

  @HostListener('click')
  protected onClick(): void {
    const option = this.option();
    if (option.disabled) {
      return;
    }

    this.controller().selectYear(option.year);
    this.controller().showMonthsPanel();
    this.syncOverlayFocus();
  }
}
