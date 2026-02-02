import {
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  input,
  runInInjectionContext,
} from '@angular/core';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import {
  createTngFocusTrap,
  TngFocusTrapHandle,
} from './focus-trap.util';

@Directive({
  selector: '[tngFocusTrap]',
  standalone: true,
})
export class TngFocusTrap implements OnDestroy {
  /** Enable / disable focus trapping */
  readonly tngFocusTrap = input(true);

  /** CDK 21: FocusTrapFactory.create(element, deferCaptureElements?: boolean) */
  readonly deferCaptureElements = input(false);

  /** tailng behavior */
  readonly autoCapture = input(true);

  /** tailng behavior */
  readonly restoreFocus = input(true);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  // Inject CDK factory in injection context (field initializer)
  private readonly focusTrapFactory = inject(FocusTrapFactory);

  private handle: TngFocusTrapHandle | null = null;

  constructor() {
    effect(() => {
      const enabled = this.tngFocusTrap();

      if (!enabled) {
        this.disable();
        return;
      }

      // afterNextRender needs injection context
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => this.enable());
      });
    });
  }

  private enable(): void {
    if (this.handle) return;

    this.handle = createTngFocusTrap(
      this.focusTrapFactory,
      this.host.nativeElement,
      {
        deferCaptureElements: this.deferCaptureElements(),
        autoCapture: this.autoCapture(),
        restoreFocus: this.restoreFocus(),
      },
    );

    this.handle.activate();
  }

  private disable(): void {
    this.handle?.destroy();
    this.handle = null;
  }

  ngOnDestroy(): void {
    this.disable();
  }
}
