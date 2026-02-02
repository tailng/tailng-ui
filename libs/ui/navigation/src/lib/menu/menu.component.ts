// menu.component.ts
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  ElementRef,
  ViewChild,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import {
  TngConnectedOverlay,
  TngOverlayPanel,
  TngOverlayRef,
  type TngOverlayCloseReason,
} from '../../../../popups-overlays/src/public-api';

export type MenuCloseReason = TngOverlayCloseReason;

import { TngMenuTemplate } from './menu-template.directive';

export type TngMenuPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

@Component({
  selector: 'tng-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    TngConnectedOverlay,
    TngOverlayPanel,
    TngOverlayRef,
  ],
  templateUrl: './menu.component.html',
})
export class TngMenu {
  
  @ContentChild(TngMenuTemplate)
  private readonly tplDir?: TngMenuTemplate;

  get menuTemplate() {
    return this.tplDir?.tpl;
  }

  @ViewChild('triggerEl', { static: true })
  triggerEl!: ElementRef<HTMLElement>;

  // Modal mode (backdrop semantics)
  readonly modal = input<boolean>(false);

  readonly placement = input<TngMenuPlacement>('bottom-start');
  readonly offset = input<number>(6);
  readonly width = input<'anchor' | number>('anchor');

  readonly closeOnOutsideClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly closeOnItemClick = input<boolean>(true);

  readonly rootKlass = input<string>('relative inline-block');
  readonly triggerKlass = input<string>('inline-flex');
  readonly panelKlass = input<string>('p-1');
  readonly backdropKlass = input<string>('fixed inset-0 bg-black/40 z-[999]');

  readonly opened = output<void>();
  readonly closed = output<MenuCloseReason>();

  readonly isOpen = signal(false);

  // Simple stable id for aria-controls (unique enough per instance)
  private readonly uid = Math.random().toString(36).slice(2);
  readonly menuId = computed(() => `tng-menu-${this.uid}`);

  /** Modal forces predictable close behavior */
  readonly effectiveCloseOnOutsideClick = computed(() =>
    this.modal() ? true : this.closeOnOutsideClick()
  );

  readonly effectiveCloseOnEscape = computed(() =>
    this.modal() ? true : this.closeOnEscape()
  );

  open(): void {
    this.isOpen.set(true);
  }

  onOverlayOpened(): void {
    this.opened.emit();
  }close(reason: MenuCloseReason): void {
    if (!this.isOpen()) return;
  
    this.isOpen.set(false);
    this.closed.emit(reason);
  
    queueMicrotask(() => this.triggerEl?.nativeElement?.focus());
  }
  
  onOverlayOpenChange(open: boolean): void {
    if (open) this.isOpen.set(true);
  }
  
  onOverlayClosed(reason: MenuCloseReason): void {
    this.isOpen.set(false);
    this.closed.emit(reason);
  
    queueMicrotask(() => this.triggerEl?.nativeElement?.focus());
  }

  onTriggerClick(): void {
    this.isOpen() ? this.close('programmatic') : this.open();
  }

  requestCloseOnSelection(): void {
    if (!this.closeOnItemClick()) return;
    this.close('selection');
  }

  onItemSelected(): void {
    this.requestCloseOnSelection();
  }
}
