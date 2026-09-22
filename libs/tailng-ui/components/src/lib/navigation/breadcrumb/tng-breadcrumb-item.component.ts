import { NgTemplateOutlet } from '@angular/common';
import type { OnChanges, OnDestroy
} from '@angular/core';
import {
  booleanAttribute,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  type TemplateRef
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TngBreadcrumbItem as TngBreadcrumbItemPrimitive,
  TngBreadcrumbLink as TngBreadcrumbLinkPrimitive,
} from '@tailng-ui/primitives';
import { Subject } from 'rxjs';
import { TngBreadcrumbSeparatorComponent } from './tng-breadcrumb-separator.component';

export type TngBreadcrumbItemDisplayMode = 'ellipsis' | 'hidden' | 'visible';

@Component({
  selector: 'tng-breadcrumb-item',
  imports: [
    RouterLink,
    NgTemplateOutlet,
    TngBreadcrumbItemPrimitive,
    TngBreadcrumbLinkPrimitive,
    TngBreadcrumbSeparatorComponent,
  ],
  templateUrl: './tng-breadcrumb-item.component.html',
  styleUrl: './tng-breadcrumb-item.component.css',
})
export class TngBreadcrumbItemComponent implements OnChanges, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private keyboardModality = false;

  public readonly stateChanges = new Subject<void>();
  public readonly current = input(false, { transform: booleanAttribute });
  public readonly currentAsLink = input(false, { transform: booleanAttribute });
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly href = input<string | null>(null);
  public readonly routerLink = input<string | readonly (number | string)[] | null>(null);

  protected readonly isFocused = signal(false);
  protected readonly isFocusVisible = signal(false);
  protected readonly displayMode = signal<TngBreadcrumbItemDisplayMode>('visible');
  protected readonly collapseLabel = signal('More');
  protected readonly isResolvedCurrent = signal(false);
  protected readonly separator = signal('/');
  protected readonly separatorTemplate = signal<TemplateRef<unknown> | null>(null);
  protected readonly showSeparator = signal(false);

  public constructor() {
    this.current();
    this.currentAsLink();
    this.disabled();
    this.href();
    this.routerLink();
    queueMicrotask(() => this.stateChanges.next());
  }

  public ngOnChanges(): void {
    this.stateChanges.next();
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  public setDisplayMode(mode: TngBreadcrumbItemDisplayMode, collapseLabel: string): void {
    this.displayMode.set(mode);
    this.collapseLabel.set(collapseLabel);
  }

  public setResolvedCurrent(value: boolean): void {
    this.isResolvedCurrent.set(value);
  }

  public setSeparator(
    separator: string,
    showSeparator: boolean,
    separatorTemplate: TemplateRef<unknown> | null,
  ): void {
    this.separator.set(separator);
    this.showSeparator.set(showSeparator);
    this.separatorTemplate.set(separatorTemplate);
  }

  protected shouldRenderLink(): boolean {
    const hasExplicitTarget = this.hasHrefLink() || this.hasRouterLink();
    if (!hasExplicitTarget) {
      return false;
    }

    if (!this.isResolvedCurrent()) {
      return true;
    }

    return this.currentAsLink();
  }

  protected hasHrefLink(): boolean {
    return this.href() !== null;
  }

  protected hasRouterLink(): boolean {
    return this.routerLink() !== null;
  }

  protected onLinkClick(event: MouseEvent): void {
    if (!this.disabled()) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  @HostListener('keydown')
  protected onKeydown(): void {
    this.keyboardModality = true;
  }

  @HostListener('pointerdown')
  protected onPointerdown(): void {
    this.keyboardModality = false;
  }

  @HostListener('mousedown')
  protected onMousedown(): void {
    this.keyboardModality = false;
  }

  @HostListener('touchstart')
  protected onTouchstart(): void {
    this.keyboardModality = false;
  }

  @HostListener('focusin', ['$event'])
  protected onFocusin(event: FocusEvent): void {
    this.isFocused.set(true);

    const target = event.target;
    if (target instanceof HTMLElement) {
      this.isFocusVisible.set(target.matches(':focus-visible') || this.keyboardModality);
      return;
    }

    this.isFocusVisible.set(this.keyboardModality);
  }

  @HostListener('focusout', ['$event'])
  protected onFocusout(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && this.hostRef.nativeElement.contains(relatedTarget)) {
      return;
    }

    this.isFocused.set(false);
    this.isFocusVisible.set(false);
  }
}
export { TngBreadcrumbItemComponent as TngBreadcrumbItem };
