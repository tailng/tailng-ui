import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { TNG_ICON_RESOLVER, type TngIconResolver } from './icons.core';
import { bindIconSvgEffect } from './tng-icon.loader-effect';
import { normalizeIconSize, normalizeOptionalString } from './tng-icon.normalizers';
import { parseTngIconSvg, type TngSvgElementNode } from './tng-icon.svg-parser';
import { TngIconSvgRenderer } from './tng-icon.svg-renderer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--tng-icon-size]': 'size()',
    class: 'tng-icon',
    ngSkipHydration: 'true',
  },
  imports: [TngIconSvgRenderer],
  selector: 'tng-icon',
  standalone: true,
  styleUrl: './tng-icon.css',
  templateUrl: './tng-icon.html',
})
export class TngIcon {
  public readonly icon = input.required<string>();
  public readonly label = input<string | null, string | null | undefined>(null, {
    transform: normalizeOptionalString,
  });
  public readonly size = input<string | null, string | number | null | undefined>(null, {
    transform: normalizeIconSize,
  });
  private readonly iconResolver: TngIconResolver = inject(TNG_ICON_RESOLVER);
  private readonly svgDefinitionSignal = signal<TngSvgElementNode | null>(null);

  public constructor() {
    bindIconSvgEffect(this.icon, this.iconResolver, (value): void => {
      this.svgDefinitionSignal.set(value === null ? null : parseTngIconSvg(value));
    });
  }

  protected readonly iconAriaHidden = computed<'true' | null>(() =>
    this.label() === null ? 'true' : null,
  );

  protected readonly iconAriaLabel = computed<string | null>(() => this.label());

  protected readonly iconRole = computed<'img' | null>(() =>
    this.label() === null ? null : 'img',
  );

  protected readonly hasSvg = computed<boolean>(() => this.svgDefinitionSignal() !== null);
  protected readonly svgDefinition = computed<TngSvgElementNode>(() => {
    const definition = this.svgDefinitionSignal();
    if (definition === null) {
      throw new Error('Icon SVG definition is not available.');
    }
    return definition;
  });
}
