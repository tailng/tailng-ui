import {
  booleanAttribute,
  Component,
  contentChildren,
  effect,
  input,
  output
} from '@angular/core';
import { TngExpansionPanel } from '../expansion-panel/expansion-panel.component';

@Component({
  selector: 'tng-accordion',
  standalone: true,
  templateUrl: './accordion.component.html',
})
export class TngAccordion {
  /* =====================
   * Inputs
   * ===================== */

  /** Allow multiple panels to be open at once */
  multiple = input(false, { transform: booleanAttribute });

  /**
   * If false: prevents closing the last open panel (at least one stays open)
   * If true: all can be collapsed
   */
  collapsible = input(true, { transform: booleanAttribute });

  /** If true: when all panels are closed, open the first panel automatically */
  autoOpenFirst = input(false, { transform: booleanAttribute });

  /* =====================
   * Outputs
   * ===================== */

  /** Emits current open indexes when changes happen */
  openIndexesChange = output<number[]>();

  /* =====================
   * Klass hooks
   * ===================== */

  rootKlass = input<string>('w-full');
  stackKlass = input<string>('space-y-2');

  /* =====================
   * Children
   * ===================== */

  // All projected expansion panels (descendants enabled so nested layouts still work)
  readonly panels = contentChildren(TngExpansionPanel, { descendants: true });


  constructor() {
    effect((onCleanup) => {
      const panels = this.panels();

      // Subscribe to openChange from each panel
      const subs = panels.map((p) =>
        p.openChange.subscribe((nextOpen) => {
          this.onPanelToggled(p, nextOpen);
        })
      );

      // Emit initial state + optionally auto open first
      this.emitOpenIndexes();
      if (this.autoOpenFirst() && this.getOpenPanels().length === 0 && panels.length > 0) {
        // open first panel
        if (!panels[0].isOpen()) panels[0].toggle();
      }

      onCleanup(() => subs.forEach((s) => s.unsubscribe()));
    });
  }

  private onPanelToggled(panel: TngExpansionPanel, nextOpen: boolean): void {
    const panels = this.panels();

    // If a panel just opened and multiple is false, close all others.
    if (nextOpen && !this.multiple()) {
      for (const p of panels) {
        if (p !== panel && p.isOpen()) {
          p.toggle();
        }
      }
    }

    // If a panel just closed and collapsible is false, ensure at least one stays open.
    if (!nextOpen && !this.collapsible()) {
      // After close, if none are open, reopen this one.
      if (this.getOpenPanels().length === 0) {
        // Reopen the same panel (guard against disabled)
        if (!panel.disabled()) {
          panel.toggle();
          return; // the toggle will trigger emit later
        }
      }
    }

    this.emitOpenIndexes();
  }

  private getOpenPanels(): TngExpansionPanel[] {
    return this.panels().filter((p) => p.isOpen());
  }

  private emitOpenIndexes(): void {
    const panels = this.panels();
    const openIndexes = panels
      .map((p, i) => (p.isOpen() ? i : -1))
      .filter((i) => i >= 0);

    this.openIndexesChange.emit(openIndexes);
  }
}
