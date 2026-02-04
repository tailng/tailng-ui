import { Component, computed, contentChild, input } from '@angular/core';
import { TngCardFooter, TngCardHeader } from './card-slots.directive';

@Component({
  selector: 'tng-card',
  standalone: true,
  templateUrl: './card.component.html',
})
export class TngCard {
  /* =====================
   * Klass hooks
   * ===================== */
  rootKlass = input<string>('');
  headerKlass = input<string>('');
  contentKlass = input<string>('');
  footerKlass = input<string>('');
  klass = input<string>('');

  private headerMarker = contentChild(TngCardHeader);
  private footerMarker = contentChild(TngCardFooter);

  readonly hasHeader = computed(() => !!this.headerMarker());
  readonly hasFooter = computed(() => !!this.footerMarker());

  readonly rootClasses = computed(() =>
    (
      'block rounded-lg border border-border bg-bg text-fg shadow-sm ' +
      this.rootKlass() +
      ' ' +
      this.klass()
    ).trim()
  );

  readonly headerClasses = computed(() =>
    ('border-b border-border px-4 py-3 ' + this.headerKlass()).trim()
  );

  readonly contentClasses = computed(() =>
    ('px-4 py-4 ' + this.contentKlass()).trim()
  );

  readonly footerClasses = computed(() =>
    ('border-t border-border px-4 py-3 ' + this.footerKlass()).trim()
  );
}
