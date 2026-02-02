import { Component, signal } from '@angular/core';
import { TngDialog, TngDialogCloseReason } from '@tociva/tailng-ui/popups-overlays';

@Component({
  selector: 'playground-dialog-demo',
  standalone: true,
  imports: [TngDialog],
  templateUrl: './dialog-demo.component.html',
})
export class DialogDemoComponent {
  readonly open = signal(false);
  readonly lastReason = signal<string>('—');
  readonly closing = signal(false);

  private closeTimer: number | null = null;

  openDialog() {
    this.clearTimer();
    this.closing.set(false);
    this.open.set(true);
  }

  onClosed(reason: TngDialogCloseReason) {
    // Always clear any pending programmatic close when dialog closes in any way
    this.clearTimer();
    this.closing.set(false);

    this.lastReason.set(String(reason));
    this.open.set(false);
  }

  closeProgrammatic() {
    if (this.closing()) return;
  
    // Ensure open first
    this.open.set(true);
  
    this.closing.set(true);
    this.lastReason.set('programmatic (closing in 1s)');
  
    setTimeout(() => {
      this.onClosed('programmatic');
    }, 1000);
  }
  
  

  confirm() {
    this.onClosed('confirm');
  }

  cancel() {
    this.onClosed('cancel');
  }

  private clearTimer() {
    if (this.closeTimer != null) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
