import {
  AfterViewInit,
  Directive,
  ElementRef,
  Renderer2,
  NgZone,
  OnDestroy,
  input,
} from '@angular/core';
import { booleanAttribute, numberAttribute } from '@angular/core';

@Directive({
  selector: '[tngRipple]',
  standalone: true,
})
export class TngRipple implements AfterViewInit, OnDestroy {
  rippleDisabled = input(false, { transform: booleanAttribute });
  rippleCentered = input(false, { transform: booleanAttribute });
  rippleColor = input<string>('currentColor');
  rippleDuration = input(550, { transform: numberAttribute });
  rippleOpacity = input(0.18, { transform: numberAttribute });

  private unlistenPointerDown: (() => void) | null = null;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly r: Renderer2,
    private readonly zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    // Ensure styles after the element is in DOM and computed styles are stable
    this.ensureHostStyles();

    this.zone.runOutsideAngular(() => {
      this.unlistenPointerDown = this.r.listen(
        this.el.nativeElement,
        'pointerdown',
        (ev: PointerEvent) => this.onPointerDown(ev),
      );
    });
  }

  ngOnDestroy(): void {
    this.unlistenPointerDown?.();
    this.unlistenPointerDown = null;
  }

  private ensureHostStyles(): void {
    const host = this.el.nativeElement;
    const pos = getComputedStyle(host).position;

    // Force containing block for absolute children
    // If it's static/empty/unknown -> set to relative
    if (!pos || pos === 'static') {
      this.r.setStyle(host, 'position', 'relative');
    }

    // Clip ripple to rounded corners
    const ov = getComputedStyle(host).overflow;
    if (!ov || ov === 'visible') {
      this.r.setStyle(host, 'overflow', 'hidden');
    }

    // Prevent weird stacking issues (optional but helpful)
    this.r.setStyle(host, 'isolation', 'isolate');

    // Mobile tap highlight
    this.r.setStyle(host, '-webkit-tap-highlight-color', 'transparent');
  }

  private onPointerDown(ev: PointerEvent): void {
    if (this.rippleDisabled()) return;
    if (ev.button !== 0) return;
    if (ev.defaultPrevented) return;

    const host = this.el.nativeElement;
    if ((host as unknown as { disabled?: boolean }).disabled) return;

    const rect = host.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return;

    const diameter = Math.ceil(Math.sqrt(w * w + h * h));

    const x = this.rippleCentered() ? rect.left + w / 2 : ev.clientX;
    const y = this.rippleCentered() ? rect.top + h / 2 : ev.clientY;

    const left = Math.round(x - rect.left - diameter / 2);
    const top = Math.round(y - rect.top - diameter / 2);

    const ripple = this.r.createElement('span') as HTMLSpanElement;

    this.r.setStyle(ripple, 'position', 'absolute');
    this.r.setStyle(ripple, 'left', `${left}px`);
    this.r.setStyle(ripple, 'top', `${top}px`);
    this.r.setStyle(ripple, 'width', `${diameter}px`);
    this.r.setStyle(ripple, 'height', `${diameter}px`);
    this.r.setStyle(ripple, 'border-radius', '9999px');
    this.r.setStyle(ripple, 'pointer-events', 'none');
    this.r.setStyle(ripple, 'background', this.rippleColor());
    this.r.setStyle(ripple, 'opacity', String(this.rippleOpacity()));
    this.r.setStyle(ripple, 'transform', 'scale(0)');
    this.r.setStyle(ripple, 'will-change', 'transform, opacity');

    const duration = this.rippleDuration();
    this.r.setStyle(
      ripple,
      'transition',
      `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
    );

    this.r.appendChild(host, ripple);

    requestAnimationFrame(() => {
      this.r.setStyle(ripple, 'transform', 'scale(1)');
      this.r.setStyle(ripple, 'opacity', '0');
    });

    window.setTimeout(() => {
      try {
        this.r.removeChild(host, ripple);
      } catch {}
    }, duration + 40);
  }
}
