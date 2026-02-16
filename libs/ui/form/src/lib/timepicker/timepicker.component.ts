import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';
import { TngDivider } from '@tailng-ui/ui/layout';
import { TngTimepickerSlot } from './timepicker.slots';
import {
  TngConnectedOverlay,
  TngOverlayCloseReason,
  TngOverlayPanel,
  TngOverlayRef,
} from '@tailng-ui/ui/overlay';

type Period = 'am' | 'pm';
type TimeFormat = 12 | 24;

@Component({
  selector: 'tng-timepicker',
  standalone: true,
  imports: [TngOverlayRef, TngConnectedOverlay, TngOverlayPanel, TngDivider],
  templateUrl: './timepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngTimepicker),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TngTimepicker implements ControlValueAccessor {

  /** Whether the input is disabled */
  readonly disabled = input<boolean>(false);

  /** Format settings */
  hourFormat = input<TimeFormat>(12);
  showSeconds = input<boolean>(false);
  readonly timeDisplayFormat = input<string>('HH:mm');

  /** Labels */
  readonly hourLabel = input<string>('Hour');
  readonly minuteLabel = input<string>('Minute');
  readonly secondLabel = input<string>('Second');

  /** Input initial Values */
  hourSelection = signal<number>(0);
  minuteSelection = signal<string>('00');
  secondSelection = signal<string>('00');
  periodSelection = signal<'am' | 'pm'>('am');

  /** Default Classes for specific elements (can be overridden by slots) */
  readonly hourTitleClassFinal = input<string>('w-full text-center text-[0.6rem] text-slate-400');
  readonly minutesTitleClassFinal = input<string>('w-full text-center text-[0.6rem] text-slate-400');
  readonly secondsTitleClassFinal = input<string>('w-full text-center text-[0.6rem] text-slate-400');

  /** Slot hooks(micro styling) */
  slot = input<TngSlotMap<TngTimepickerSlot>>({});

  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef<HTMLInputElement>;

  /*Overlay state */
  readonly isOpen = signal(false);

  /* Disabled State form + input */
  private readonly _formDisabled = signal<boolean | null>(null);
  readonly disabledFinal = computed(() => {
    const form = this._formDisabled();
    return form === null ? this.disabled() : form;
  });
  protected readonly isDisabled = computed(() => this.disabledFinal());

  /* Slot finals (defaults + overrides) */
  readonly containerClassFinal = computed(() => this.cx('relative', this.slotClass('container')));

  readonly disabledClassFinal = computed(() => this.cx(this.slotClass('disabled')));

  readonly fieldClassFinal = computed(() => this.cx('relative', this.slotClass('field')));

  readonly inputClassFinal = computed(() =>
    this.cx(
      'w-full rounded-md border border-border bg-bg px-3 py-2 pr-10 text-sm',
      'focus:outline-none focus:ring-2 focus:ring-primary',
      this.slotClass('input'),
    ),
  );

  readonly toggleClassFinal = computed(() =>
    this.cx(
      'absolute inset-y-0 right-0 flex w-10 items-center justify-center',
      'rounded-r-md text-fg hover:bg-alternate-background',
      this.slotClass('toggle'),
    ),
  );

  readonly toggleIconClassFinal = computed(() => this.cx('h-5 w-5', this.slotClass('toggleIcon')));

  readonly overlayPanelSlot = computed(() => {
    const panelSlot = this.slotClass('overlayPanel');
    return panelSlot ? { panel: panelSlot } : {};
  });

  readonly panelFrameClassFinal = computed(() =>
    this.cx(
      this.showSeconds() ? 'w-[200px]' : 'w-[180px]',
      'p-4 rounded-lg border-border bg-bg shadow-lg flex flex-col',
      this.slotClass('panelFrame'),
    ),
  );

  readonly panelLayoutClassFinal = computed(() =>
    this.cx(
      this.showSeconds() ? 'grid grid-cols-3 gap-8' : 'grid grid-cols-2 gap-4',
      this.slotClass('panelLayout'),
    ),
  );

  // Header container (optional title)
  readonly titleClassFinal = computed(() =>
    this.cx('w-full text-center text-xs', this.slotClass('title')),
  );

  readonly periodRailClassFinal = computed(() =>
    this.cx(
      'flex items-center justify-center mt-3 border rounded w-20 mx-auto',
      this.slotClass('periodRail'),
    ),
  );

  readonly periodClassFinal = computed(() =>
    this.cx(
      'px-3 py-1 border-border text-sm hover:bg-text w-full text-center',
      this.slotClass('period'),
    ),
  );

  // Time display container
  readonly timeDisplayClassFinal = computed(() =>
    this.cx('w-full text-center text-sm py-2', this.slotClass('timeDisplay')),
  );

  // Time display container
 

  readonly hourRailClassFinal = computed(() =>
    this.cx(
      'flex flex-col items-center justify-center border-border rounded bg-bg text-fg',
      this.slotClass('hourRail'),
    ),
  );

  readonly hourNavPrevClassFinal = computed(() =>
    this.cx(
      'px-2 py-1 border border-border text-xs hover:bg-bg/40 rounded-md shadow-sm ',
      this.slotClass('hourNavPrev'),
    ),
  );

  readonly hourNavNextClassFinal = computed(() =>
    this.cx(
      'px-2 py-1 border border-border text-xs hover:bg-bg/10 rounded-md shadow-sm',
      this.slotClass('hourNavNext'),
    ),
  );

  readonly hourListClassFinal = computed(() => this.cx('space-x-0.5', this.slotClass('hourList')));

  readonly hourItemClassFinal = computed(() =>
    this.cx(
      'flex items-center justify-center px-3 py-2 text-lg font-semibold flex-col',
      this.slotClass('hourItem'),
    ),
  );

  readonly minuteRailClassFinal = computed(() =>
    this.cx(
      'flex flex-col items-center justify-center border-border rounded bg-bg text-fg',
      this.slotClass('minuteRail'),
    ),
  );

  readonly minuteNavPrevClassFinal = computed(() =>
    this.cx(
      'px-2 py-1 border border-border text-xs hover:bg-bg/40 rounded-md shadow-sm ',
      this.slotClass('minuteNavPrev'),
    ),
  );

  readonly minuteNavNextClassFinal = computed(() =>
    this.cx(
      'px-2 py-1 border border-border text-xs hover:bg-bg/10 rounded-md shadow-sm',
      this.slotClass('minuteNavNext'),
    ),
  );

  readonly minuteListClassFinal = computed(() =>
    this.cx('space-y-0.5', this.slotClass('minuteList')),
  );

  readonly minuteItemClassFinal = computed(() =>
    this.cx(
      'flex items-center justify-center px-3 py-2 text-lg font-semibold flex-col',
      this.slotClass('minuteItem'),
    ),
  );

  readonly secondRailClassFinal = computed(() =>
    this.cx(
      'flex flex-col items-center justify-center border-border rounded bg-bg text-fg',
      this.slotClass('secondRail'),
    ),
  );

  readonly secondNavPrevClassFinal = computed(() =>
    this.cx(
      'px-2 py-1 border border-border text-xs hover:bg-bg/40 rounded-md shadow-sm ',
      this.slotClass('secondNavPrev'),
    ),
  );

  readonly secondNavNextClassFinal = computed(() =>
    this.cx(
      'px-2 py-1 border border-border text-xs hover:bg-bg/10 rounded-md shadow-sm',
      this.slotClass('secondNavNext'),
    ),
  );

  readonly secondListClassFinal = computed(() =>
    this.cx('space-y-0.5', this.slotClass('secondList')),
  );

  readonly secondItemClassFinal = computed(() =>
    this.cx(
      'flex items-center justify-center px-3 py-2 text-lg font-semibold flex-col',
      this.slotClass('secondItem'),
    ),
  );

  readonly actionBarClassFinal = computed(() =>
    this.cx('flex justify-end gap-2 h-5', this.slotClass('actionBar')),
  );

  readonly cancelClassFinal = computed(() =>
    this.cx(
      'rounded-md border border-border bg-bg text-xs px-2 font-semibold hover:bg-alternate-background active:translate-y-[5px]',
      this.slotClass('cancel'),
    ),
  );

  readonly confirmClassFinal = computed(() =>
    this.cx(
      'rounded-md bg-fg text-bg px-2 text-xs font-semibold hover:opacity-95 active:translate-y-[1px]',
      this.slotClass('confirm'),
    ),
  );

/** Slot Helper */  
private slotClass(key: TngTimepickerSlot): TngSlotValue {
    return this.slot()?.[key];
  }

  private cx(...parts: Array<TngSlotValue>): string {
    return parts
      .flatMap((p) => (Array.isArray(p) ? p : [p]))
      .map((p) => (p ?? '').toString().trim())
      .filter(Boolean)
      .join(' ');
  }
/** Checking the time format */  
  get isTwelveHourFormat(): boolean {
    return this.hourFormat() === 12;
  }

  readonly periods = ['am', 'pm'] as const;
  readonly currentDateTime = signal<Date>(new Date());

  private readonly formattedTime = computed(() => {
    const date = this.currentDateTime();
    const hours24 = date.getHours();
    const minutes = this.formatUnit(date.getMinutes());
    const seconds = this.formatUnit(date.getSeconds());

    if (this.hourFormat() === 24) {
      return this.build24HourFormat(hours24, minutes, seconds);
    }

    return this.build12HourFormat(hours24, minutes, seconds);
  });

  /* Helper Function */
  private formatUnit(value: number): string {
    return value.toString().padStart(2, '0');
  }
  private build24HourFormat(hours24: number, minutes: string, seconds: string): string {
    const hours = this.formatUnit(hours24);

    return this.showSeconds() ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
  }

  private build12HourFormat(hours24: number, minutes: string, seconds: string): string {
    const period = hours24 >= 12 ? 'PM' : 'AM';

    let hours12 = hours24 % 12;
    hours12 = hours12 === 0 ? 12 : hours12;

    const hours = this.formatUnit(hours12);

    return this.showSeconds()
      ? `${hours}:${minutes}:${seconds} ${period}`
      : `${hours}:${minutes} ${period}`;
  }



  selectedValues = effect(() => {
    const date = this.currentDateTime();
    const hours = date.getHours();

    this.hourSelection.set(this.hourFormat() === 24 ? hours : hours % 12 || 12);

    this.minuteSelection.set(this.formatUnit(date.getMinutes()));

    this.secondSelection.set(this.formatUnit(date.getSeconds()));

    this.periodSelection.set(hours >= 12 ? 'pm' : 'am');
  });
   // inputValueEffect = effect(() => {
  //   this.inputValue.set(this.formattedTime());
  // });

  readonly inputValue = signal('');
 

  readonly draftValue = signal<string | null>(null);

  private onChange: any = () => {};
  private onTouched: any = () => {};

  /* Helper Function for Clear input field */
  private resetState(): void {
    this.inputValue.set('');
  }

  /**CONTROL VALUE ACCESSOR */

  writeValue(value: string | null): void {
    if (value == null) {
      this.resetState();
      return;
    }

    const [time, period] = value.split(' ');
    if (!time || !period) {
      this.resetState();
      return;
    }

    const [hour, minute, second = '00'] = time.split(':');

    this.hourSelection.set(Number(hour));
    this.minuteSelection.set(minute);
    this.secondSelection.set(second);
    this.periodSelection.set(period as Period);

    this.updateDraftValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  /* ================= View and Scrolling  ================= */

  visibleHours = computed(() => [this.hourSelection()]);

  adjustHour(direction: number) {
    let newHour = this.hourSelection() + direction;

    if (this.hourFormat() === 24) {
      if (newHour > 23) newHour = 0;
      if (newHour < 0) newHour = 23;
    } else {
      if (newHour > 12) newHour = 1;
      if (newHour < 1) newHour = 12;
    }

    this.hourSelection.set(newHour);
    this.updateDraftValue();
  }

  /*minutes visible */
  visibleMinutes = computed(() => [this.minuteSelection()]);

  adjustMinute(direction: number) {
    let currentMinutes = parseInt(this.minuteSelection());
    let newMinute = currentMinutes + direction;

    if (newMinute > 59) newMinute = 0;
    if (newMinute < 0) newMinute = 59;

    this.minuteSelection.set(this.formatUnit(newMinute));
    this.updateDraftValue();
  }

  /*Seconds visible */
  visibleSeconds = computed(() => [this.secondSelection()]);

  scrollSeconds(direction: number) {
    let currentSeconds = parseInt(this.secondSelection());
    let newSeconds = currentSeconds + direction;

    if (newSeconds > 59) newSeconds = 0;
    if (newSeconds < 0) newSeconds = 59;

    this.secondSelection.set(this.formatUnit(newSeconds));
    this.updateDraftValue();
  }

  

/** UI actions */
  open(_reason: TngOverlayCloseReason) {
    if (this.isDisabled()) return;
    this.isOpen.set(true);
    if (this.draftValue() == null) {
      this.draftValue.set(this.formattedTime());
    }
  }

  close(_reason: TngOverlayCloseReason) {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
  }

  onOverlayOpenChange(open: boolean) {
    if (this.isDisabled()) {
      this.isOpen.set(false);
      return;
    }
    open ? this.open('programmatic') : this.close('programmatic');
  }

  onOverlayClosed(reason: TngOverlayCloseReason) {
    this.close(reason);
  }

  toggleOverlay() {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) this.open('programmatic');
    queueMicrotask(() => this.inputEl.nativeElement.focus());
  }

  onBlur() {
    this.onTouched();
  }

  cancel() {
    if (this.isDisabled()) return;
    this.inputValue.set('');
    // this.updateDraftValue();
    this.close('blur');
    this.onTouched();
  }

  confirm() {
    if (this.isDisabled()) return;

    const value = this.draftValue();

    if (!value) {
      this.inputValue.set('');
      this.onChange(null);
      this.onTouched();
      this.close('selection');
      return;
    }

    this.inputValue.set(value);
    this.onChange(value);
    this.onTouched();
    this.close('selection');
    this.updateDraftValue();
  }


  selectHour(hour: number) {
    this.hourSelection.set(hour);
    // this.visibleHours.set([hour]);
    this.updateDraftValue();
  }

  selectMinute(min: string) {
    this.minuteSelection.set(min);
    // this.visibleMinutes.set([min]);
    this.updateDraftValue();
  }

  selectSeconds(sec: string) {
    this.secondSelection.set(sec);
    // this.visibleSeconds.set([sec]);
    this.updateDraftValue();
  }

  selectPeriod(p: 'am' | 'pm') {
    this.periodSelection.set(p);
    this.updateDraftValue();
  }

  updateDraftValue() {
    const hour = this.hourSelection();
    const minute = this.minuteSelection() ?? '00';
    const second = this.secondSelection() ?? '00';
    const period = this.periodSelection() ?? 'am';

    let formatted = '';

    if (this.hourFormat() === 24) {
      const hh = this.formatUnit(hour);
      formatted = this.showSeconds() ? `${hh}:${minute}:${second}` : `${hh}:${minute}`;
    } else {
      const hh = hour.toString().padStart(2, '0');
      formatted = this.showSeconds()
        ? `${hh}:${minute}:${second} ${period}`
        : `${hh}:${minute} ${period}`;
    }

    this.draftValue.set(formatted);
    // this.onChange(this.draftValue());
  }

  onInput(ev: Event) {
    const raw = (ev.target as HTMLInputElement).value;
    if (!raw) return;

    const [timePart, periodPart] = raw.split(' ');
    if (!timePart) return;

    const [hourStr, minuteStr, secondStr] = timePart.split(':');
    const h = parseInt(hourStr, 10);
    const m = minuteStr?.padStart(2, '0') ?? '00';
    const s = secondStr?.padStart(2, '0') ?? '00';

    if (this.hourFormat() === 12) {
      if (h >= 1 && h <= 12) {
        this.hourSelection.set(h);
        // this.visibleHours.set([h]);
      }
    } else {
      if (h >= 0 && h <= 23) {
        this.hourSelection.set(h);
        // this.visibleHours.set([h]);
      }
    }

    // Update minutes
    if (+m >= 0 && +m <= 59) {
      this.minuteSelection.set(m);
      // this.visibleMinutes.set([m]);
    }

    // Update seconds only if showSeconds is true
    if (this.showSeconds() && +s >= 0 && +s <= 59) {
      this.secondSelection.set(s);
      // this.visibleSeconds.set([s]);
    }

    // Update period only if 12-hour format
    if (this.hourFormat() === 12 && (periodPart === 'am' || periodPart === 'pm')) {
      this.periodSelection.set(periodPart as 'am' | 'pm');
    }

    this.updateDraftValue();
  }

  }
