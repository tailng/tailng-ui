import type { OnDestroy } from '@angular/core';
import {
  Component,
  ElementRef,
  HostListener,
  booleanAttribute,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  createCssOverlayPresenceDriver,
  createOverlayPresenceController,
  type TngOverlayPresenceState,
} from '@tailng-ui/cdk';

@Component({
  selector: 'tng-dropdown-menu',
  templateUrl: './tng-dropdown-menu.component.html',
  styleUrl: './tng-dropdown-menu.component.css',
})
export class TngDropdownMenuComponent implements OnDestroy {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly label = input<string>('Actions');

  protected readonly open = signal(false);
  protected readonly rendered = signal(false);
  protected readonly presenceState = signal<TngOverlayPresenceState>('closed');

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly presence = createOverlayPresenceController({
    driver: createCssOverlayPresenceDriver({
      elements: () => {
        const panel = this.panelRef()?.nativeElement;
        return panel === undefined ? [] : [panel];
      },
      windowRef: this.hostRef.nativeElement.ownerDocument.defaultView,
    }),
    onDismiss: () => this.rendered.set(false),
    onPresent: () => this.rendered.set(true),
    onStateChange: (state) => this.presenceState.set(state),
  });
  private removeScrollListener: (() => void) | null = null;

  public ngOnDestroy(): void {
    this.presence.destroy();
    this.teardownScrollListener();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: unknown): void {
    if (!(event instanceof Event)) {
      return;
    }

    if (!this.open()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!this.hostRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKeydown(): void {
    if (!this.open()) {
      return;
    }

    this.closeMenu();
  }

  protected toggleOpen(): void {
    if (this.disabled()) {
      return;
    }

    const nextOpen = !this.open();
    this.setOpenState(nextOpen);
    if (nextOpen) {
      this.setupScrollListener();
      return;
    }

    this.teardownScrollListener();
  }

  private closeMenu(): void {
    this.setOpenState(false);
    this.teardownScrollListener();
  }

  private setOpenState(open: boolean): void {
    this.open.set(open);
    this.presence.setOpen(open);
  }

  private setupScrollListener(): void {
    if (this.removeScrollListener !== null || typeof window === 'undefined') {
      return;
    }

    const onScroll = (): void => {
      this.closeMenu();
    };
    window.addEventListener('scroll', onScroll, true);
    this.removeScrollListener = (): void => window.removeEventListener('scroll', onScroll, true);
  }

  private teardownScrollListener(): void {
    this.removeScrollListener?.();
    this.removeScrollListener = null;
  }
}
export { TngDropdownMenuComponent as TngDropdownMenu };
