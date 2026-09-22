import {
  Component,
  DestroyRef,
  HostBinding,
  NgZone,
  ViewEncapsulation,
  inject,
  input,
  type DoCheck,
} from '@angular/core';
import { createTngIdFactory, getGlobalScrollLockManager } from '@tailng-ui/cdk';
import {
  TngContextMenu as TngContextMenuPrimitive,
  TngMenu as TngMenuPrimitive,
} from '@tailng-ui/primitives';

const createContextMenuLockId = createTngIdFactory('tng-context-menu-lock');

@Component({
  selector: 'tng-context-menu',
  hostDirectives: [
    {
      directive: TngMenuPrimitive,
      inputs: ['loop', 'disabled', 'closeOnSelect', 'dismissOnOutsideClick', 'dismissOnFocusout'],
      outputs: ['tngMenuOpened', 'tngMenuClosed', 'tngMenuSelect'],
    },
    {
      directive: TngContextMenuPrimitive,
    },
  ],
  templateUrl: './tng-context-menu.component.html',
  styleUrl: './tng-context-menu.component.css',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'tngContextMenuComponent',
})
export class TngContextMenuComponent implements DoCheck {
  private readonly menu = inject<TngMenuPrimitive>(TngMenuPrimitive);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly instanceId = createContextMenuLockId();
  private readonly scrollLock = getGlobalScrollLockManager({
    documentRef: typeof document === 'undefined' ? null : document,
  });
  private lastOpenState = false;
  private focusRafId: number | null = null;

  public readonly ariaLabel = input<string>('Context menu');

  public constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.focusRafId !== null) {
        cancelAnimationFrame(this.focusRafId);
      }
      this.scrollLock.release(this.instanceId);
    });
  }

  public ngDoCheck(): void {
    const isOpen = this.menu.isOpen();

    if (!this.lastOpenState && isOpen) {
      this.scrollLock.acquire(this.instanceId);
      this.queuePanelFocus();
    }

    if (!isOpen && this.focusRafId !== null) {
      cancelAnimationFrame(this.focusRafId);
      this.focusRafId = null;
    }

    if (this.lastOpenState && !isOpen) {
      this.scrollLock.release(this.instanceId);
    }

    this.lastOpenState = isOpen;
  }

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }

  @HostBinding('style.--tng-menu-z-overlay')
  protected readonly menuZOverlay =
    'var(--tng-context-menu-z-overlay, var(--tng-context-menu-overlay-z-index, var(--tng-menu-overlay-z-index, var(--tng-z-overlay, 50))))';

  private queuePanelFocus(): void {
    if (this.focusRafId !== null) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.focusRafId = requestAnimationFrame(() => {
        this.focusRafId = null;

        if (this.menu.isOpen()) {
          this.menu.focusPanel();
        }
      });
    });
  }
}
export { TngContextMenuComponent as TngContextMenu };
